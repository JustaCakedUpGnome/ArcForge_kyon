const express = require('express');
const cors = require('cors');
const MigrationRunner = require('./migrations');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ARCFORGE backend online',
        timestamp: new Date().toISOString()
    });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Forum routes
app.use('/api/forum', require('./routes/forum'));

// Start server with auto-migration
async function startServer() {
    try {
        // Run database migrations first
        console.log('🔄 Checking for database migrations...');
        await MigrationRunner.runMigrations();
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 ARCFORGE backend running on port ${PORT}`);
            console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();