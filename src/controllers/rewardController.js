const RewardModel = require('../models/RewardModel');

class RewardController {
  static async createReward(req, res, next) {
    try {
      const { userId, stockSymbol, quantity, timestamp } = req.body;
      
      const reward = await RewardModel.createReward(
        userId, 
        stockSymbol, 
        quantity, 
        timestamp ? new Date(timestamp) : undefined
      );

      res.status(201).json({
        success: true,
        data: reward,
        message: 'Reward created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTodayStocks(req, res, next) {
    try {
      const { userId } = req.params;
      const rewards = await RewardModel.getTodayRewards(userId);

      res.json({
        success: true,
        data: rewards,
        message: 'Today\'s stock rewards retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHistoricalINR(req, res, next) {
    try {
      const { userId } = req.params;
      const historicalData = await RewardModel.getHistoricalINR(userId);

      res.json({
        success: true,
        data: historicalData,
        message: 'Historical INR data retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserStats(req, res, next) {
    try {
      const { userId } = req.params;
      const stats = await RewardModel.getUserStats(userId);

      res.json({
        success: true,
        data: stats,
        message: 'User stats retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPortfolio(req, res, next) {
    try {
      const { userId } = req.params;
      const portfolio = await RewardModel.getPortfolio(userId);

      res.json({
        success: true,
        data: portfolio,
        message: 'Portfolio retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RewardController;