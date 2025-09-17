const prisma = require('../config/database');

class RewardModel {
  static async createReward(userId, stockSymbol, quantity, timestamp = new Date()) {
    return await prisma.$transaction(async (tx) => {
      // Get or create stock
      let stock = await tx.stock.findUnique({
        where: { symbol: stockSymbol }
      });

      if (!stock) {
        stock = await tx.stock.create({
          data: {
            symbol: stockSymbol,
            name: stockSymbol // In real app, fetch from stock API
          }
        });
      }

      // Create reward event
      const reward = await tx.rewardEvent.create({
        data: {
          userId,
          stockId: stock.id,
          quantity: parseFloat(quantity),
          timestamp
        }
      });

      // Create ledger entries for double-entry bookkeeping
      const stockPrice = 2500; // Mock price - in real app, fetch current price
      const totalValue = parseFloat(quantity) * stockPrice;
      const brokerage = totalValue * 0.001; // 0.1% brokerage
      const stt = totalValue * 0.001; // 0.1% STT
      const gst = brokerage * 0.18; // 18% GST on brokerage

      // Stock reward entry (asset)
      await tx.ledgerEntry.create({
        data: {
          userId,
          stockId: stock.id,
          entryType: 'STOCK_REWARD',
          amount: totalValue,
          quantity: parseFloat(quantity),
          description: `Rewarded ${quantity} shares of ${stockSymbol}`
        }
      });

      // Cash outflow entry (liability)
      await tx.ledgerEntry.create({
        data: {
          userId,
          stockId: stock.id,
          entryType: 'CASH_OUTFLOW',
          amount: -totalValue,
          description: `Cash outflow for ${quantity} shares of ${stockSymbol}`
        }
      });

      // Fee entries
      await tx.ledgerEntry.createMany({
        data: [
          {
            userId,
            stockId: stock.id,
            entryType: 'BROKERAGE_FEE',
            amount: -brokerage,
            description: `Brokerage fee for ${stockSymbol} reward`
          },
          {
            userId,
            stockId: stock.id,
            entryType: 'STT_FEE',
            amount: -stt,
            description: `STT fee for ${stockSymbol} reward`
          },
          {
            userId,
            stockId: stock.id,
            entryType: 'GST_FEE',
            amount: -gst,
            description: `GST on brokerage for ${stockSymbol} reward`
          }
        ]
      });

      return reward;
    });
  }

  static async getTodayRewards(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await prisma.rewardEvent.findMany({
      where: {
        userId,
        timestamp: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        stock: true
      }
    });
  }

  static async getHistoricalINR(userId) {
    const yesterday = new Date();
    yesterday.setHours(0, 0, 0, 0);

    const rewards = await prisma.rewardEvent.findMany({
      where: {
        userId,
        timestamp: {
          lt: yesterday
        }
      },
      include: {
        stock: true
      }
    });

    // Group by date and calculate INR value
    const groupedByDate = {};
    for (const reward of rewards) {
      const date = reward.timestamp.toISOString().split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = 0;
      }
      // Mock calculation - in real app, use historical prices
      groupedByDate[date] += parseFloat(reward.quantity) * 2500;
    }

    return groupedByDate;
  }

  static async getUserStats(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's rewards grouped by stock
    const todayRewards = await prisma.rewardEvent.groupBy({
      by: ['stockId'],
      where: {
        userId,
        timestamp: {
          gte: today,
          lt: tomorrow
        }
      },
      _sum: {
        quantity: true
      }
    });

    // Get stock details
    const stockIds = todayRewards.map(r => r.stockId);
    const stocks = await prisma.stock.findMany({
      where: { id: { in: stockIds } }
    });

    const todayStocks = todayRewards.map(reward => {
      const stock = stocks.find(s => s.id === reward.stockId);
      return {
        symbol: stock.symbol,
        totalShares: reward._sum.quantity
      };
    });

    // Current portfolio value
    const allRewards = await prisma.rewardEvent.findMany({
      where: { userId },
      include: { stock: true }
    });

    let portfolioValue = 0;
    const holdings = {};

    for (const reward of allRewards) {
      if (!holdings[reward.stock.symbol]) {
        holdings[reward.stock.symbol] = 0;
      }
      holdings[reward.stock.symbol] += parseFloat(reward.quantity);
    }

    // Calculate current value (mock prices)
    for (const [symbol, quantity] of Object.entries(holdings)) {
      portfolioValue += quantity * 2500; // Mock price
    }

    return {
      todayStocks,
      currentPortfolioValue: portfolioValue
    };
  }

  static async getPortfolio(userId) {
    const rewards = await prisma.rewardEvent.findMany({
      where: { userId },
      include: { stock: true }
    });

    const holdings = {};
    for (const reward of rewards) {
      const symbol = reward.stock.symbol;
      if (!holdings[symbol]) {
        holdings[symbol] = { quantity: 0, currentValue: 0 };
      }
      holdings[symbol].quantity += parseFloat(reward.quantity);
    }

    // Calculate current values (mock prices)
    for (const [symbol, holding] of Object.entries(holdings)) {
      holding.currentValue = holding.quantity * 2500; // Mock price
    }

    return holdings;
  }
}

module.exports = RewardModel;