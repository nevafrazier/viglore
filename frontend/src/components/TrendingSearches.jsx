import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrendingSearches } from '../services/api'

export default function TrendingSearches() {
  const [trending, setTrending] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getTrendingSearches()
      .then(res => setTrending(res.data || []))
      .catch(() => {})
  }, [])

  if (!trending.length) return null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Trending on Viglore</span>
        <span className="text-slate-600 text-xs ml-1">— searched this week</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {trending.map((item) => (
          <button
            key={item.query}
            onClick={() => navigate(`/dashboard?q=${encodeURIComponent(item.query)}`)}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-cyan-700 transition-all"
          >
            {item.query}
            <span className="text-xs text-slate-500">{item.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
