require('dotenv').config();
const app = require('./src/app');
const cron = require('node-cron');
const StockPriceService = require('./src/config/stockPriceService');

const PORT = process.env.PORT || 3000;

// Schedule stock price updates every hour
cron.schedule('0 * * * *', () => {
  console.log('Updating stock prices...');
  StockPriceService.updateAllStockPrices();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Stocky API server running on port ${PORT}`);
  console.log(`Stock prices will be updated every hour`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});