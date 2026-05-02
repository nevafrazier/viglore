const LABEL_COLORS = {
  Explosive: 'text-cyan-400 bg-cyan-950/40 border-cyan-900/50',
  Strong:    'text-green-400 bg-green-950/40 border-green-900/50',
  Rising:    'text-blue-400 bg-blue-950/40 border-blue-900/50',
  Emerging:  'text-purple-400 bg-purple-950/40 border-purple-900/50',
}

export default function CityDetailModal({ city, onClose }) {
  if (!city) return null

  const isEstimated = city.is_estimated

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-white font-bold text-2xl">{city.name}</h2>
              {city.growth_label && (
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${LABEL_COLORS[city.growth_label] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                  {city.growth_label}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm">{city.summary}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white ml-4 text-xl leading-none">✕</button>
        </div>

        {/* Estimated data notice */}
        {isEstimated && (
          <div className="mx-6 mt-5 bg-amber-950/30 border border-amber-800/40 rounded-xl px-4 py-3 text-amber-400 text-sm">
            This city isn't in our ranked database — showing general information pulled from Wikipedia. Detailed job stats are only available for our 50 tracked cities.
          </div>
        )}

        <div className="p-6 space-y-6">

          {/* Job Stats — only if we have real data */}
          {!isEstimated && city.total_tech_jobs != null && (
            <div>
              <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-3">Job Market</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Tech Jobs', value: city.total_tech_jobs.toLocaleString(), sub: 'open positions' },
                  { label: 'Average Salary', value: `$${(city.avg_salary / 1000).toFixed(0)}k/yr`, sub: 'tech roles' },
                  { label: 'AI & Data Jobs', value: city.ai_jobs.toLocaleString(), sub: 'ML, AI, data science' },
                  { label: 'Finance Tech Jobs', value: city.finance_tech_jobs.toLocaleString(), sub: 'fintech, banking tech' },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-800/50 rounded-xl p-4">
                    <p className="text-slate-500 text-xs mb-1">{s.label}</p>
                    <p className="text-white font-bold text-lg">{s.value}</p>
                    <p className="text-slate-600 text-xs">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost of Living — only if we have real data */}
          {!isEstimated && city.cost_of_living && (
            <div>
              <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-3">Cost of Living</h3>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-3">{city.cost_of_living.note}</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-white font-bold text-lg">{city.cost_of_living.index}</p>
                    <p className="text-slate-500 text-xs">Cost Index<br/><span className="text-slate-600">(US avg = 100)</span></p>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">${city.cost_of_living.avg_rent_1br.toLocaleString()}/mo</p>
                    <p className="text-slate-500 text-xs">Avg 1BR Rent</p>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">${(city.cost_of_living.avg_home_price / 1000).toFixed(0)}k</p>
                    <p className="text-slate-500 text-xs">Avg Home Price</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weather — only if we have real data */}
          {!isEstimated && city.weather && (
            <div>
              <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-3">Weather</h3>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-3">{city.weather.description}</p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Summer Avg</p>
                    <p className="text-orange-400 font-semibold">{city.weather.avg_summer}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Winter Avg</p>
                    <p className="text-blue-400 font-semibold">{city.weather.avg_winter}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Sunny Days/Year</p>
                    <p className="text-yellow-400 font-semibold">{city.weather.sunny_days} days</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Colleges */}
          {city.colleges && city.colleges.length > 0 && (
            <div>
              <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-3">Top Colleges & Universities</h3>
              <div className="flex flex-wrap gap-2">
                {city.colleges.map((c) => (
                  <span key={c} className="text-sm text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg">{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Major Companies */}
          {city.major_companies && city.major_companies.length > 0 && (
            <div>
              <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-3">Major Companies Here</h3>
              <div className="flex flex-wrap gap-2">
                {city.major_companies.map((c) => (
                  <span key={c} className="text-sm text-cyan-300 bg-cyan-950/30 border border-cyan-900/40 px-3 py-1.5 rounded-lg">{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Industries */}
          {city.top_industries && city.top_industries.length > 0 && (
            <div>
              <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-3">Dominant Industries</h3>
              <div className="flex flex-wrap gap-2">
                {city.top_industries.map((ind) => (
                  <span key={ind} className="text-sm text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg">{ind}</span>
                ))}
              </div>
            </div>
          )}

          {/* Estimated city CTA */}
          {isEstimated && (
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-center">
              <p className="text-slate-500 text-sm">Want full rankings and job data?</p>
              <p className="text-slate-600 text-xs mt-1">Browse our 50 ranked tech cities above for detailed career intelligence.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
