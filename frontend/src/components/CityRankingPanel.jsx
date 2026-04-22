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

function StatBox({ label, value, sub }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <p className="text-slate-500 text-xs mb-0.5">{label}</p>
      <p className="text-white font-semibold text-sm">{value}</p>
      {sub && <p className="text-slate-600 text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

export default function CityRankingPanel({ cities }) {
  if (!cities?.length) return null

  return (
    <div className="grid gap-6">
      {cities.map((city, i) => (
        <div key={city.name} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-slate-700">#{i + 1}</span>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-bold text-xl">{city.name}</h3>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${LABEL_COLORS[city.growth_label]}`}>
                    {city.growth_label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {city.top_industries.map((ind) => (
                    <span key={ind} className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{ind}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 font-bold text-2xl">{city.tech_score}</div>
              <div className="text-slate-600 text-xs">tech score</div>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-4">{city.summary}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBox
              label="Total Tech Jobs"
              value={city.total_tech_jobs.toLocaleString()}
              sub="open positions"
            />
            <StatBox
              label="AI & Data Jobs"
              value={city.ai_jobs.toLocaleString()}
              sub="machine learning, AI roles"
            />
            <StatBox
              label="Finance Tech Jobs"
              value={city.finance_tech_jobs.toLocaleString()}
              sub="fintech, banking tech"
            />
            <StatBox
              label="Avg Tech Salary"
              value={`$${(city.avg_salary / 1000).toFixed(0)}k`}
              sub="per year"
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-slate-600 text-xs">Startup Activity:</span>
            <span className={`text-xs font-medium ${ACTIVITY_COLORS[city.startup_activity]}`}>
              {city.startup_activity}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
