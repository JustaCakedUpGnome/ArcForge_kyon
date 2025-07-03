// Forum API Communication Layer
class ForumAPI {
    constructor() {
        this.baseURL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://arcforge.tech';
    }

    // Categories
    async getCategories() {
        try {
            const response = await fetch(`${this.baseURL}/api/forum/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return this.getMockCategories();
        }
    }

    // Posts
    async getCategoryPosts(categoryId, page = 1, limit = 20) {
        try {
            const response = await fetch(`${this.baseURL}/api/forum/category/${categoryId}/posts?page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            return await response.json();
        } catch (error) {
            console.error('Error fetching posts:', error);
            return this.getMockPosts();
        }
    }

    async getPost(postId) {
        try {
            const response = await fetch(`${this.baseURL}/api/forum/post/${postId}`);
            if (!response.ok) throw new Error('Failed to fetch post');
            return await response.json();
        } catch (error) {
            console.error('Error fetching post:', error);
            return this.getMockPost();
        }
    }

    async createPost(postData) {
        try {
            const token = localStorage.getItem('arcforge_token');
            if (!token) throw new Error('Authentication required');

            const response = await fetch(`${this.baseURL}/api/forum/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) throw new Error('Failed to create post');
            return await response.json();
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    // Replies
    async createReply(postId, content) {
        try {
            const token = localStorage.getItem('arcforge_token');
            if (!token) throw new Error('Authentication required');

            const response = await fetch(`${this.baseURL}/api/forum/post/${postId}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) throw new Error('Failed to create reply');
            return await response.json();
        } catch (error) {
            console.error('Error creating reply:', error);
            throw error;
        }
    }

    // Voting
    async vote(type, id, voteType) {
        try {
            const token = localStorage.getItem('arcforge_token');
            if (!token) throw new Error('Authentication required');

            const response = await fetch(`${this.baseURL}/api/forum/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    votable_type: type,
                    votable_id: id,
                    vote_type: voteType
                })
            });

            if (!response.ok) throw new Error('Failed to vote');
            return await response.json();
        } catch (error) {
            console.error('Error voting:', error);
            throw error;
        }
    }

    // Search
    async search(query, page = 1) {
        try {
            const response = await fetch(`${this.baseURL}/api/forum/search?q=${encodeURIComponent(query)}&page=${page}`);
            if (!response.ok) throw new Error('Failed to search');
            return await response.json();
        } catch (error) {
            console.error('Error searching:', error);
            return { posts: [], total: 0 };
        }
    }

    // Stats
    async getStats() {
        try {
            const response = await fetch(`${this.baseURL}/api/forum/stats`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            return await response.json();
        } catch (error) {
            console.error('Error fetching stats:', error);
            return this.getMockStats();
        }
    }

    // Recent Activity
    async getRecentActivity(limit = 10) {
        try {
            const response = await fetch(`${this.baseURL}/api/forum/recent-activity?limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch recent activity');
            return await response.json();
        } catch (error) {
            console.error('Error fetching recent activity:', error);
            return this.getMockRecentActivity();
        }
    }

    // Admin: Delete Post
    async deletePost(postId) {
        try {
            const token = localStorage.getItem('arcforge_token');
            if (!token) throw new Error('Authentication required');

            const response = await fetch(`${this.baseURL}/api/forum/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete post');
            return await response.json();
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }

    // Mock data for development
    getMockCategories() {
        return [
            {
                id: 1,
                name: 'Foundation',
                description: 'Basic Heavy Duty principles, getting started with training',
                access_level: 'public',
                post_count: 12,
                sort_order: 1
            },
            {
                id: 2,
                name: 'Methodology',
                description: 'Training splits, progression methods, workout planning',
                access_level: 'public',
                post_count: 8,
                sort_order: 2
            },
            {
                id: 3,
                name: 'Progress Logs',
                description: 'Share your workout logs, progress photos, and achievements',
                access_level: 'public',
                post_count: 15,
                sort_order: 3
            },
            {
                id: 4,
                name: 'Q&A',
                description: 'General questions and community help',
                access_level: 'public',
                post_count: 6,
                sort_order: 4
            },
            {
                id: 5,
                name: 'Advanced',
                description: 'Premium: CNS management, advanced techniques, exclusive content',
                access_level: 'premium',
                post_count: 4,
                sort_order: 5
            },
            {
                id: 6,
                name: 'Equipment',
                description: 'Gear reviews, equipment recommendations, home gym setups',
                access_level: 'public',
                post_count: 3,
                sort_order: 6
            }
        ];
    }

    getMockPosts() {
        return {
            posts: [
                {
                    id: 1,
                    title: 'Getting started with Heavy Duty - beginner questions',
                    content: 'I\'ve read about Heavy Duty training but not sure where to start...',
                    user: { email: 'beginner@example.com', subscription_status: 'free' },
                    upvotes: 5,
                    downvotes: 0,
                    reply_count: 3,
                    created_at: '2025-07-01T10:00:00Z',
                    last_activity: '2025-07-02T14:30:00Z'
                },
                {
                    id: 2,
                    title: 'CNS fatigue - how do you know when to rest?',
                    content: 'Struggling to identify when I need extra rest days...',
                    user: { email: 'trainer@example.com', subscription_status: 'premium' },
                    upvotes: 8,
                    downvotes: 1,
                    reply_count: 7,
                    created_at: '2025-07-01T15:00:00Z',
                    last_activity: '2025-07-02T16:00:00Z'
                }
            ],
            total: 2,
            page: 1,
            totalPages: 1
        };
    }

    getMockPost() {
        return {
            id: 1,
            title: 'Getting started with Heavy Duty - beginner questions',
            content: 'I\'ve read about Heavy Duty training but not sure where to start. Should I jump right into the goto split or build up to it?',
            user: { email: 'beginner@example.com', subscription_status: 'free' },
            category: { id: 1, name: 'Foundation' },
            upvotes: 5,
            downvotes: 0,
            reply_count: 3,
            created_at: '2025-07-01T10:00:00Z',
            replies: [
                {
                    id: 1,
                    content: 'Start with the foundation principles first, then work up to the full split.',
                    user: { email: 'expert@example.com', subscription_status: 'premium' },
                    upvotes: 3,
                    downvotes: 0,
                    created_at: '2025-07-01T12:00:00Z'
                }
            ]
        };
    }

    getMockStats() {
        return {
            totalPosts: 48,
            totalReplies: 127,
            totalMembers: 23
        };
    }

    getMockRecentActivity() {
        return [
            { 
                type: 'post',
                title: 'Started my first HD routine - feedback needed', 
                category_name: 'Foundation', 
                user_email: 'NewTrainee@example.com', 
                created_at: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
                reply_count: 3
            },
            { 
                type: 'reply',
                title: 'CNS recovery protocols for advanced trainees', 
                category_name: 'Advanced', 
                user_email: 'HDVeteran@example.com', 
                created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
                reply_count: 7
            },
            { 
                type: 'post',
                title: '6 month progress - 40lb strength gains', 
                category_name: 'Progress Logs', 
                user_email: 'StrengthSeeker@example.com', 
                created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                reply_count: 12
            }
        ];
    }
}

// Global forum API instance
window.forumAPI = new ForumAPI();