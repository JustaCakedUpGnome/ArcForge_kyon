const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// JWT Auth Middleware (optional - for protected routes)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Auth header:', authHeader);
    console.log('Token:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not Set');

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log('JWT verify error:', err);
        console.log('JWT verify user:', user);
        
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Optional auth middleware (sets user if logged in, continues if not)
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
        });
    }
    next();
};

// GET /api/forum/categories - Get all categories with stats
router.get('/categories', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                c.*,
                COUNT(p.id) as actual_post_count,
                MAX(p.last_activity) as last_activity,
                (
                    SELECT json_build_object(
                        'title', p2.title,
                        'user_email', u.email,
                        'created_at', p2.created_at
                    )
                    FROM posts p2 
                    JOIN users u ON p2.user_id = u.id
                    WHERE p2.category_id = c.id 
                    ORDER BY p2.created_at DESC 
                    LIMIT 1
                ) as latest_post
            FROM categories c
            LEFT JOIN posts p ON c.id = p.category_id
            GROUP BY c.id
            ORDER BY c.sort_order ASC, c.name ASC
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET /api/forum/category/:id/posts - Get posts for a category (with pagination)
router.get('/category/:categoryId/posts', optionalAuth, async (req, res) => {
    try {
        const { categoryId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        // Check if category exists and user has access
        const categoryResult = await db.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const category = categoryResult.rows[0];
        
        // Check premium access
        if (category.access_level === 'premium') {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required for premium content' });
            }
            
            const userResult = await db.query('SELECT subscription_status FROM users WHERE id = $1', [req.user.userId]);
            if (userResult.rows[0]?.subscription_status !== 'premium') {
                return res.status(403).json({ error: 'Premium subscription required' });
            }
        }

        // Get posts with user info and stats
        const postsResult = await db.query(`
            SELECT 
                p.*,
                u.email as user_email,
                COALESCE(v.user_vote, 0) as user_vote
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN (
                SELECT votable_id, 
                       CASE WHEN vote_type = 'upvote' THEN 1 ELSE -1 END as user_vote
                FROM votes 
                WHERE user_id = $1 AND votable_type = 'post'
            ) v ON p.id = v.votable_id
            WHERE p.category_id = $2
            ORDER BY p.is_pinned DESC, p.last_activity DESC
            LIMIT $3 OFFSET $4
        `, [req.user?.userId || null, categoryId, limit, offset]);

        // Get total count for pagination
        const countResult = await db.query('SELECT COUNT(*) FROM posts WHERE category_id = $1', [categoryId]);
        const totalPosts = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({
            category,
            posts: postsResult.rows,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// GET /api/forum/post/:id - Get specific post with replies
router.get('/post/:postId', optionalAuth, async (req, res) => {
    try {
        const { postId } = req.params;

        // Get post with user info
        const postResult = await db.query(`
            SELECT 
                p.*,
                u.email as user_email,
                c.name as category_name,
                c.access_level as category_access_level,
                COALESCE(v.user_vote, 0) as user_vote
            FROM posts p
            JOIN users u ON p.user_id = u.id
            JOIN categories c ON p.category_id = c.id
            LEFT JOIN (
                SELECT votable_id, 
                       CASE WHEN vote_type = 'upvote' THEN 1 ELSE -1 END as user_vote
                FROM votes 
                WHERE user_id = $1 AND votable_type = 'post'
            ) v ON p.id = v.votable_id
            WHERE p.id = $2
        `, [req.user?.userId || null, postId]);

        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const post = postResult.rows[0];

        // Check premium access
        if (post.category_access_level === 'premium') {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required for premium content' });
            }
            
            const userResult = await db.query('SELECT subscription_status FROM users WHERE id = $1', [req.user.userId]);
            if (userResult.rows[0]?.subscription_status !== 'premium') {
                return res.status(403).json({ error: 'Premium subscription required' });
            }
        }

        // Get replies with user info
        const repliesResult = await db.query(`
            SELECT 
                r.*,
                u.email as user_email,
                COALESCE(v.user_vote, 0) as user_vote
            FROM replies r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN (
                SELECT votable_id, 
                       CASE WHEN vote_type = 'upvote' THEN 1 ELSE -1 END as user_vote
                FROM votes 
                WHERE user_id = $1 AND votable_type = 'reply'
            ) v ON r.id = v.votable_id
            WHERE r.post_id = $2
            ORDER BY r.created_at ASC
        `, [req.user?.userId || null, postId]);

        res.json({
            post,
            replies: repliesResult.rows
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// POST /api/forum/posts - Create new post (requires auth)
router.post('/posts', authenticateToken, async (req, res) => {
    try {
        console.log('Creating post - req.user:', req.user);
        console.log('req.user.id:', req.user?.id);
        console.log('req.user.userId:', req.user?.userId);
        
        const { categoryId, title, content } = req.body;

        if (!categoryId || !title || !content) {
            return res.status(400).json({ error: 'Category ID, title, and content are required' });
        }

        // Check if category exists and user has access
        const categoryResult = await db.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const category = categoryResult.rows[0];
        
        // Check premium access
        if (category.access_level === 'premium') {
            const userResult = await db.query('SELECT subscription_status FROM users WHERE id = $1', [req.user.userId]);
            if (userResult.rows[0]?.subscription_status !== 'premium') {
                return res.status(403).json({ error: 'Premium subscription required to post in this category' });
            }
        }

        // Create post
        const result = await db.query(`
            INSERT INTO posts (user_id, category_id, title, content)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [req.user.userId, categoryId, title, content]);

        const post = result.rows[0];

        // Get post with user info for response
        const postWithUser = await db.query(`
            SELECT p.*, u.email as user_email
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = $1
        `, [post.id]);

        res.status(201).json(postWithUser.rows[0]);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// POST /api/forum/post/:id/replies - Create reply (requires auth)
router.post('/post/:postId/replies', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        // Check if post exists and user has access to category
        const postResult = await db.query(`
            SELECT p.*, c.access_level 
            FROM posts p 
            JOIN categories c ON p.category_id = c.id 
            WHERE p.id = $1
        `, [postId]);

        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const post = postResult.rows[0];

        // Check premium access
        if (post.access_level === 'premium') {
            const userResult = await db.query('SELECT subscription_status FROM users WHERE id = $1', [req.user.userId]);
            if (userResult.rows[0]?.subscription_status !== 'premium') {
                return res.status(403).json({ error: 'Premium subscription required to reply in this category' });
            }
        }

        // Create reply
        const result = await db.query(`
            INSERT INTO replies (post_id, user_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [postId, req.user.userId, content]);

        const reply = result.rows[0];

        // Get reply with user info for response
        const replyWithUser = await db.query(`
            SELECT r.*, u.email as user_email
            FROM replies r
            JOIN users u ON r.user_id = u.id
            WHERE r.id = $1
        `, [reply.id]);

        res.status(201).json(replyWithUser.rows[0]);
    } catch (error) {
        console.error('Error creating reply:', error);
        res.status(500).json({ error: 'Failed to create reply' });
    }
});

// POST /api/forum/vote - Vote on posts/replies (requires auth)
router.post('/vote', authenticateToken, async (req, res) => {
    try {
        const { votableType, votableId, voteType } = req.body;

        if (!['post', 'reply'].includes(votableType) || !['upvote', 'downvote'].includes(voteType)) {
            return res.status(400).json({ error: 'Invalid vote parameters' });
        }

        // Check if votable item exists
        const table = votableType === 'post' ? 'posts' : 'replies';
        const itemResult = await db.query(`SELECT id FROM ${table} WHERE id = $1`, [votableId]);
        
        if (itemResult.rows.length === 0) {
            return res.status(404).json({ error: `${votableType} not found` });
        }

        // Upsert vote (update if exists, insert if not)
        await db.query(`
            INSERT INTO votes (user_id, votable_type, votable_id, vote_type)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, votable_type, votable_id)
            DO UPDATE SET vote_type = EXCLUDED.vote_type, created_at = CURRENT_TIMESTAMP
        `, [req.user.userId, votableType, votableId, voteType]);

        // Get updated vote counts
        const voteCountResult = await db.query(`
            SELECT 
                SUM(CASE WHEN vote_type = 'upvote' THEN 1 ELSE 0 END) as upvotes,
                SUM(CASE WHEN vote_type = 'downvote' THEN 1 ELSE 0 END) as downvotes
            FROM votes 
            WHERE votable_type = $1 AND votable_id = $2
        `, [votableType, votableId]);

        const { upvotes, downvotes } = voteCountResult.rows[0];

        // Update vote counts in the main table
        await db.query(`
            UPDATE ${table} 
            SET upvotes = $1, downvotes = $2 
            WHERE id = $3
        `, [parseInt(upvotes) || 0, parseInt(downvotes) || 0, votableId]);

        res.json({ 
            upvotes: parseInt(upvotes) || 0, 
            downvotes: parseInt(downvotes) || 0,
            userVote: voteType === 'upvote' ? 1 : -1
        });
    } catch (error) {
        console.error('Error voting:', error);
        res.status(500).json({ error: 'Failed to process vote' });
    }
});

// GET /api/forum/stats - Get forum statistics
router.get('/stats', async (req, res) => {
    try {
        const statsResult = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM posts) as total_posts,
                (SELECT COUNT(*) FROM replies) as total_replies,
                (SELECT COUNT(*) FROM users WHERE created_at > CURRENT_DATE - INTERVAL '30 days') as total_members
        `);

        const stats = statsResult.rows[0];
        res.json({
            totalPosts: parseInt(stats.total_posts) || 0,
            totalReplies: parseInt(stats.total_replies) || 0,
            totalMembers: parseInt(stats.total_members) || 0
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// DELETE /api/forum/posts/:id - Delete post (admin only)
router.delete('/posts/:postId', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        
        // Check if user is admin
        const userResult = await db.query('SELECT role FROM users WHERE id = $1', [req.user.userId]);
        if (userResult.rows[0]?.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        // Delete the post (cascades to replies due to foreign key)
        const result = await db.query('DELETE FROM posts WHERE id = $1 RETURNING *', [postId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// GET /api/forum/recent-activity - Get recent forum activity
router.get('/recent-activity', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Get recent posts and replies combined
        const activityResult = await db.query(`
            (
                SELECT 
                    'post' as type,
                    p.id,
                    p.title,
                    p.created_at,
                    u.email as user_email,
                    c.name as category_name,
                    p.reply_count
                FROM posts p
                JOIN users u ON p.user_id = u.id
                JOIN categories c ON p.category_id = c.id
                WHERE c.access_level = 'public'
            )
            UNION ALL
            (
                SELECT 
                    'reply' as type,
                    r.id,
                    p.title,
                    r.created_at,
                    u.email as user_email,
                    c.name as category_name,
                    0 as reply_count
                FROM replies r
                JOIN posts p ON r.post_id = p.id
                JOIN users u ON r.user_id = u.id
                JOIN categories c ON p.category_id = c.id
                WHERE c.access_level = 'public'
            )
            ORDER BY created_at DESC
            LIMIT $1
        `, [limit]);

        res.json(activityResult.rows);
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ error: 'Failed to fetch recent activity' });
    }
});

module.exports = router;