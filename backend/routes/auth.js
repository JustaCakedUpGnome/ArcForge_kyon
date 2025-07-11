const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email validation function
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// Password validation function
const validatePassword = (password) => {
    if (!password) return { valid: false, message: 'Password is required' };
    if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
    if (!/(?=.*[a-z])/.test(password)) return { valid: false, message: 'Password must contain at least one lowercase letter' };
    if (!/(?=.*[A-Z])/.test(password)) return { valid: false, message: 'Password must contain at least one uppercase letter' };
    if (!/(?=.*\d)/.test(password)) return { valid: false, message: 'Password must contain at least one number' };
    return { valid: true };
};

// Username validation function
const validateUsername = (username) => {
    if (!username) return { valid: false, message: 'Username is required' };
    if (username.length < 3) return { valid: false, message: 'Username must be at least 3 characters' };
    if (username.length > 50) return { valid: false, message: 'Username must be less than 50 characters' };
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return { valid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
    return { valid: true };
};

// Signup endpoint
router.post('/signup', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        
        // Validate input presence
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Email, password, and username are required' });
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }
        
        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ error: passwordValidation.message });
        }
        
        // Validate username format
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.valid) {
            return res.status(400).json({ error: usernameValidation.message });
        }
        
        // Check if email already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        
        // Check if username is available
        const isUsernameAvailable = await User.isUsernameAvailable(username);
        if (!isUsernameAvailable) {
            return res.status(400).json({ error: 'Username is already taken' });
        }
        
        // Create new user
        const newUser = await User.create(email, password, username);
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            message: 'User created successfully',
            token: token,
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                createdAt: newUser.created_at,
                subscriptionStatus: newUser.subscription_status || 'free'
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input presence
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }
        
        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Verify password
        const isValidPassword = await User.verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.created_at,
                subscriptionStatus: user.subscription_status || 'free'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Forgot password endpoint
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate input presence
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }
        
        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({ message: 'If the email exists, a password reset link has been sent' });
        }
        
        // Generate reset token
        const resetToken = await User.generatePasswordResetToken(email);
        if (!resetToken) {
            return res.status(500).json({ error: 'Failed to generate reset token' });
        }
        
        // Send reset email
        const resetUrl = `${process.env.FRONTEND_URL || 'https://arcforge.tech'}/reset-password.html?token=${resetToken}`;
        
        const mailOptions = {
            from: '"ARCFORGE" <arcforge.tech@gmail.com>',
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: 'Courier New', monospace; background: #111; color: #00ff00; padding: 20px; border: 1px solid #333;">
                    <h2 style="color: #00ff00; text-shadow: 0 0 10px #00ff00;">ARCFORGE Password Reset</h2>
                    <p>A password reset was requested for your account.</p>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetUrl}" style="color: #00ff00; text-decoration: underline;">${resetUrl}</a>
                    <p style="margin-top: 20px; color: #888;">This link will expire in 1 hour.</p>
                    <p style="color: #888;">If you didn't request this reset, please ignore this email.</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; color: #666;">
                        <p>- ARCFORGE Heavy Duty Training</p>
                    </div>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        
        res.json({ message: 'If the email exists, a password reset link has been sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to process password reset request' });
    }
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        // Validate input presence
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }
        
        // Validate password strength
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            return res.status(400).json({ error: passwordValidation.message });
        }
        
        // Find user by reset token
        const user = await User.findByResetToken(token);
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }
        
        // Update password
        const updatedUser = await User.updatePassword(user.id, newPassword);
        if (!updatedUser) {
            return res.status(500).json({ error: 'Failed to update password' });
        }
        
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// Check username availability endpoint
router.get('/check-username/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        // Validate username format
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.valid) {
            return res.status(400).json({ error: usernameValidation.message });
        }
        
        // Check availability
        const isAvailable = await User.isUsernameAvailable(username);
        
        res.json({
            username: username,
            available: isAvailable,
            message: isAvailable ? 'Username is available' : 'Username is already taken'
        });
    } catch (error) {
        console.error('Username check error:', error);
        res.status(500).json({ error: 'Failed to check username availability' });
    }
});

// Update username endpoint
router.post('/update-username', async (req, res) => {
    try {
        // JWT middleware for protected route
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        const jwt = require('jsonwebtoken');
        let user;
        try {
            user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        
        const { username } = req.body;
        
        // Validate username format
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.valid) {
            return res.status(400).json({ error: usernameValidation.message });
        }
        
        // Check if username is available (but allow current user's username)
        const currentUser = await User.findByEmail(user.email);
        if (currentUser.username !== username) {
            const isAvailable = await User.isUsernameAvailable(username);
            if (!isAvailable) {
                return res.status(400).json({ error: 'Username is already taken' });
            }
        }
        
        // Update username
        const updatedUser = await User.updateUsername(user.userId, username);
        if (!updatedUser) {
            return res.status(500).json({ error: 'Failed to update username' });
        }
        
        res.json({
            message: 'Username updated successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                username: updatedUser.username
            }
        });
    } catch (error) {
        console.error('Update username error:', error);
        res.status(500).json({ error: 'Failed to update username' });
    }
});

module.exports = router;