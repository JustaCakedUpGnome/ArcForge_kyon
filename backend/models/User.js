const pool = require('../config/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class User {
    // Create a new user
    static async create(email, password, username) {
        try {
            // Hash the password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            
            // Insert user into database
            const query = 'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username, created_at, subscription_status';
            const values = [email, passwordHash, username];
            
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Find user by email
    static async findByEmail(email) {
        try {
            const query = 'SELECT id, email, username, password_hash, created_at, updated_at, subscription_status, stripe_customer_id, stripe_subscription_id, subscription_expires_at FROM users WHERE email = $1';
            const values = [email];
            
            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }
    
    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw error;
        }
    }
    
    // Generate and store password reset token
    static async generatePasswordResetToken(email) {
        try {
            const token = crypto.randomBytes(32).toString('hex');
            const expires = new Date(Date.now() + 3600000); // 1 hour from now
            
            const query = 'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3 RETURNING id, email';
            const values = [token, expires, email];
            
            const result = await pool.query(query, values);
            return result.rows[0] ? token : null;
        } catch (error) {
            throw error;
        }
    }
    
    // Find user by reset token
    static async findByResetToken(token) {
        try {
            const query = 'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()';
            const values = [token];
            
            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }
    
    // Update password and clear reset token
    static async updatePassword(userId, newPassword) {
        try {
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(newPassword, saltRounds);
            
            const query = 'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email';
            const values = [passwordHash, userId];
            
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Check if username is available
    static async isUsernameAvailable(username) {
        try {
            const query = 'SELECT id FROM users WHERE username = $1';
            const values = [username];
            
            const result = await pool.query(query, values);
            return result.rows.length === 0;
        } catch (error) {
            throw error;
        }
    }
    
    // Find user by username
    static async findByUsername(username) {
        try {
            const query = 'SELECT id, email, username, created_at, subscription_status FROM users WHERE username = $1';
            const values = [username];
            
            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }
    
    // Update username
    static async updateUsername(userId, newUsername) {
        try {
            const query = 'UPDATE users SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, username';
            const values = [newUsername, userId];
            
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;