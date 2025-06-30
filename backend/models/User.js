const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    // Create a new user
    static async create(email, password) {
        try {
            // Hash the password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            
            // Insert user into database
            const query = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at';
            const values = [email, passwordHash];
            
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Find user by email
    static async findByEmail(email) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
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
}

module.exports = User;