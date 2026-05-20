export const QUICK_SEARCHES = [
  'NVIDIA', 'OpenAI', 'Minecraft', 'Tesla', 'Anthropic', 'Bitcoin', 'Apple', 'Cybersecurity',
]

export const FEATURES = [
  {
    icon: '📊',
    title: 'Sentiment Analysis',
    desc: 'Instantly see whether the internet is positive, negative, or neutral about any company, stock, or topic — rated A through F like a report card.',
  },
  {
    icon: '📰',
    title: 'News Intelligence',
    desc: 'Real headlines pulled and sorted by tone. Favorable coverage and critical coverage are separated so you can see both sides at a glance.',
  },
  {
    icon: '💬',
    title: 'Trader Sentiment',
    desc: 'See what investors and traders are saying on Stocktwits — with bullish/bearish labels on every post.',
  },
  {
    icon: '📈',
    title: 'Stock Data',
    desc: 'Live price, daily change, and volume for any public company. Automatically shows stock info when you search a known company.',
  },
  {
    icon: '🔍',
    title: 'Related Search Terms',
    desc: 'Discover the specific sub-topics, people, and themes that dominate the conversation around whatever you search.',
  },
  {
    icon: '🏙️',
    title: 'City Intelligence',
    desc: 'Rank the fastest-growing US tech cities by jobs, salary, cost of living, and startup activity — with full breakdowns for each.',
  },
]

export const EXAMPLE_QUERIES = [
  { query: 'NVIDIA',       result: 'Mostly Positive · B', color: 'text-green-400' },
  { query: 'Minecraft',    result: 'Very Positive · A',   color: 'text-green-400' },
  { query: 'Cybersecurity',result: 'Mixed · C',           color: 'text-slate-400' },
  { query: 'Tesla',        result: 'Mixed · C+',          color: 'text-slate-400' },
]
