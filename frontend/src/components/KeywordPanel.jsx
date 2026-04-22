import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white font-semibold text-sm">"{payload[0].payload.word}"</p>
      <p className="text-cyan-400 text-xs mt-0.5">{payload[0].value} mentions across sources</p>
    </div>
  )
}

export default function KeywordPanel({ keywords, query }) {
  if (!keywords?.length) return null

  const total = keywords.reduce((sum, k) => sum + k.count, 0)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-base">Related Search Terms</h3>
          <p className="text-slate-400 text-sm mt-0.5">
            Words most commonly discussed alongside{' '}
            <span className="text-white font-medium">"{query}"</span>
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-cyan-400 font-bold text-lg">{keywords.length}</div>
          <div className="text-slate-600 text-xs">terms found</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={keywords.slice(0, 8)} layout="vertical" margin={{ left: 10, right: 40 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="word"
            tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 500 }}
            width={85}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="count"
              position="right"
              style={{ fill: '#94a3b8', fontSize: 12 }}
              formatter={(v) => `${v}x`}
            />
            {keywords.slice(0, 8).map((_, i) => (
              <Cell
                key={i}
                fill={i === 0 ? '#22d3ee' : i === 1 ? '#818cf8' : i === 2 ? '#6366f1' : '#334155'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* What this means */}
      <div className="border-t border-slate-800 pt-4 mt-2">
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">How this is calculated</p>
        <p className="text-slate-500 text-xs leading-relaxed">
          Keywords are extracted by scanning all collected news headlines and Reddit post titles, removing common filler words,
          then ranking the remaining terms by frequency. High-frequency terms indicate the dominant sub-topics driving discussion around this query.
        </p>
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            Source: Reddit post titles
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Source: News article headlines
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            {total} total word occurrences scanned
          </div>
        </div>
      </div>
    </div>
  )
}
