import { useState } from 'react'
import { getStocks, searchQuery, getCompanyOverview } from '../services/api'
import StockCard from '../components/StockCard'
import SentimentMeter from '../components/SentimentMeter'
import SummaryPanel from '../components/SummaryPanel'
import NewsCard from '../components/NewsCard'

const QUICK_TICKERS = [
  { ticker: 'NVDA', label: 'NVIDIA' },
  { ticker: 'MSFT', label: 'Microsoft' },
  { ticker: 'GOOGL', label: 'Google' },
  { ticker: 'AMD', label: 'AMD' },
  { ticker: 'TSLA', label: 'Tesla' },
  { ticker: 'META', label: 'Meta' },
  { ticker: 'AAPL', label: 'Apple' },
  { ticker: 'AMZN', label: 'Amazon' },
]

const TICKER_TO_NAME = {
  NVDA: 'NVIDIA', MSFT: 'Microsoft', GOOGL: 'Google',
  AMD: 'AMD', TSLA: 'Tesla', META: 'Meta', AAPL: 'Apple', AMZN: 'Amazon',
}

function OverviewGrid({ overview }) {
  if (!overview || overview.error) return null

  const fields = [
    { label: 'Market Cap',      value: overview.market_cap },
    { label: 'Revenue (TTM)',   value: overview.revenue },
    { label: 'P/E Ratio',       value: overview.pe_ratio !== 'None' ? overview.pe_ratio : 'N/A' },
    { label: 'EPS',             value: overview.eps !== 'None' ? `$${overview.eps}` : 'N/A' },
    { label: 'Profit Margin',   value: overview.profit_margin !== 'None' ? `${(parseFloat(overview.profit_margin) * 100).toFixed(1)}%` : 'N/A' },
    { label: 'Beta',            value: overview.beta !== 'None' ? overview.beta : 'N/A' },
    { label: '52-Wk High',      value: overview.week_52_high ? `$${parseFloat(overview.week_52_high).toFixed(2)}` : 'N/A' },
    { label: '52-Wk Low',       value: overview.week_52_low  ? `$${parseFloat(overview.week_52_low).toFixed(2)}`  : 'N/A' },
    { label: 'Analyst Target',  value: overview.analyst_target ? `$${parseFloat(overview.analyst_target).toFixed(2)}` : 'N/A' },
    { label: 'Dividend Yield',  value: overview.dividend_yield && overview.dividend_yield !== 'None' ? `${(parseFloat(overview.dividend_yield) * 100).toFixed(2)}%` : 'None' },
  ]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-lg">{overview.name}</h3>
        <div className="flex gap-2 mt-1 flex-wrap">
          {overview.sector && <span className="text-xs text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-full">{overview.sector}</span>}
          {overview.industry && <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{overview.industry}</span>}
          {overview.exchange && <span className="text-xs text-slate-500">{overview.exchange}</span>}
        </div>
      </div>

      {overview.description && (
        <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3">{overview.description}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {fields.map((f) => (
          <div key={f.label} className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-500 text-xs mb-1">{f.label}</p>
            <p className="text-white font-semibold text-sm">{f.value || 'N/A'}</p>
          </div>
        ))}
      </div>
      <p className="text-slate-700 text-xs mt-3">Financial data via Alpha Vantage · Not financial advice · Data may be delayed</p>
    </div>
  )
}

export default function Stocks() {
  const [input, setInput] = useState('')
  const [stock, setStock]       = useState(null)
  const [overview, setOverview] = useState(null)
  const [sentiment, setSentiment] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [currentTicker, setCurrentTicker] = useState('')

  const handleSearch = async (ticker) => {
    const symbol = (ticker || input).trim().toUpperCase()
    if (!symbol) return

    setLoading(true)
    setError(null)
    setStock(null)
    setOverview(null)
    setSentiment(null)
    setCurrentTicker(symbol)

    try {
      const searchTerm = TICKER_TO_NAME[symbol] || symbol
      const [stockRes, sentimentRes, overviewRes] = await Promise.all([
        getStocks(symbol),
        searchQuery(searchTerm),
        getCompanyOverview(symbol),
      ])
      setStock(stockRes.data)
      setSentiment(sentimentRes.data)
      setOverview(overviewRes.data)
    } catch {
      setError('Failed to load data. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Stock Intelligence</h1>
          <p className="text-slate-400">Live price data, company financials, and real-time sentiment — combined in one research view.</p>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter ticker — NVDA, MSFT, AMD..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
          />
          <button onClick={() => handleSearch()} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-colors">
            Lookup
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {QUICK_TICKERS.map(({ ticker, label }) => (
            <button key={ticker} onClick={() => handleSearch(ticker)}
              className="text-sm text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-1.5 rounded-full transition-all font-mono">
              {ticker} <span className="text-slate-600 font-sans">· {label}</span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-slate-400 py-20 justify-center">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            Fetching data for {currentTicker}...
          </div>
        )}

        {error && <p className="text-red-400 py-10 text-center">{error}</p>}

        {stock && !loading && (
          <div className="space-y-5">
            <StockCard stock={stock} />
            <OverviewGrid overview={overview} />
            {sentiment && (
              <>
                <SummaryPanel summary={sentiment.summary} query={TICKER_TO_NAME[currentTicker] || currentTicker} />
                <SentimentMeter sentiment={sentiment.sentiment} />
                <div>
                  <h2 className="text-white font-semibold text-lg mb-4">Related News</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {sentiment.news_articles.slice(0, 6).map((a, i) => <NewsCard key={i} article={a} />)}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
