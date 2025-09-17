const express = require('express');
const RewardController = require('../controllers/rewardController');
const { validateReward, validateUserId } = require('../middlewares/validation');

const router = express.Router();

// POST /reward - Record that a user has been rewarded X shares of a stock
router.post('/reward', validateReward, RewardController.createReward);

// GET /today-stocks/:userId - Return all stock rewards for the user for today
router.get('/today-stocks/:userId', validateUserId, RewardController.getTodayStocks);

// GET /historical-inr/:userId - Return the INR value of the user's stock rewards for all past days
router.get('/historical-inr/:userId', validateUserId, RewardController.getHistoricalINR);

// GET /stats/:userId - Return total shares rewarded today and current INR value
router.get('/stats/:userId', validateUserId, RewardController.getUserStats);

// GET /portfolio/:userId - Bonus: Show holdings per stock symbol with current INR value
router.get('/portfolio/:userId', validateUserId, RewardController.getPortfolio);

module.exports = router;