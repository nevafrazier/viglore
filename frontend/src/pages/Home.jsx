import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TrendingTopics from '../components/TrendingTopics'

const QUICK_SEARCHES = ['NVIDIA', 'OpenAI', 'Minecraft', 'Tesla', 'Anthropic', 'Bitcoin', 'Apple', 'Cybersecurity']

const FEATURES = [
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

const EXAMPLE_QUERIES = [
  { query: 'NVIDIA', result: 'Mostly Positive · B', color: 'text-green-400' },
  { query: 'Minecraft', result: 'Very Positive · A', color: 'text-green-400' },
  { query: 'Cybersecurity', result: 'Mixed · C', color: 'text-slate-400' },
  { query: 'Tesla', result: 'Mixed · C+', color: 'text-slate-400' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (q) => {
    const term = q || query
    if (term.trim()) navigate(`/dashboard?q=${encodeURIComponent(term.trim())}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-950/40 border border-cyan-900/50 rounded-full px-4 py-1.5 text-cyan-400 text-sm mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          AI-Powered Market & Trend Intelligence
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          What is the internet{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            saying right now?
          </span>
        </h1>

        <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Viglore analyzes news in real time — giving you sentiment scores, trend data, and summaries for any company, stock, game, or topic.
        </p>

        <div className="flex gap-3 max-w-xl mx-auto mb-5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Try: NVIDIA, Minecraft, Tesla, Bitcoin..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-lg"
          />
          <button
            onClick={() => handleSearch()}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            Analyze
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => handleSearch(term)}
              className="text-sm text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-1.5 rounded-full transition-all"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Live example preview */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <p className="text-center text-slate-600 text-sm uppercase tracking-widest mb-6">Example results</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {EXAMPLE_QUERIES.map((ex) => (
            <button
              key={ex.query}
              onClick={() => handleSearch(ex.query)}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-800 rounded-xl p-4 text-left transition-all group"
            >
              <div className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">{ex.query}</div>
              <div className={`text-sm font-medium ${ex.color}`}>{ex.result}</div>
              <div className="text-slate-600 text-xs mt-1">Click to analyze →</div>
            </button>
          ))}
        </div>
      </div>

      {/* Trending topics */}
      <TrendingTopics />

      {/* Features grid */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <p className="text-center text-slate-600 text-sm uppercase tracking-widest mb-4">What you get</p>
        <h2 className="text-center text-3xl font-bold text-white mb-10">Everything in one dashboard</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-900/40 rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to explore?</h2>
          <p className="text-slate-400 mb-6">No account needed. Just type anything and see what the data says.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Open Dashboard
            </button>
            <button
              onClick={() => navigate('/cities')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              View City Rankings
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
