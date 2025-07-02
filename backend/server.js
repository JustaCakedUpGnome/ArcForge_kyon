const express = require('express');
const cors = require('cors');
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

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ARCFORGE backend running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});