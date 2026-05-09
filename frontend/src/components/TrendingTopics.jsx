import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const GUARDIAN_KEY = 'test'
const GUARDIAN_BASE = 'https://content.guardianapis.com/search'

const CATEGORIES = [
  { id: 'technology',         label: 'Tech' },
  { id: 'business',           label: 'Business' },
  { id: 'science',            label: 'Science' },
  { id: 'society',            label: 'Health' },
]

const FILTERS = ['All', 'Tech', 'Business', 'Science', 'Health']

const CATEGORY_ACCENT = {
  Tech:     'border-l-cyan-500',
  Business: 'border-l-blue-500',
  Science:  'border-l-violet-500',
  Health:   'border-l-emerald-500',
}

const CATEGORY_BADGE = {
  Tech:     'bg-cyan-900/50 text-cyan-400 border-cyan-800/60',
  Business: 'bg-blue-900/50 text-blue-400 border-blue-800/60',
  Science:  'bg-violet-900/50 text-violet-400 border-violet-800/60',
  Health:   'bg-emerald-900/50 text-emerald-400 border-emerald-800/60',
}

const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','to','of','in','on','at','by','for',
  'with','and','but','or','its','it','as','up','new','says','said','after',
  'over','about','from','that','this','has','have','will','be','been','into',
  'how','why','what','when','where','not','no','so','than','out','get','more',
  'could','would','may','can','do','did','does','amid','vs','just','now',
  'us','also','back','off','two','three','one','first','here','report','why',
])

function extractQuery(title) {
  const cleaned = title.replace(/\s*[-|:]\s*[A-Za-z0-9\s.]+$/, '').trim()
  const words = cleaned
    .split(/[\s,]+/)
    .map(w => w.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(w => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()))
  return words.slice(0, 3).join(' ') || cleaned.split(' ').slice(0, 3).join(' ')
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const POS_WORDS = ['surge','soar','gain','rise','win','record','growth','boost','launch','breakthrough','success','strong','profit','rally','innovation','advance','award','approve','celebrate']
const NEG_WORDS = ['fall','drop','crash','loss','fail','cut','layoff','decline','threat','risk','concern','warn','miss','problem','crisis','ban','fine','sue','recall','dead','attack','fraud']

function getSentiment(title) {
  const lower = title.toLowerCase()
  const pos = POS_WORDS.filter(w => lower.includes(w)).length
  const neg = NEG_WORDS.filter(w => lower.includes(w)).length
  if (pos > neg) return 'positive'
  if (neg > pos) return 'negative'
  return 'neutral'
}

function SentimentBadge({ title }) {
  const s = getSentiment(title)
  if (s === 'positive') return <span className="text-xs px-2 py-0.5 rounded border bg-green-900/40 text-green-400 border-green-800/60 font-medium">Positive</span>
  if (s === 'negative') return <span className="text-xs px-2 py-0.5 rounded border bg-red-900/40 text-red-400 border-red-800/60 font-medium">Negative</span>
  return <span className="text-xs px-2 py-0.5 rounded border bg-slate-800 text-slate-500 border-slate-700 font-medium">Neutral</span>
}

function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 border-l-4 border-l-slate-700 rounded-xl p-5 animate-pulse">
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-14 bg-slate-800 rounded" />
        <div className="h-5 w-16 bg-slate-800 rounded" />
      </div>
      <div className="h-4 bg-slate-800 rounded mb-2 w-full" />
      <div className="h-4 bg-slate-800 rounded mb-2 w-5/6" />
      <div className="h-4 bg-slate-800 rounded mb-5 w-3/4" />
      <div className="h-3 bg-slate-800 rounded w-24 mb-4" />
      <div className="h-8 bg-slate-800/60 rounded-lg w-full" />
    </div>
  )
}

export default function TrendingTopics() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAll = async () => {
      const results = []
      await Promise.all(
        CATEGORIES.map(async ({ id, label }) => {
          try {
            const url = `${GUARDIAN_BASE}?section=${id}&api-key=${GUARDIAN_KEY}&page-size=6&order-by=newest&show-fields=trailText`
            const res = await fetch(url)
            const data = await res.json()
            for (const item of data?.response?.results || []) {
              const title = item.webTitle || ''
              if (!title) continue
              results.push({
                title,
                source: 'The Guardian',
                url: item.webUrl || '',
                category_label: label,
                published_at: item.webPublicationDate || '',
              })
            }
          } catch { /* silent */ }
        })
      )
      setItems(results)
      setLoading(false)
    }
    fetchAll()
  }, [])

  const filtered = filter === 'All' ? items : items.filter(i => i.category_label === filter)

  const handleAnalyze = (title) => {
    const q = extractQuery(title)
    if (q) navigate(`/dashboard?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 mb-24">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Live</span>
        </div>
        <h2 className="text-white text-2xl font-bold">What's Trending Right Now</h2>
        <p className="text-slate-500 text-sm mt-1">Top stories across markets, tech, science, and health</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
              filter === f
                ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length === 0
          ? <p className="text-slate-600 col-span-3 text-center py-16">No trending topics found.</p>
          : filtered.slice(0, 9).map((item, i) => (
            <div
              key={i}
              className={`bg-slate-900 border border-slate-800 border-l-4 ${CATEGORY_ACCENT[item.category_label]} rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900/80 transition-all`}
            >
              <div>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${CATEGORY_BADGE[item.category_label]}`}>
                    {item.category_label}
                  </span>
                  <SentimentBadge title={item.title} />
                </div>
                <p className="text-white text-sm font-semibold leading-snug line-clamp-3 mb-4">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <span>{item.source}</span>
                  {item.published_at && <><span>·</span><span>{timeAgo(item.published_at)}</span></>}
                </div>
              </div>
              <button
                onClick={() => handleAnalyze(item.title)}
                className="mt-5 w-full py-2 rounded-lg text-xs font-bold tracking-wide text-cyan-400 border border-cyan-900/60 bg-cyan-950/30 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 transition-all"
              >
                Analyze Topic →
              </button>
            </div>
          ))
        }
      </div>
    </div>
  )
}
