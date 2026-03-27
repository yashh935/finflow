const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const tradingRoutes = require('./routes/trading');
const coursesRoutes = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security & Middleware ───────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter — prevents abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, error: 'Too many requests — take a breather and learn something while you wait! 📚' }
});
app.use('/api/', limiter);

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/trading', tradingRoutes);
app.use('/api/courses', coursesRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'FinFlow API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    endpoints: {
      trading: {
        'GET /api/trading/stocks': 'List all virtual stocks',
        'GET /api/trading/stocks/:ticker': 'Get stock details + price history',
        'POST /api/trading/portfolio/create': 'Create new virtual portfolio ($10,000)',
        'GET /api/trading/portfolio/:userId': 'Get portfolio with live valuations',
        'POST /api/trading/trade/buy': 'Buy shares { userId, ticker, shares }',
        'POST /api/trading/trade/sell': 'Sell shares { userId, ticker, shares }',
        'GET /api/trading/portfolio/:userId/history': 'Transaction history',
        'POST /api/trading/portfolio/:userId/reset': 'Reset portfolio to $10,000'
      },
      courses: {
        'GET /api/courses': 'All courses overview',
        'GET /api/courses/:courseId': 'Course details with lessons',
        'GET /api/courses/:courseId/lessons/:lessonId': 'Single lesson content',
        'POST /api/courses/:courseId/lessons/:lessonId/complete': 'Mark lesson complete, earn XP',
        'POST /api/courses/:courseId/lessons/:lessonId/quiz': 'Submit quiz answers',
        'GET /api/courses/progress/:userId': 'User XP + level + badges',
        'GET /api/courses/glossary/all': 'Financial glossary (search & filter)'
      }
    }
  });
});

// ─── Market Summary Endpoint ─────────────────────────────────────────────────
app.get('/api/market/summary', (req, res) => {
  const { stocks } = require('./data/stocks');
  const tickers = Object.keys(stocks);
  const gainers = tickers.filter(t => stocks[t].changePct > 0).sort((a, b) => stocks[b].changePct - stocks[a].changePct).slice(0, 3);
  const losers = tickers.filter(t => stocks[t].changePct < 0).sort((a, b) => stocks[a].changePct - stocks[b].changePct).slice(0, 3);
  
  res.json({
    success: true,
    marketStatus: 'Open',
    indices: {
      'S&P 500': { value: 5218.32, change: +0.48 },
      'NASDAQ': { value: 16443.97, change: +0.63 },
      'DOW': { value: 39069.11, change: +0.20 }
    },
    topGainers: gainers.map(t => ({ ticker: t, ...stocks[t] })),
    topLosers: losers.map(t => ({ ticker: t, ...stocks[t] })),
    timestamp: new Date().toISOString()
  });
});

// ─── Waitlist/Newsletter ─────────────────────────────────────────────────────
const waitlist = [];
app.post('/api/waitlist', (req, res) => {
  const { email, name, userType } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email required' });
  }
  if (waitlist.find(w => w.email === email)) {
    return res.json({ success: true, message: "You're already on our list! We'll be in touch soon. 🎉", alreadyExists: true });
  }
  waitlist.push({ email, name: name || '', userType: userType || 'general', joinedAt: new Date().toISOString() });
  res.json({ success: true, message: `Welcome to FinFlow, ${name || 'future investor'}! You're #${waitlist.length} on the waitlist. 🚀`, position: waitlist.length });
});

// ─── Catch-all: serve frontend ────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ success: false, error: 'Something went wrong on our end. Our engineers are on it!' });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   💰 FinFlow API Server Running        ║
║   Port: ${PORT}                           ║
║   Health: http://localhost:${PORT}/api/health ║
║   Ready to teach financial literacy!  ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
