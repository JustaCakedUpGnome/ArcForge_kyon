const pool = require('../config/database');

async function createUsersTable() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        await pool.query(query);
        console.log('✅ Users table created successfully');
        
        // Exit the process
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating users table:', error);
        process.exit(1);
    }
}

createUsersTable();