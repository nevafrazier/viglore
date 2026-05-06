import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrendingTopics } from '../services/api'

const FILTERS = ['All', 'Tech', 'Business', 'Science', 'Health']

const CATEGORY_STYLES = {
  technology: 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/60',
  business:   'bg-blue-900/40 text-blue-400 border border-blue-800/60',
  science:    'bg-purple-900/40 text-purple-400 border border-purple-800/60',
  health:     'bg-green-900/40 text-green-400 border border-green-800/60',
}

const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','to','of','in','on','at','by','for',
  'with','and','but','or','its','it','as','up','new','says','said','after',
  'over','about','from','that','this','has','have','will','be','been','into',
  'how','why','what','when','where','not','no','so','than','out','get','more',
  'could','would','may','can','do','did','does','than','too','amid','vs',
  'just','now','us','u.s.','also','back','off','two','three','one','first',
])

function extractQuery(title) {
  const cleaned = title.replace(/\s*[-|]\s*[A-Za-z0-9\s.]+$/, '').trim()
  const words = cleaned
    .split(/[\s,]+/)
    .map(w => w.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(w => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()))
  return words.slice(0, 3).join(' ') || cleaned.split(' ').slice(0, 3).join(' ')
}

function sentimentDot(score) {
  if (score >= 0.15) return <span className="w-2 h-2 rounded-full bg-green-400 inline-block" title="Positive" />
  if (score <= -0.15) return <span className="w-2 h-2 rounded-full bg-red-400 inline-block" title="Negative" />
  return <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" title="Neutral" />
}

function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse">
      <div className="h-3 w-16 bg-slate-800 rounded mb-3" />
      <div className="h-4 bg-slate-800 rounded mb-2" />
      <div className="h-4 bg-slate-800 rounded w-3/4 mb-4" />
      <div className="h-3 w-20 bg-slate-800 rounded" />
    </div>
  )
}

export default function TrendingTopics() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getTrendingTopics()
      .then(res => setItems(res.data.trending || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All'
    ? items
    : items.filter(i => i.category_label === filter)

  const handleAnalyze = (title) => {
    const q = extractQuery(title)
    if (q) navigate(`/dashboard?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 mb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <p className="text-slate-400 text-sm uppercase tracking-widest">What's Trending Right Now</p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filter === f
                ? 'bg-cyan-500 text-slate-950 border-cyan-500'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length === 0
          ? <p className="text-slate-600 col-span-3 text-center py-10">No trending topics found.</p>
          : filtered.slice(0, 9).map((item, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_STYLES[item.category]}`}>
                    {item.category_label}
                  </span>
                  {sentimentDot(item.sentiment)}
                </div>
                <p className="text-slate-200 text-sm font-medium leading-snug line-clamp-3 mb-3 group-hover:text-white transition-colors">
                  {item.title.replace(/\s*-\s*[^-]+$/, '')}
                </p>
                <p className="text-slate-600 text-xs">{item.source}</p>
              </div>
              <button
                onClick={() => handleAnalyze(item.title)}
                className="mt-4 text-xs text-cyan-500 hover:text-cyan-300 font-semibold text-left transition-colors"
              >
                Analyze topic →
              </button>
            </div>
          ))
        }
      </div>
    </div>
  )
}
