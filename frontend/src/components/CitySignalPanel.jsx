import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCitySignal } from '../services/api'

const growthColor = {
  'Explosive': '#34d399',
  'Strong': '#60a5fa',
  'Rising': '#a78bfa',
  'Emerging': '#f59e0b',
}

export default function CitySignalPanel({ query }) {
  const [cities, setCities] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!query) return
    setCities([])
    getCitySignal(query)
      .then(res => setCities(res.data.cities || []))
      .catch(() => {})
  }, [query])

  if (!cities.length) return null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">City Presence</span>
        <span className="text-slate-700 text-xs ml-1">— where {query} has a footprint</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cities.map((city) => (
          <button
            key={city.name}
            onClick={() => navigate('/cities')}
            className="text-left p-4 rounded-xl border border-slate-800 bg-slate-950 hover:border-cyan-500/40 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-white font-semibold text-sm group-hover:text-cyan-300 transition-colors">{city.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2"
                style={{ background: `${growthColor[city.growth_label] || '#94a3b8'}18`, color: growthColor[city.growth_label] || '#94a3b8' }}>
                {city.growth_label}
              </span>
            </div>
            <div className="text-xs text-slate-500 mb-2">{city.match_reason}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">${(city.avg_salary / 1000).toFixed(0)}k avg salary</span>
              <span className="text-xs text-slate-600">#{city.tech_score} score</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {city.top_industries.map(ind => (
                <span key={ind} className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">{ind}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
