// Frontend Authentication System for ARCFORGE
class AuthSystem {
    constructor() {
        this.baseURL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';
        this.token = localStorage.getItem('arcforge_token');
        this.user = JSON.parse(localStorage.getItem('arcforge_user') || 'null');
        this.init();
    }

    init() {
        this.createLoginModal();
        this.bindEvents();
        this.updateUserDisplay();
    }

    // Create terminal-style login modal
    createLoginModal() {
        const modalHTML = `
            <div id="auth-modal" class="auth-modal hidden">
                <div class="auth-overlay"></div>
                <div class="auth-terminal">
                    <div class="auth-header">
                        <span class="auth-title">ARCFORGE AUTHENTICATION</span>
                        <button class="auth-close" id="auth-close">×</button>
                    </div>
                    <div class="auth-content">
                        <div class="auth-prompt">
                            <span class="auth-user">guest@arcforge:~$</span>
                            <span class="auth-command" id="auth-mode">login</span>
                        </div>
                        <form id="auth-form" class="auth-form">
                            <div class="auth-field">
                                <label>email:</label>
                                <input type="email" id="auth-email" required autocomplete="email">
                            </div>
                            <div class="auth-field" id="auth-username-field" style="display: none;">
                                <label>username:</label>
                                <input type="text" id="auth-username" autocomplete="username" placeholder="3-50 chars, letters/numbers/_/-">
                            </div>
                            <div class="auth-field">
                                <label>password:</label>
                                <input type="password" id="auth-password" required autocomplete="current-password">
                            </div>
                            <div class="auth-actions">
                                <button type="submit" id="auth-submit">execute</button>
                                <button type="button" id="auth-toggle">switch to signup</button>
                            </div>
                            <div class="auth-forgot">
                                <button type="button" id="forgot-password-btn" class="forgot-link">forgot password?</button>
                            </div>
                        </form>
                        <div id="auth-error" class="auth-error hidden"></div>
                        <div id="auth-loading" class="auth-loading hidden">
                            <span>processing...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addAuthStyles();
    }

    // Add CSS styles for the auth modal
    addAuthStyles() {
        const styles = `
            <style id="auth-styles">
                .auth-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .auth-modal.hidden {
                    display: none;
                }

                .auth-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(4px);
                }

                .auth-terminal {
                    position: relative;
                    background: #0a0a0a;
                    border: 2px solid #333;
                    border-radius: 8px;
                    width: 90%;
                    max-width: 500px;
                    font-family: "JetBrains Mono", monospace;
                    color: #e0e0e0;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
                }

