const courses = [
  {
    id: "basics-101",
    title: "Money Basics",
    emoji: "💵",
    tier: "free",
    lessonsCount: 8,
    duration: "45 min",
    difficulty: "Beginner",
    color: "#00E5A0",
    description: "Understand how money actually works — from earning to saving.",
    lessons: [
      {
        id: "l1",
        title: "What is inflation and why it eats your savings",
        type: "lesson",
        xp: 15,
        duration: "5 min",
        content: "Inflation is the rate at which the general level of prices for goods and services rises. When inflation goes up, every dollar you own buys a smaller percentage of a good or service. The inflation rate in the US has averaged around 3.28% per year since 1914. This means if you keep $10,000 under your mattress for 10 years, it will be worth about $7,224 in today's purchasing power."
      },
      {
        id: "l2",
        title: "The 50/30/20 budgeting rule",
        type: "lesson",
        xp: 15,
        duration: "4 min",
        content: "The 50/30/20 rule divides your after-tax income: 50% for needs (rent, groceries, utilities), 30% for wants (dining out, Netflix, travel), and 20% for savings and debt repayment. It's a simple framework that works for most income levels."
      },
      {
        id: "l3",
        title: "Emergency fund: your financial airbag",
        type: "lesson",
        xp: 20,
        duration: "5 min",
        content: "An emergency fund is 3-6 months of living expenses saved in a liquid account. Without one, any unexpected expense — a car repair, medical bill, or job loss — forces you into debt. Start with a $1,000 mini emergency fund, then build toward the full amount."
      },
      {
        id: "l4",
        title: "Quiz: Money Basics Check",
        type: "quiz",
        xp: 30,
        duration: "3 min",
        questions: [
          {
            q: "If inflation is 3% and your savings account earns 1% interest, what is happening to your real wealth?",
            options: ["Growing by 4%", "Shrinking by 2%", "Staying the same", "Growing by 2%"],
            answer: 1,
            explanation: "Real return = nominal return - inflation = 1% - 3% = -2%. Your purchasing power is decreasing!"
          },
          {
            q: "In the 50/30/20 rule, which category does Netflix belong to?",
            options: ["Needs (50%)", "Wants (30%)", "Savings (20%)", "None of the above"],
            answer: 1,
            explanation: "Netflix is a 'want' — entertainment you enjoy but don't need to survive."
          }
        ]
      }
    ]
  },
  {
    id: "investing-201",
    title: "Investing Fundamentals",
    emoji: "📈",
    tier: "free",
    lessonsCount: 10,
    duration: "60 min",
    difficulty: "Beginner",
    color: "#FFD166",
    description: "Learn stocks, bonds, ETFs, and why starting early is your superpower.",
    lessons: [
      {
        id: "l1",
        title: "What is the stock market, actually?",
        type: "lesson",
        xp: 15,
        duration: "5 min",
        content: "The stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. When you buy a share of Apple (AAPL), you own a tiny fraction of that company. The S&P 500 is an index of the 500 largest US companies — often used as a benchmark for the whole market."
      },
      {
        id: "l2",
        title: "Stocks vs Bonds vs ETFs: The Big Three",
        type: "lesson",
        xp: 20,
        duration: "7 min",
        content: "Stocks = ownership in a company (higher risk, higher reward). Bonds = a loan you give to a company or government (lower risk, fixed income). ETFs = baskets of stocks/bonds that trade like a single stock (built-in diversification, low cost). Most long-term investors use a mix of all three."
      },
      {
        id: "l3",
        title: "Compound interest: Einstein's 8th wonder",
        type: "lesson",
        xp: 25,
        duration: "6 min",
        content: "Compound interest means earning interest on your interest. $1,000 at 10% annual return becomes: $1,100 after year 1, $1,210 after year 2, $1,331 after year 3... After 30 years: $17,449. The earlier you start, the more time compound interest works for you."
      }
    ]
  },
  {
    id: "retirement-301",
    title: "Retirement Planning",
    emoji: "🏖️",
    tier: "premium",
    lessonsCount: 12,
    duration: "75 min",
    difficulty: "Intermediate",
    color: "#EF476F",
    description: "401(k), IRA, Roth — decode retirement accounts and build your future.",
    lessons: []
  },
  {
    id: "taxes-301",
    title: "Taxes Demystified",
    emoji: "🧾",
    tier: "premium",
    lessonsCount: 9,
    duration: "55 min",
    difficulty: "Intermediate",
    color: "#118AB2",
    description: "W-2, 1099, deductions, credits — finally understand what you're paying.",
    lessons: []
  },
  {
    id: "realestate-401",
    title: "Real Estate 101",
    emoji: "🏠",
    tier: "premium",
    lessonsCount: 11,
    duration: "80 min",
    difficulty: "Advanced",
    color: "#7B2FBE",
    description: "Mortgages, REITs, and whether renting vs buying is right for you.",
    lessons: []
  },
  {
    id: "crypto-401",
    title: "Crypto & Digital Assets",
    emoji: "⛓️",
    tier: "premium",
    lessonsCount: 8,
    duration: "50 min",
    difficulty: "Advanced",
    color: "#F77F00",
    description: "Cut through the hype — understand blockchain, DeFi, and risk management.",
    lessons: []
  }
];

const glossary = [
  { term: "ETF", definition: "Exchange-Traded Fund — a basket of securities that trades on an exchange like a stock. Provides instant diversification at low cost.", category: "Investing" },
  { term: "Expense Ratio", definition: "The annual fee a fund charges, expressed as a percentage of your investment. A 0.03% ratio on $10,000 = $3/year.", category: "Investing" },
  { term: "Market Cap", definition: "Total market value of a company's shares. Share Price × Total Shares = Market Cap. Apple: ~$3 Trillion.", category: "Stocks" },
  { term: "Bull Market", definition: "A period when stock prices are rising or expected to rise — typically a 20%+ gain from recent lows.", category: "Markets" },
  { term: "Bear Market", definition: "A period when stock prices fall 20%+ from recent highs. Usually accompanied by widespread pessimism.", category: "Markets" },
  { term: "Diversification", definition: "Spreading investments across different assets to reduce risk. 'Don't put all eggs in one basket.'", category: "Strategy" },
  { term: "P/E Ratio", definition: "Price-to-Earnings ratio — stock price ÷ earnings per share. Shows how much investors pay per $1 of earnings.", category: "Stocks" },
  { term: "401(k)", definition: "Employer-sponsored retirement savings plan with tax advantages. Contributions come from pre-tax salary.", category: "Retirement" },
  { term: "Roth IRA", definition: "Individual Retirement Account where contributions are after-tax, but withdrawals in retirement are tax-free.", category: "Retirement" },
  { term: "Dividend", definition: "A share of profits paid by a company to stockholders, usually quarterly. Passive income for investors.", category: "Investing" }
];

module.exports = { courses, glossary };
