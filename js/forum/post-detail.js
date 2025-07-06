// Post Detail Page JavaScript
class PostDetailPage {
    constructor() {
        this.authSystem = window.authSystem || new AuthSystem();
        this.accessControl = window.accessControl || new AccessControl();
        this.postId = this.getPostIdFromUrl();
        this.post = null;
        this.replies = [];
        this.postEditor = null;
        this.replyEditors = new Map();
        this.init();
    }
    
    getPostIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
    
    init() {
        if (!this.postId) {
            this.showError('Invalid post ID');
            return;
        }
        
        this.loadPost();
    }
    
    async loadPost() {
        try {
            const data = await window.forumAPI.getPost(this.postId);
            this.post = data.post;
            this.replies = data.replies || [];
            
            this.renderPost();
            this.renderReplies();
            this.setupReplyForm();
            
        } catch (error) {
            console.error('Error loading post:', error);
            this.showError('Failed to load post. It may have been deleted or you may not have access.');
        }
    }
    
    renderPost() {
        const container = document.getElementById('post-content');
        const isAdmin = this.isAdmin();
        const isAuthor = this.isAuthor(this.post.user_id);
        const canEdit = isAuthor || isAdmin;
        
        // Update page title and breadcrumb
        document.title = `${this.post.title} - ARCFORGE`;
        document.getElementById('breadcrumb-post').textContent = this.truncateTitle(this.post.title, 50);
        
        container.innerHTML = `
            <div class="post-card">
                <div class="post-meta">
                    <div class="post-author-info">
                        <div class="author-avatar">${this.post.username.charAt(0).toUpperCase()}</div>
                        <div class="author-details">
                            <div class="author-name">${this.post.username}</div>
                            <div class="post-timestamp">${this.formatTimeAgo(this.post.created_at)}${this.post.is_edited ? ' <span style="color: #888; font-size: 11px;">(edited)</span>' : ''}</div>
                        </div>
                    </div>
                    <div class="post-actions">
                        <div class="vote-buttons">
                            <button class="vote-btn ${this.post.user_vote === 1 ? 'active' : ''}" 
                                    onclick="postPage.vote('post', ${this.post.id}, 'upvote')">
                                ↑ ${this.post.upvotes}
                            </button>
                            <button class="vote-btn ${this.post.user_vote === -1 ? 'active' : ''}" 
                                    onclick="postPage.vote('post', ${this.post.id}, 'downvote')">
                                ↓ ${this.post.downvotes}
                            </button>
                        </div>
                        ${canEdit ? `
                            <div class="${isAdmin ? 'admin-controls' : 'author-controls'}">
                                <button class="edit-btn" onclick="postPage.editPost()" title="Edit Post">
                                    ✏️ Edit
                                </button>
                                <button class="delete-btn" onclick="postPage.deletePost()" title="Delete Post">
                                    🗑️ Delete
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <a href="category.html?id=${this.post.category_id}" class="post-category ${this.post.category_access_level === 'premium' ? 'premium' : ''}">
                    ${this.post.category_name}
                </a>
                
                <h1 class="post-title">${this.post.title}</h1>
                
                <div class="post-content">${this.post.content}</div>
                
                <div class="inline-edit-container" id="post-edit-container" style="display: none;">
                    <input type="text" class="inline-edit-title" id="edit-post-title" placeholder="Post title...">
                    <div id="post-rich-editor"></div>
                    <div class="inline-edit-actions">
                        <button class="inline-save-btn" onclick="postPage.saveInlineEdit()">💾 Save</button>
                        <button class="inline-cancel-btn" onclick="postPage.cancelInlineEdit()">✖️ Cancel</button>
                        <span class="edit-hint">Press Escape to cancel</span>
                    </div>
                </div>
                
                <div class="post-stats">
                    <span>💬 ${this.post.reply_count} replies</span>
                    <span>👁️ Last activity ${this.formatTimeAgo(this.post.last_activity || this.post.created_at)}</span>
                    <span>📅 Posted ${this.formatDate(this.post.created_at)}</span>
                </div>
            </div>
        `;
        
        // Show replies section
        document.getElementById('replies-section').style.display = 'block';
    }
    
    renderReplies() {
        const container = document.getElementById('replies-list');
        const countElement = document.getElementById('reply-count');
        
        countElement.textContent = `${this.replies.length} ${this.replies.length === 1 ? 'reply' : 'replies'}`;
        
        if (this.replies.length === 0) {
            container.innerHTML = `
                <div class="auth-required">
                    <p>No replies yet. Be the first to join the discussion!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.replies.map(reply => {
            const isAdmin = this.isAdmin();
            const isAuthor = this.isAuthor(reply.user_id);
            const canEdit = isAuthor || isAdmin;
            
            return `
                <div class="reply-item">
                    <div class="reply-header">
                        <div class="reply-author">
                            <div class="reply-avatar">${reply.username.charAt(0).toUpperCase()}</div>
                            <div class="reply-author-name">${reply.username}</div>
                            <div class="reply-timestamp">${this.formatTimeAgo(reply.created_at)}${reply.is_edited ? ' <span style="color: #888; font-size: 11px;">(edited)</span>' : ''}</div>
                        </div>
                        <div class="reply-actions">
                            <div class="reply-votes">
                                <button class="reply-vote-btn ${reply.user_vote === 1 ? 'active' : ''}" 
                                        onclick="postPage.vote('reply', ${reply.id}, 'upvote')">
                                    ↑ ${reply.upvotes}
                                </button>
                                <button class="reply-vote-btn ${reply.user_vote === -1 ? 'active' : ''}" 
                                        onclick="postPage.vote('reply', ${reply.id}, 'downvote')">
                                    ↓ ${reply.downvotes}
                                </button>
                            </div>
                            ${canEdit ? `
                                <div class="reply-controls">
                                    <button class="edit-btn" onclick="postPage.editReply(${reply.id})" title="Edit Reply">
                                        ✏️
                                    </button>
                                    <button class="delete-btn" onclick="postPage.deleteReply(${reply.id})" title="Delete Reply">
                                        🗑️
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="reply-content">${reply.content}</div>
                    <div class="inline-edit-container reply-edit-container" id="reply-edit-${reply.id}" style="display: none;">
                        <div id="reply-rich-editor-${reply.id}"></div>
                        <div class="inline-edit-actions">
                            <button class="inline-save-btn" onclick="postPage.saveReplyInlineEdit(${reply.id})">💾 Save</button>
                            <button class="inline-cancel-btn" onclick="postPage.cancelReplyInlineEdit(${reply.id})">✖️ Cancel</button>
                            <span class="edit-hint">Press Escape to cancel</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    setupReplyForm() {
        const container = document.getElementById('reply-form-container');
        
        if (!this.authSystem.isLoggedIn()) {
            container.innerHTML = `
                <div class="auth-required">
                    <p>Login to join the discussion</p>
                    <button onclick="window.authSystem.showModal()">Login / Sign Up</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="reply-form">
                <div class="reply-form-title">💭 Add your thoughts</div>
                <div id="reply-rich-editor"></div>
                <div class="reply-actions">
                    <div class="reply-hint">Rich text editor with optional Markdown mode</div>
                    <button class="reply-submit" id="reply-submit" onclick="postPage.submitReply()">
                        Post Reply
                    </button>
                </div>
            </div>
        `;
        
        // Initialize Rich Text Editor for reply form
        this.replyFormEditor = new RichTextEditor(document.getElementById('reply-rich-editor'), {
            placeholder: 'Share your insights, ask follow-up questions, or add your experience to the discussion...',
            minHeight: '150px',
            showModeToggle: true
        });
    }
    
    async submitReply() {
        if (!this.replyFormEditor) {
            alert('Reply editor not initialized');
            return;
        }
        
        const content = this.replyFormEditor.getValue().trim();
        const submitBtn = document.getElementById('reply-submit');
        
        if (!content || content.length < 5) {
            alert('Reply must be at least 5 characters long');
            this.replyFormEditor.focus();
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';
        
        try {
            await window.forumAPI.createReply(this.postId, content);
            
            // Reload post to show new reply
            await this.loadPost();
            
            // Clear form
            this.replyFormEditor.setValue('');
            
        } catch (error) {
            console.error('Error posting reply:', error);
            alert('Failed to post reply. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Reply';
        }
    }
    
    async vote(type, id, voteType) {
        if (!this.authSystem.isLoggedIn()) {
            this.authSystem.showModal();
            return;
        }
        
        try {
            await window.forumAPI.vote(type, id, voteType);
            // Reload post to show updated votes
            this.loadPost();
        } catch (error) {
            console.error('Voting error:', error);
            alert('Failed to vote. Please try again.');
        }
    }
    
    async deletePost() {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }
        
        try {
            await window.forumAPI.deletePost(this.postId);
            alert('Post deleted successfully!');
            window.location.href = '/pages/forum/forum.html';
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete post. You may not have permission.');
        }
    }
    
    isAdmin() {
        const token = localStorage.getItem('arcforge_token');
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.email === 'arcforge.tech@gmail.com';
        } catch (error) {
            return false;
        }
    }
    
    isAuthor(authorUserId) {
        const token = localStorage.getItem('arcforge_token');
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId === authorUserId;
        } catch (error) {
            return false;
        }
    }
    
    async editPost() {
        // Get the post card and add editing class
        const postCard = document.querySelector('.post-card');
        postCard.classList.add('editing');
        
        // Show the inline edit container
        const editContainer = document.getElementById('post-edit-container');
        editContainer.style.display = 'block';
        
        // Fill in current values
        document.getElementById('edit-post-title').value = this.post.title;
        
        // Initialize Rich Text Editor for post content
        this.postEditor = new RichTextEditor(document.getElementById('post-rich-editor'), {
            initialValue: this.post.content,
            placeholder: 'Edit your post content...',
            minHeight: '200px',
            showModeToggle: true
        });
        
        // Focus on title field
        document.getElementById('edit-post-title').focus();
        
        // Add escape key handler
        this.escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.cancelInlineEdit();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
    }
    
    cancelInlineEdit() {
        // Remove editing class
        const postCard = document.querySelector('.post-card');
        postCard.classList.remove('editing');
        
        // Hide the inline edit container
        const editContainer = document.getElementById('post-edit-container');
        editContainer.style.display = 'none';
        
        // Clean up Rich Text Editor
        if (this.postEditor) {
            this.postEditor = null;
        }
        
        // Remove escape key handler
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }
    }
    
    async saveInlineEdit() {
        const title = document.getElementById('edit-post-title').value.trim();
        
        if (!this.postEditor) {
            alert('Post editor not initialized');
            return;
        }
        
        const content = this.postEditor.getValue().trim();
        
        if (!title || title.length < 10) {
            alert('Title must be at least 10 characters long');
            document.getElementById('edit-post-title').focus();
            return;
        }
        
        if (!content || content.length < 20) {
            alert('Content must be at least 20 characters long');
            this.postEditor.focus();
            return;
        }
        
        // Disable save button during save
        const saveBtn = document.querySelector('.inline-save-btn');
        const originalText = saveBtn.textContent;
        saveBtn.disabled = true;
        saveBtn.textContent = '💾 Saving...';
        
        try {
            await window.forumAPI.editPost(this.postId, { title, content });
            this.cancelInlineEdit();
            await this.loadPost(); // Reload to show changes
        } catch (error) {
            console.error('Error editing post:', error);
            alert('Failed to edit post. Please try again.');
            saveBtn.disabled = false;
            saveBtn.textContent = originalText;
        }
    }
    
    async editReply(replyId) {
        // Find the reply to edit
        const reply = this.replies.find(r => r.id === replyId);
        if (!reply) {
            alert('Reply not found');
            return;
        }
        
        // Find the reply item and add editing class
        const replyItem = document.querySelector(`#reply-edit-${replyId}`).closest('.reply-item');
        replyItem.classList.add('editing');
        
        // Show the inline edit container for this reply
        const editContainer = document.getElementById(`reply-edit-${replyId}`);
        editContainer.style.display = 'block';
        
        // Initialize Rich Text Editor for reply content
        const replyEditor = new RichTextEditor(document.getElementById(`reply-rich-editor-${replyId}`), {
            initialValue: reply.content,
            placeholder: 'Edit your reply...',
            minHeight: '150px',
            showModeToggle: true
        });
        
        // Store the editor instance
        this.replyEditors.set(replyId, replyEditor);
        
        // Add escape key handler for this specific reply
        this.replyEscapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.cancelReplyInlineEdit(replyId);
            }
        };
        document.addEventListener('keydown', this.replyEscapeHandler);
    }
    