                .auth-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid #333;
                    background: #111;
                    border-radius: 6px 6px 0 0;
                }

                .auth-title {
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: 1px;
                }

                .auth-close {
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s ease;
                }

                .auth-close:hover {
                    color: #e0e0e0;
                }

                .auth-content {
                    padding: 20px;
                }

                .auth-prompt {
                    margin-bottom: 20px;
                    font-size: 14px;
                }

                .auth-user {
                    color: #aaa;
                }

                .auth-command {
                    color: #fff;
                    font-weight: 600;
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .auth-field {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .auth-field label {
                    font-size: 12px;
                    color: #aaa;
                    text-transform: lowercase;
                }

                .auth-field input {
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 4px;
                    padding: 10px 12px;
                    color: #e0e0e0;
                    font-family: "JetBrains Mono", monospace;
                    font-size: 14px;
                    width: 100%;
                    box-sizing: border-box;
                    transition: border-color 0.2s ease;
                }

                .auth-field input:focus {
                    outline: none;
                    border-color: #666;
                    background: #0a0a0a;
                }

                .auth-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }

                .auth-actions button {
                    background: #222;
                    border: 1px solid #444;
                    border-radius: 4px;
                    padding: 8px 16px;
                    color: #e0e0e0;
                    font-family: "JetBrains Mono", monospace;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .auth-actions button:hover {
                    background: #333;
                    border-color: #666;
                }

                .auth-actions button[type="submit"] {
                    background: #2a2a2a;
                    color: #fff;
                    font-weight: 600;
                }

                .auth-forgot {
                    margin-top: 10px;
                    text-align: center;
                }

                .forgot-link {
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 11px;
                    text-decoration: underline;
                    cursor: pointer;
                    font-family: "JetBrains Mono", monospace;
                    transition: color 0.2s ease;
                }

                .forgot-link:hover {
                    color: #aaa;
                }

                .auth-error {
                    margin-top: 15px;
                    padding: 10px;
                    background: rgba(220, 53, 69, 0.1);
                    border: 1px solid rgba(220, 53, 69, 0.3);
                    border-radius: 4px;
                    color: #ff6b6b;
                    font-size: 12px;
                }

                .auth-loading {
                    margin-top: 15px;
                    text-align: center;
                    color: #aaa;
                    font-size: 12px;
                }

                .hidden {
                    display: none !important;
                }

                /* Field validation styles */
                .auth-field input.field-success {
                    border-color: #28a745;
                    background: rgba(40, 167, 69, 0.1);
                }

                .auth-field input.field-error {
                    border-color: #dc3545;
                    background: rgba(220, 53, 69, 0.1);
                }

                .field-message {
                    margin-top: 5px;
                    font-size: 11px;
                    padding: 4px 8px;
                    border-radius: 3px;
                }

                .field-message-success {
                    color: #28a745;
                    background: rgba(40, 167, 69, 0.1);
                    border: 1px solid rgba(40, 167, 69, 0.3);
                }

                .field-message-error {
                    color: #dc3545;
                    background: rgba(220, 53, 69, 0.1);
                    border: 1px solid rgba(220, 53, 69, 0.3);
                }

                /* Password strength indicator */
                .password-strength {
                    margin-top: 8px;
                }

                .strength-bar {
                    height: 4px;
                    background: #333;
                    border-radius: 2px;
                    overflow: hidden;
                    margin-bottom: 5px;
                }

                .strength-fill {
                    height: 100%;
                    transition: width 0.3s ease, background-color 0.3s ease;
                    border-radius: 2px;
                }

                .strength-fill.strength-0 {
                    width: 0%;
                    background: #333;
                }

                .strength-fill.strength-1 {
                    width: 25%;
                    background: #dc3545;
                }

                .strength-fill.strength-2 {
                    width: 50%;
                    background: #fd7e14;
                }

                .strength-fill.strength-3 {
                    width: 75%;
                    background: #ffc107;
                }

                .strength-fill.strength-4 {
                    width: 100%;
                    background: #28a745;
                }

                .strength-text {
                    font-size: 11px;
                    color: #aaa;
                }

                /* User indicator in bottom-left */
                .user-indicator {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: rgba(17, 17, 17, 0.9);
                    border: 1px solid #333;
                    border-radius: 4px;
                    padding: 8px 12px;
                    font-family: "JetBrains Mono", monospace;
                    font-size: 12px;
                    color: #e0e0e0;
                    z-index: 1000;
                }

                @media (max-width: 768px) {
                    .auth-terminal {
                        width: 95%;
                        margin: 20px;
                    }
                    
                    .auth-content {
                        padding: 15px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Bind event listeners
    bindEvents() {
        // Login button (create one if it doesn't exist)
        this.createLoginButton();

        // Modal events
        document.getElementById('auth-close').addEventListener('click', () => this.hideModal());
        
        // Store the toggle handler so we can remove it later
        this.toggleModeHandler = () => this.toggleMode();
        document.getElementById('auth-toggle').addEventListener('click', this.toggleModeHandler);
        
        document.getElementById('auth-form').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('forgot-password-btn').addEventListener('click', () => this.showForgotPassword());

        // Real-time validation
        document.getElementById('auth-email').addEventListener('input', (e) => this.validateEmailField(e));
        document.getElementById('auth-username').addEventListener('input', (e) => this.validateUsernameField(e));
        document.getElementById('auth-password').addEventListener('input', (e) => this.validatePasswordField(e));

        // Close modal on overlay click
        document.querySelector('.auth-overlay').addEventListener('click', () => this.hideModal());

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !document.getElementById('auth-modal').classList.contains('hidden')) {
                this.hideModal();
            }
        });
    }

    // Create login button in the top-right
    createLoginButton() {
        if (document.getElementById('login-btn')) return; // Already exists

        const loginBtn = document.createElement('button');
        loginBtn.id = 'login-btn';
        loginBtn.textContent = 'login';
        loginBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(17, 17, 17, 0.9);
            border: 1px solid #333;
            border-radius: 4px;
            padding: 8px 16px;
            color: #e0e0e0;
            font-family: "JetBrains Mono", monospace;
            font-size: 12px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.2s ease;
        `;

        loginBtn.addEventListener('mouseenter', () => {
            loginBtn.style.background = '#333';
            loginBtn.style.borderColor = '#666';
        });

        loginBtn.addEventListener('mouseleave', () => {
            loginBtn.style.background = 'rgba(17, 17, 17, 0.9)';
            loginBtn.style.borderColor = '#333';
        });

        loginBtn.addEventListener('click', () => {
            if (this.isLoggedIn()) {
                this.logout();
                // Redirect to home after logout from any page
                window.location.href = '/';
            } else {
                this.showModal();
            }
        });

        document.body.appendChild(loginBtn);
    }

    // Show the auth modal
    showModal() {
        // Reset to login mode every time modal is opened
        const mode = document.getElementById('auth-mode');
        const submit = document.getElementById('auth-submit');
        const toggle = document.getElementById('auth-toggle');
        const passwordField = document.getElementById('auth-password').parentElement;
        const forgotBtn = document.getElementById('forgot-password-btn').parentElement;

        mode.textContent = 'login';
        submit.textContent = 'execute';
        toggle.textContent = 'switch to signup';
        passwordField.style.display = 'block';
        forgotBtn.style.display = 'block';

        // Show modal and focus
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('auth-email').focus();
    }

    // Hide the auth modal
    hideModal() {
        document.getElementById('auth-modal').classList.add('hidden');
        this.clearForm();
        this.hideError();
        this.hideLoading();
    }

    // Toggle between login and signup modes
    toggleMode() {
        const mode = document.getElementById('auth-mode');
        const submit = document.getElementById('auth-submit');
        const toggle = document.getElementById('auth-toggle');
        const usernameField = document.getElementById('auth-username-field');
        const usernameInput = document.getElementById('auth-username');

        if (mode.textContent === 'login') {
            mode.textContent = 'signup';
            submit.textContent = 'create account';
            toggle.textContent = 'switch to login';
            usernameField.style.display = 'block';
            usernameInput.required = true;
        } else {
            mode.textContent = 'login';
            submit.textContent = 'execute';
            toggle.textContent = 'switch to signup';
            usernameField.style.display = 'none';
            usernameInput.required = false;
        }

        this.clearForm();
        this.hideError();
    }

    // Show forgot password modal
    showForgotPassword() {
        const mode = document.getElementById('auth-mode');
        const submit = document.getElementById('auth-submit');
        const toggle = document.getElementById('auth-toggle');
        const passwordField = document.getElementById('auth-password').parentElement;
        const forgotBtn = document.getElementById('forgot-password-btn').parentElement;

        mode.textContent = 'forgot-password';
        submit.textContent = 'send reset link';
        toggle.textContent = 'back to login';
        passwordField.style.display = 'none';
        forgotBtn.style.display = 'none';

        // Update toggle handler - remove current and add new
        toggle.removeEventListener('click', this.toggleModeHandler);
        this.backToLoginHandler = () => this.backToLogin();
        toggle.addEventListener('click', this.backToLoginHandler);

        this.clearForm();
        this.hideError();
    }

    // Back to login from forgot password
    backToLogin() {
        const mode = document.getElementById('auth-mode');
        const submit = document.getElementById('auth-submit');
        const toggle = document.getElementById('auth-toggle');
        const passwordField = document.getElementById('auth-password').parentElement;
        const forgotBtn = document.getElementById('forgot-password-btn').parentElement;

        mode.textContent = 'login';
        submit.textContent = 'execute';
        toggle.textContent = 'switch to signup';
        passwordField.style.display = 'block';
        forgotBtn.style.display = 'block';

        // Restore original toggle handler
        toggle.removeEventListener('click', this.backToLoginHandler);
        toggle.addEventListener('click', this.toggleModeHandler);

        this.clearForm();
        this.hideError();
    }

    // Handle forgot password submission
    async handleForgotPassword(email) {
        try {
            const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                this.showError('If the email exists, a password reset link has been sent', 'success');
                setTimeout(() => this.backToLogin(), 3000);
            } else {
                this.showError(data.error || 'Failed to send reset email');
            }
        } catch (error) {
            this.showError('Connection failed. Please try again.');
        }
    }

    // Handle form submission
    async handleSubmit(event) {
        event.preventDefault();
        
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const username = document.getElementById('auth-username').value;
        const mode = document.getElementById('auth-mode').textContent;

        // Handle forgot password mode
        if (mode === 'forgot-password') {
            if (!email) {
                this.showError('Email is required');
                return;
            }
            this.showLoading();
            this.hideError();
            await this.handleForgotPassword(email);
            this.hideLoading();
            return;
        }

        // Validation
        if (!email || !password) {
            this.showError('Email and password are required');
            return;
        }

        if (mode === 'signup' && !username) {
            this.showError('Username is required for signup');
            return;
        }

        if (mode === 'signup' && !this.validateUsername(username)) {
            this.showError('Username must be 3-50 characters, letters/numbers/_/- only');
            return;
        }

        this.showLoading();
        this.hideError();

        try {
            const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
            const requestBody = mode === 'login' 
                ? { email, password }
                : { email, password, username };
                
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.ok) {
                this.handleAuthSuccess(data);
            } else {
                this.showError(data.error || 'Authentication failed');
            }
        } catch (error) {
            this.showError('Connection failed. Is the server running?');
        } finally {
            this.hideLoading();
        }
    }

    // Handle successful authentication
    handleAuthSuccess(data) {
        this.token = data.token;
        this.user = data.user;
        
        localStorage.setItem('arcforge_token', this.token);
        localStorage.setItem('arcforge_user', JSON.stringify(this.user));
        
        this.hideModal();
        this.updateUserDisplay();
        
        console.log('Authentication successful:', data.message);
    }

    // Logout user
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('arcforge_token');
        localStorage.removeItem('arcforge_user');
        this.updateUserDisplay();
        
        // Always redirect to home after logout (unless already on home page)
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            window.location.href = '/';
        }
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!this.token && !!this.user;
    }

    // Update user display in UI
    updateUserDisplay() {
        // Update login button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.textContent = this.isLoggedIn() ? 'logout' : 'login';
        }

        // Update user indicator
        this.updateUserIndicator();
    }

    // Update user indicator in bottom-left
    updateUserIndicator() {
        let indicator = document.getElementById('user-indicator');
        
        if (this.isLoggedIn()) {
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'user-indicator';
                indicator.className = 'user-indicator';
                indicator.style.cursor = 'pointer';
                indicator.title = 'Click to view profile';
                indicator.addEventListener('click', () => {
                    window.location.href = '/profile.html';
                });
                document.body.appendChild(indicator);
            }
            
            const username = this.user.username || this.user.email.split('@')[0];
            indicator.textContent = `${username}@arcforge`;
        } else {
            if (indicator) {
                indicator.remove();
            }
        }
    }

    // Utility methods
    showError(message, type = 'error') {
        const errorEl = document.getElementById('auth-error');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        
        // Add success styling for success messages
        if (type === 'success') {
            errorEl.style.background = 'rgba(40, 167, 69, 0.1)';
            errorEl.style.borderColor = 'rgba(40, 167, 69, 0.3)';
            errorEl.style.color = '#28a745';
        } else {
            errorEl.style.background = 'rgba(220, 53, 69, 0.1)';
            errorEl.style.borderColor = 'rgba(220, 53, 69, 0.3)';
            errorEl.style.color = '#ff6b6b';
        }
    }

    hideError() {
        document.getElementById('auth-error').classList.add('hidden');
    }

    showLoading() {
        document.getElementById('auth-loading').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('auth-loading').classList.add('hidden');
    }

    clearForm() {
        document.getElementById('auth-email').value = '';
        document.getElementById('auth-password').value = '';
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Password strength validation
    validatePassword(password) {
        const checks = {
            length: password.length >= 8,
            lowercase: /(?=.*[a-z])/.test(password),
            uppercase: /(?=.*[A-Z])/.test(password),
            number: /(?=.*\d)/.test(password)
        };
        
        const strength = Object.values(checks).filter(Boolean).length;
        
        return {
            valid: strength >= 4,
            strength: strength,
            checks: checks,
            message: this.getPasswordMessage(checks, strength)
        };
    }

    // Get password strength message
    getPasswordMessage(checks, strength) {
        if (strength === 0) return 'Enter a password';
        if (!checks.length) return 'Must be at least 8 characters';
        if (!checks.lowercase) return 'Must contain a lowercase letter';
        if (!checks.uppercase) return 'Must contain an uppercase letter';
        if (!checks.number) return 'Must contain a number';
        if (strength >= 4) return 'Strong password ✓';
        return 'Password requirements not met';
    }

    // Username validation
    validateUsername(username) {
        if (!username) return false;
        if (username.length < 3 || username.length > 50) return false;
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        return usernameRegex.test(username);
    }

    // Real-time email validation
    validateEmailField(event) {
        const email = event.target.value;
        const field = event.target;
        
        this.clearFieldValidation(field);
        
        if (email.length === 0) return;
        
        if (this.isValidEmail(email)) {
            this.showFieldSuccess(field, '✓ Valid email');
        } else {
            this.showFieldError(field, '✗ Invalid email format');
        }
    }

    // Real-time username validation
    validateUsernameField(event) {
        const username = event.target.value;
        const field = event.target;
        
        this.clearFieldValidation(field);
        
        if (username.length === 0) return;
        
        if (this.validateUsername(username)) {
            // Check availability with backend (debounced)
            this.checkUsernameAvailability(username, field);
        } else {
            this.showFieldError(field, '✗ 3-50 characters, letters/numbers/_/- only');
        }
    }

    // Check username availability with debouncing
    checkUsernameAvailability(username, field) {
        clearTimeout(this.usernameCheckTimeout);
        this.usernameCheckTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`${this.baseURL}/auth/check-username/${username}`);
                const data = await response.json();
                
                if (response.ok && data.available) {
                    this.showFieldSuccess(field, '✓ Username available');
                } else {
                    this.showFieldError(field, '✗ Username already taken');
                }
            } catch (error) {
                this.showFieldSuccess(field, '✓ Valid format');
            }
        }, 500);
    }

    // Real-time password validation
    validatePasswordField(event) {
        const password = event.target.value;
        const field = event.target;
        
        this.clearFieldValidation(field);
        
        if (password.length === 0) return;
        
        const validation = this.validatePassword(password);
        const strength = validation.strength;
        
        // Show strength indicator
        this.updatePasswordStrength(field, strength, validation.message);
        
        if (validation.valid) {
            this.showFieldSuccess(field, validation.message);
        } else {
            this.showFieldError(field, validation.message);
        }
    }

    // Update password strength indicator
    updatePasswordStrength(field, strength, message) {
        let indicator = field.parentNode.querySelector('.password-strength');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'password-strength';
            field.parentNode.appendChild(indicator);
        }
        
        const strengthBar = `
            <div class="strength-bar">
                <div class="strength-fill strength-${strength}"></div>
            </div>
            <div class="strength-text">${message}</div>
        `;
        
        indicator.innerHTML = strengthBar;
    }

    // Show field success
    showFieldSuccess(field, message) {
        field.classList.remove('field-error');
        field.classList.add('field-success');
        this.showFieldMessage(field, message, 'success');
    }

    // Show field error
    showFieldError(field, message) {
        field.classList.remove('field-success');
        field.classList.add('field-error');
        this.showFieldMessage(field, message, 'error');
    }

    // Clear field validation
    clearFieldValidation(field) {
        field.classList.remove('field-success', 'field-error');
        const message = field.parentNode.querySelector('.field-message');
        if (message) message.remove();
    }

    // Show field message
    showFieldMessage(field, message, type) {
        let messageEl = field.parentNode.querySelector('.field-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'field-message';
            field.parentNode.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.className = `field-message field-message-${type}`;
    }

    // Get auth token for API requests
    getAuthHeader() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});