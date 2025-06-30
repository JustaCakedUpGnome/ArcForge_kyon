const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup endpoint
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        
        // Create new user
        const newUser = await User.create(email, password);
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            message: 'User created successfully',
            token: token,
            user: {
                id: newUser.id,
                email: newUser.email,
                createdAt: newUser.created_at
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
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
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
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;