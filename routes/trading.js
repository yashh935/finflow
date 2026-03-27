const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { stocks } = require('../data/stocks');

// In-memory portfolio store (in production: use a real DB)
const portfolios = new Map();

const STARTING_CASH = 10000;

function getOrCreatePortfolio(userId) {
  if (!portfolios.has(userId)) {
    portfolios.set(userId, {
      userId,
      cash: STARTING_CASH,
      startingCash: STARTING_CASH,
      holdings: {},
      transactions: [],
      createdAt: new Date().toISOString()
    });
  }
  return portfolios.get(userId);
}

function getCurrentPrice(ticker) {
  if (!stocks[ticker]) return null;
  // Add small random fluctuation to simulate live market
  const base = stocks[ticker].price;
  const fluctuation = (Math.random() - 0.5) * 0.002 * base;
  return parseFloat((base + fluctuation).toFixed(2));
}

function calcPortfolioValue(portfolio) {
  let holdingsValue = 0;
  for (const [ticker, holding] of Object.entries(portfolio.holdings)) {
    const price = getCurrentPrice(ticker);
    if (price) holdingsValue += holding.shares * price;
  }
  return {
    cash: portfolio.cash,
    holdingsValue: parseFloat(holdingsValue.toFixed(2)),
    totalValue: parseFloat((portfolio.cash + holdingsValue).toFixed(2)),
    totalReturn: parseFloat((portfolio.cash + holdingsValue - portfolio.startingCash).toFixed(2)),
    totalReturnPct: parseFloat(((portfolio.cash + holdingsValue - portfolio.startingCash) / portfolio.startingCash * 100).toFixed(2))
  };
}

// GET all available stocks
router.get('/stocks', (req, res) => {
  const stockList = Object.entries(stocks).map(([ticker, data]) => ({
    ticker,
    name: data.name,
    sector: data.sector,
    price: getCurrentPrice(ticker),
    change: data.change,
    changePct: data.changePct,
    marketCap: data.marketCap
  }));
  res.json({ success: true, stocks: stockList, timestamp: new Date().toISOString() });
});

// GET single stock detail with history
router.get('/stocks/:ticker', (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const stock = stocks[ticker];
  if (!stock) return res.status(404).json({ success: false, error: 'Stock not found' });
  
  res.json({
    success: true,
    stock: {
      ticker,
      ...stock,
      price: getCurrentPrice(ticker)
    }
  });
});

// POST create new portfolio
router.post('/portfolio/create', (req, res) => {
  const userId = uuidv4();
  const portfolio = getOrCreatePortfolio(userId);
  res.json({ success: true, userId, portfolio, message: `Your virtual portfolio is ready! You have $${STARTING_CASH.toLocaleString()} to invest.` });
});

// GET portfolio overview
router.get('/portfolio/:userId', (req, res) => {
  const { userId } = req.params;
  const portfolio = portfolios.get(userId);
  if (!portfolio) return res.status(404).json({ success: false, error: 'Portfolio not found. Create one first.' });

  const valuation = calcPortfolioValue(portfolio);
  const holdingsDetail = Object.entries(portfolio.holdings).map(([ticker, h]) => {
    const currentPrice = getCurrentPrice(ticker);
    const currentValue = h.shares * currentPrice;
    const gainLoss = currentValue - h.totalCost;
    const gainLossPct = (gainLoss / h.totalCost) * 100;
    return {
      ticker,
      name: stocks[ticker]?.name || ticker,
      shares: h.shares,
      avgCost: parseFloat((h.totalCost / h.shares).toFixed(2)),
      currentPrice,
      currentValue: parseFloat(currentValue.toFixed(2)),
      gainLoss: parseFloat(gainLoss.toFixed(2)),
      gainLossPct: parseFloat(gainLossPct.toFixed(2))
    };
  });

  res.json({ success: true, portfolio: { ...portfolio, holdings: holdingsDetail }, valuation });
});

