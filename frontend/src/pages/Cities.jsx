import { useState, useEffect } from 'react'
import { getCityLookup } from '../services/api'
import CityDetailModal from '../components/CityDetailModal'
import ALL_CITIES from '../data/cityData'

const LABEL_COLORS = {
  Explosive: 'text-cyan-400 bg-cyan-950/40 border-cyan-900/50',
  Strong:    'text-green-400 bg-green-950/40 border-green-900/50',
  Rising:    'text-blue-400 bg-blue-950/40 border-blue-900/50',
  Emerging:  'text-purple-400 bg-purple-950/40 border-purple-900/50',
}

const ACTIVITY_COLORS = {
  'Very High': 'text-cyan-400',
  'High':      'text-green-400',
  'Medium':    'text-yellow-400',
}

// Fixed ranks — always based on high-to-low tech score regardless of sort
const RANK_MAP = Object.fromEntries(
  [...ALL_CITIES]
    .sort((a, b) => b.tech_score - a.tech_score)
    .map((city, i) => [city.name, i + 1])
)

export default function Cities() {
  const [cities, setCities] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedCity, setSelectedCity] = useState(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')

  useEffect(() => {
    setCities(ALL_CITIES)
    setFiltered(ALL_CITIES)
    setLoading(false)
  }, [])

  useEffect(() => {
    let result = [...cities]
    if (search.trim()) {
      result = result.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    }
    result.sort((a, b) => sortOrder === 'desc' ? b.tech_score - a.tech_score : a.tech_score - b.tech_score)
    setFiltered(result)
  }, [search, sortOrder, cities])

  const handleLookup = async () => {
    if (!search.trim()) return
    setLookupLoading(true)
    setLookupError('')
    try {
      const res = await getCityLookup(search.trim())
      if (res.data.error) {
        setLookupError(res.data.error)
      } else {
        setSelectedCity(res.data)
      }
    } catch {
      setLookupError('Could not look up that city. Try adding the state (e.g. "Tucson, AZ").')
    } finally {
      setLookupLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tech City Intelligence</h1>
          <p className="text-slate-400 text-lg mb-2">Ranking the fastest-growing US cities for tech and finance careers.</p>
          <p className="text-slate-500 text-sm max-w-2xl">
            Each city is scored on total tech jobs, AI roles, finance tech demand, average salaries, and startup activity.
            Click any city for a full breakdown including cost of living, weather, colleges, and major employers.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search any US city..."
            onKeyDown={(e) => e.key === 'Enter' && filtered.length === 0 && handleLookup()}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
          />
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-sm text-slate-300 transition-colors"
          >
            <span>Tech Score</span>
            <span className="text-cyan-400">{sortOrder === 'desc' ? '↓ High to Low' : '↑ Low to High'}</span>
          </button>
        </div>

        {loading ? (
          <div className="text-slate-500 text-center py-20">Loading city data...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-2">"{search}" isn't in our ranked database.</p>
            <p className="text-slate-600 text-sm mb-6">We rank 100 US tech cities. Want general info about this city?</p>
            <button
              onClick={handleLookup}
              disabled={lookupLoading}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              {lookupLoading ? 'Looking up...' : `Look up "${search}" →`}
            </button>
            {lookupError && <p className="text-red-400 text-sm mt-4">{lookupError}</p>}
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((city, i) => (
              <button
                key={city.name}
                onClick={() => setSelectedCity(city)}
                className="w-full text-left bg-slate-900 border border-slate-800 hover:border-cyan-800 hover:bg-slate-800/60 rounded-xl p-5 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-slate-700">#{RANK_MAP[city.name]}</span>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">{city.name}</h3>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${LABEL_COLORS[city.growth_label]}`}>
                          {city.growth_label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {city.top_industries.slice(0, 3).map((ind) => (
                          <span key={ind} className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{ind}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-cyan-400 font-bold text-2xl">{city.tech_score}</div>
                      <div className="text-slate-600 text-xs">tech score</div>
                    </div>
                    <span className="text-slate-600 group-hover:text-slate-400 transition-colors text-lg">›</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Total Tech Jobs', value: city.total_tech_jobs.toLocaleString() },
                    { label: 'AI Jobs', value: city.ai_jobs.toLocaleString() },
                    { label: 'Finance Tech', value: city.finance_tech_jobs.toLocaleString() },
                    { label: 'Avg Salary', value: `$${(city.avg_salary / 1000).toFixed(0)}k` },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-800/40 rounded-lg px-3 py-2">
                      <p className="text-slate-600 text-xs">{s.label}</p>
                      <p className="text-slate-200 font-semibold text-sm">{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
                  <span>Startup Activity: <span className={ACTIVITY_COLORS[city.startup_activity]}>{city.startup_activity}</span></span>
                  <span className="text-slate-700">·</span>
                  <span className="text-slate-700 group-hover:text-slate-500 transition-colors">Click to see full details →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedCity && (
        <CityDetailModal city={selectedCity} onClose={() => setSelectedCity(null)} />
      )}
    </div>
  )
}
