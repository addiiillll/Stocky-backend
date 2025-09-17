const express = require('express');
const rewardRoutes = require('./rewardRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Stocky API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount auth routes
router.use('/auth', authRoutes);

// Mount reward routes
router.use('/', rewardRoutes);

module.exports = router;