// POST buy stock
router.post('/trade/buy', (req, res) => {
  const { userId, ticker, shares } = req.body;
  
  if (!userId || !ticker || !shares || shares <= 0) {
    return res.status(400).json({ success: false, error: 'Missing required fields: userId, ticker, shares' });
  }

  const portfolio = portfolios.get(userId);
  if (!portfolio) return res.status(404).json({ success: false, error: 'Portfolio not found' });

  const tickerUpper = ticker.toUpperCase();
  if (!stocks[tickerUpper]) return res.status(404).json({ success: false, error: `Stock "${ticker}" not found` });

  const price = getCurrentPrice(tickerUpper);
  const totalCost = parseFloat((price * shares).toFixed(2));

  if (totalCost > portfolio.cash) {
    return res.status(400).json({
      success: false,
      error: `Insufficient funds. Order cost: $${totalCost.toLocaleString()}, Available cash: $${portfolio.cash.toLocaleString()}`
    });
  }

  portfolio.cash = parseFloat((portfolio.cash - totalCost).toFixed(2));

  if (!portfolio.holdings[tickerUpper]) {
    portfolio.holdings[tickerUpper] = { shares: 0, totalCost: 0 };
  }
  portfolio.holdings[tickerUpper].shares += shares;
  portfolio.holdings[tickerUpper].totalCost += totalCost;

  const tx = {
    id: uuidv4(),
    type: 'BUY',
    ticker: tickerUpper,
    shares,
    price,
    total: totalCost,
    timestamp: new Date().toISOString()
  };
  portfolio.transactions.unshift(tx);

  res.json({
    success: true,
    message: `✅ Bought ${shares} share${shares > 1 ? 's' : ''} of ${tickerUpper} at $${price} each.`,
    transaction: tx,
    newCashBalance: portfolio.cash,
    tip: shares === 1 ? `Great first buy! Consistency over time beats timing the market.` : null
  });
});

// POST sell stock
router.post('/trade/sell', (req, res) => {
  const { userId, ticker, shares } = req.body;
  
  if (!userId || !ticker || !shares || shares <= 0) {
    return res.status(400).json({ success: false, error: 'Missing required fields: userId, ticker, shares' });
  }

  const portfolio = portfolios.get(userId);
  if (!portfolio) return res.status(404).json({ success: false, error: 'Portfolio not found' });

  const tickerUpper = ticker.toUpperCase();
  const holding = portfolio.holdings[tickerUpper];
  if (!holding || holding.shares < shares) {
    return res.status(400).json({
      success: false,
      error: `Cannot sell ${shares} shares. You own ${holding?.shares || 0} shares of ${tickerUpper}.`
    });
  }

  const price = getCurrentPrice(tickerUpper);
  const proceeds = parseFloat((price * shares).toFixed(2));
  const costBasis = parseFloat((holding.totalCost / holding.shares * shares).toFixed(2));
  const realizedGain = parseFloat((proceeds - costBasis).toFixed(2));

  portfolio.cash = parseFloat((portfolio.cash + proceeds).toFixed(2));
  holding.shares -= shares;
  holding.totalCost -= costBasis;

  if (holding.shares === 0) delete portfolio.holdings[tickerUpper];

  const tx = {
    id: uuidv4(),
    type: 'SELL',
    ticker: tickerUpper,
    shares,
    price,
    total: proceeds,
    realizedGain,
    timestamp: new Date().toISOString()
  };
  portfolio.transactions.unshift(tx);

  const gainMsg = realizedGain >= 0
    ? `📈 You realized a gain of $${realizedGain.toFixed(2)}!`
    : `📉 You realized a loss of $${Math.abs(realizedGain).toFixed(2)}.`;

  res.json({ success: true, message: `Sold ${shares} share${shares > 1 ? 's' : ''} of ${tickerUpper} at $${price} each. ${gainMsg}`, transaction: tx, newCashBalance: portfolio.cash });
});

// GET transaction history
router.get('/portfolio/:userId/history', (req, res) => {
  const portfolio = portfolios.get(req.params.userId);
  if (!portfolio) return res.status(404).json({ success: false, error: 'Portfolio not found' });
  res.json({ success: true, transactions: portfolio.transactions.slice(0, 50) });
});

// POST reset portfolio
router.post('/portfolio/:userId/reset', (req, res) => {
  const { userId } = req.params;
  portfolios.set(userId, {
    userId,
    cash: STARTING_CASH,
    startingCash: STARTING_CASH,
    holdings: {},
    transactions: [],
    createdAt: new Date().toISOString()
  });
  res.json({ success: true, message: 'Portfolio reset! Back to $10,000 — every expert was once a beginner.' });
});

module.exports = router;
