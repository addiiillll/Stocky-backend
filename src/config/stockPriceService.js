const prisma = require('./database');

class StockPriceService {
  // Mock stock price API - returns random prices
  static async fetchStockPrice(symbol) {
    const basePrice = {
      'RELIANCE': 2500,
      'TCS': 3800,
      'INFOSYS': 1600,
      'HDFC': 1700,
      'ICICIBANK': 950
    };
    
    const base = basePrice[symbol] || 1000;
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    return (base * (1 + variation)).toFixed(4);
  }

  static async updateAllStockPrices() {
    try {
      const stocks = await prisma.stock.findMany();
      
      for (const stock of stocks) {
        const price = await this.fetchStockPrice(stock.symbol);
        await prisma.stockPrice.create({
          data: {
            stockId: stock.id,
            price: parseFloat(price)
          }
        });
      }
      
      console.log(`Updated prices for ${stocks.length} stocks`);
    } catch (error) {
      console.error('Error updating stock prices:', error);
    }
  }

  static async getLatestPrice(stockId) {
    return await prisma.stockPrice.findFirst({
      where: { stockId },
      orderBy: { timestamp: 'desc' }
    });
  }
}

module.exports = StockPriceService;