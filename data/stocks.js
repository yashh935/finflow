// Mock stock data for the virtual trading simulator
const stocks = {
  AAPL: {
    name: "Apple Inc.",
    sector: "Technology",
    price: 189.5,
    change: +1.23,
    changePct: +0.65,
    marketCap: "2.94T",
    peRatio: 30.2,
    description: "Apple designs and sells consumer electronics, software, and online services.",
    history: generateHistory(189.5, 60)
  },
  MSFT: {
    name: "Microsoft Corp.",
    sector: "Technology",
    price: 415.2,
    change: -2.1,
    changePct: -0.5,
    marketCap: "3.08T",
    peRatio: 35.8,
    description: "Microsoft develops software, services, devices and cloud solutions.",
    history: generateHistory(415.2, 60)
  },
  GOOGL: {
    name: "Alphabet Inc.",
    sector: "Technology",
    price: 178.3,
    change: +3.45,
    changePct: +1.97,
    marketCap: "2.22T",
    peRatio: 26.4,
    description: "Alphabet is the parent company of Google and several former subsidiaries.",
    history: generateHistory(178.3, 60)
  },
  AMZN: {
    name: "Amazon.com Inc.",
    sector: "Consumer Discretionary",
    price: 205.7,
    change: -0.87,
    changePct: -0.42,
    marketCap: "2.18T",
    peRatio: 54.1,
    description: "Amazon is a tech giant focused on e-commerce, cloud computing, and AI.",
    history: generateHistory(205.7, 60)
  },
  TSLA: {
    name: "Tesla Inc.",
    sector: "Automotive",
    price: 248.9,
    change: +8.32,
    changePct: +3.46,
    marketCap: "794B",
    peRatio: 62.3,
    description: "Tesla designs, develops, manufactures electric vehicles and energy solutions.",
    history: generateHistory(248.9, 60)
  },
  NVDA: {
    name: "NVIDIA Corp.",
    sector: "Semiconductors",
    price: 875.4,
    change: +22.1,
    changePct: +2.59,
    marketCap: "2.16T",
    peRatio: 68.7,
    description: "NVIDIA is a global leader in AI computing and graphics processing units.",
    history: generateHistory(875.4, 60)
  },
  VOO: {
    name: "Vanguard S&P 500 ETF",
    sector: "ETF",
    price: 502.3,
    change: +1.87,
    changePct: +0.37,
    marketCap: "459B",
    peRatio: 24.8,
    description: "VOO tracks the S&P 500 Index for broad US market exposure.",
    history: generateHistory(502.3, 60)
  },
  BRK: {
    name: "Berkshire Hathaway",
    sector: "Financials",
    price: 412.6,
    change: +0.45,
    changePct: +0.11,
    marketCap: "906B",
    peRatio: 21.3,
    description: "Berkshire Hathaway is Warren Buffett's diversified holding company.",
    history: generateHistory(412.6, 60)
  }
};

function generateHistory(currentPrice, days) {
  const history = [];
  let price = currentPrice * 0.85;
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const volatility = (Math.random() - 0.45) * 0.03;
    price = price * (1 + volatility);
    history.push({
      date: new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 10000000
    });
  }
  history[history.length - 1].price = currentPrice;
  return history;
}

module.exports = { stocks };
