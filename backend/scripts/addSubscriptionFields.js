const pool = require('../config/database');

async function addSubscriptionFields() {
    try {
        const query = `
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'free',
            ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
            ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255),
            ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP;
        `;
        
        await pool.query(query);
        console.log('✅ Subscription fields added successfully');
        
        // Exit the process
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding subscription fields:', error);
        process.exit(1);
    }
}

addSubscriptionFields();