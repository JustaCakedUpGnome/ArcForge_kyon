const pool = require('../config/database');

async function addPasswordResetColumns() {
    try {
        const query = `
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
            ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;
        `;
        
        await pool.query(query);
        console.log('✅ Password reset columns added successfully');
        
        // Exit the process
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding password reset columns:', error);
        process.exit(1);
    }
}

addPasswordResetColumns();