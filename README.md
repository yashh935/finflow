# 💰 FinFlow — Financial Literacy & Simulation Platform

> A "Duolingo-style" educational platform that demystifies the economy and stock market for young adults through micro-lessons, zero-jargon content, and a risk-free virtual trading simulator.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the backend server (port 3001)
npm start

# Open in browser
open http://localhost:3001
```

---

## 🏗️ Project Structure

```
finflow/
├── server.js              # Main Express server
├── package.json
├── routes/
│   ├── trading.js         # Virtual trading simulator API
│   └── courses.js         # Learning + quiz + XP API
├── data/
│   ├── stocks.js          # Mock stock market data + price history
│   └── courses.js         # Course content, lessons, glossary
└── public/
    └── index.html         # Full frontend (single HTML file)
```

---

## 📡 API Reference

### Health Check
```
GET /api/health
```

### 📈 Trading Simulator

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trading/stocks` | List all virtual stocks with live prices |
| GET | `/api/trading/stocks/:ticker` | Stock detail + 60-day price history |
| POST | `/api/trading/portfolio/create` | Create new virtual portfolio ($10,000) |
| GET | `/api/trading/portfolio/:userId` | Portfolio with live valuations + P&L |
| POST | `/api/trading/trade/buy` | Buy shares `{ userId, ticker, shares }` |
| POST | `/api/trading/trade/sell` | Sell shares `{ userId, ticker, shares }` |
| GET | `/api/trading/portfolio/:userId/history` | Transaction history (last 50) |
| POST | `/api/trading/portfolio/:userId/reset` | Reset portfolio to $10,000 |

**Buy shares example:**
```bash
curl -X POST http://localhost:3001/api/trading/trade/buy \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-uuid", "ticker": "AAPL", "shares": 5}'
```

### 📚 Learning Platform

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | All courses overview |
| GET | `/api/courses/:courseId` | Course with full lesson content |
| GET | `/api/courses/:courseId/lessons/:lessonId` | Single lesson |
| POST | `/api/courses/:courseId/lessons/:lessonId/complete` | Mark complete, earn XP |
| POST | `/api/courses/:courseId/lessons/:lessonId/quiz` | Submit quiz, get graded |
| GET | `/api/courses/progress/:userId` | XP, level, badges, streak |
| GET | `/api/courses/glossary/all` | Financial glossary (supports `?search=ETF&category=Investing`) |

### 📊 Market Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market/summary` | Indices, top gainers/losers |
| POST | `/api/waitlist` | Join email waitlist `{ email, name, userType }` |

---

## 🎨 Frontend Features

- **Custom cursor** with smooth spring animation
- **Live ticker bar** with animated price updates
- **Floating hero dashboard** with animated portfolio card
- **Mini canvas chart** for portfolio visualization
- **Scroll-triggered reveal** animations throughout
- **Virtual simulator UI** with real-time price fluctuation simulation
- **Interactive course cards** with color-coded learning tracks
- **Financial glossary** with hover glow effects
- **Waitlist form** with API integration
- **Toast notifications** for all user actions
- **Fully responsive** mobile layout

---

## 🔑 Available Courses

| ID | Title | Tier |
|----|-------|------|
| `basics-101` | Money Basics | Free |
| `investing-201` | Investing Fundamentals | Free |
| `retirement-301` | Retirement Planning | Premium |
| `taxes-301` | Taxes Demystified | Premium |
| `realestate-401` | Real Estate 101 | Premium |
| `crypto-401` | Crypto & Digital Assets | Premium |

---

## 🛡️ Security Features

- **Helmet.js** — Security headers
- **CORS** — Configurable cross-origin policies
- **Rate Limiting** — 200 requests per 15 minutes per IP
- **Input validation** on all trade endpoints

---

## 🔜 Production Checklist

- [ ] Replace in-memory stores with PostgreSQL/Redis
- [ ] Add JWT authentication (`/api/auth/register`, `/api/auth/login`)
- [ ] Integrate real market data API (Polygon.io, Alpha Vantage)
- [ ] Add Stripe payment for premium subscriptions
- [ ] Set up email service (SendGrid/Resend) for waitlist
- [ ] Deploy frontend to Vercel, backend to Railway/Render

---

## 📄 License

MIT — Built for educational purposes. Not financial advice.
