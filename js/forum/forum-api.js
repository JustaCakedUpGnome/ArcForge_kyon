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
            throw error;
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
            throw error;
        }
    }

    async getPost(postId) {
        try {
            const response = await fetch(`${this.baseURL}/api/forum/post/${postId}`);
            if (!response.ok) throw new Error('Failed to fetch post');
            return await response.json();
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
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
            throw error;
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
            throw error;
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
            throw error;
        }
    }

    // Edit Post
    async editPost(postId, postData) {
        try {
            const token = localStorage.getItem('arcforge_token');
            if (!token) throw new Error('Authentication required');

            const response = await fetch(`${this.baseURL}/api/forum/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) throw new Error('Failed to edit post');
            return await response.json();
        } catch (error) {
            console.error('Error editing post:', error);
            throw error;
        }
    }

    // Delete Post
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

    // Edit Reply
    async editReply(replyId, content) {
        try {
            const token = localStorage.getItem('arcforge_token');
            if (!token) throw new Error('Authentication required');

            const response = await fetch(`${this.baseURL}/api/forum/replies/${replyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) throw new Error('Failed to edit reply');
            return await response.json();
        } catch (error) {
            console.error('Error editing reply:', error);
            throw error;
        }
    }

    // Delete Reply
    async deleteReply(replyId) {
        try {
            const token = localStorage.getItem('arcforge_token');
            if (!token) throw new Error('Authentication required');

            const response = await fetch(`${this.baseURL}/api/forum/replies/${replyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete reply');
            return await response.json();
        } catch (error) {
            console.error('Error deleting reply:', error);
            throw error;
        }
    }

    // Search Forum
    async searchForum(query, filters = {}) {
        try {
            const params = new URLSearchParams({
                q: query,
                ...filters
            });
            
            const response = await fetch(`${this.baseURL}/api/forum/search?${params}`);
            if (!response.ok) throw new Error('Failed to search forum');
            return await response.json();
        } catch (error) {
            console.error('Error searching forum:', error);
            throw error;
        }
    }

}

// Global forum API instance
window.forumAPI = new ForumAPI();