    cancelReplyInlineEdit(replyId) {
        // Remove editing class from reply item
        const replyItem = document.querySelector(`#reply-edit-${replyId}`).closest('.reply-item');
        replyItem.classList.remove('editing');
        
        // Hide the inline edit container
        const editContainer = document.getElementById(`reply-edit-${replyId}`);
        editContainer.style.display = 'none';
        
        // Clean up Rich Text Editor
        if (this.replyEditors.has(replyId)) {
            this.replyEditors.delete(replyId);
        }
        
        // Remove escape key handler
        if (this.replyEscapeHandler) {
            document.removeEventListener('keydown', this.replyEscapeHandler);
            this.replyEscapeHandler = null;
        }
    }
    
    async saveReplyInlineEdit(replyId) {
        const editor = this.replyEditors.get(replyId);
        if (!editor) {
            alert('Reply editor not found');
            return;
        }
        
        const content = editor.getValue().trim();
        
        if (!content || content.length < 5) {
            alert('Reply content must be at least 5 characters long');
            editor.focus();
            return;
        }
        
        // Disable save button during save
        const saveBtn = document.querySelector(`#reply-edit-${replyId} .inline-save-btn`);
        const originalText = saveBtn.textContent;
        saveBtn.disabled = true;
        saveBtn.textContent = '💾 Saving...';
        
        try {
            await window.forumAPI.editReply(replyId, content);
            this.cancelReplyInlineEdit(replyId);
            await this.loadPost(); // Reload to show changes
        } catch (error) {
            console.error('Error editing reply:', error);
            alert('Failed to edit reply. Please try again.');
            saveBtn.disabled = false;
            saveBtn.textContent = originalText;
        }
    }
    
    async deleteReply(replyId) {
        if (!confirm('Are you sure you want to delete this reply? This action cannot be undone.')) {
            return;
        }
        
        try {
            await window.forumAPI.deleteReply(replyId);
            await this.loadPost(); // Reload to show changes
        } catch (error) {
            console.error('Error deleting reply:', error);
            alert('Failed to delete reply. You may not have permission.');
        }
    }
    
    showError(message) {
        document.getElementById('post-content').innerHTML = `
            <div class="error-state">
                <h3>Error Loading Post</h3>
                <p>${message}</p>
                <a href="/pages/forum/forum.html" class="btn btn-secondary" style="display: inline-block; margin-top: 15px;">
                    ← Back to Forum
                </a>
            </div>
        `;
    }
    
    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    truncateTitle(title, maxLength) {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength) + '...';
    }
}

// Generate stars background function
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const numStars = 150;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    window.postPage = new PostDetailPage();
});