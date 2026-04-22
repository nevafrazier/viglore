import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#22d3ee', '#64748b', '#f87171']

export default function SentimentChart({ sentiment }) {
  if (!sentiment) return null

  const data = [
    { name: 'Positive', value: sentiment.positive },
    { name: 'Neutral', value: sentiment.neutral },
    { name: 'Negative', value: sentiment.negative },
  ]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-1">Sentiment Analysis</h3>
      <p className="text-slate-500 text-sm mb-4">{sentiment.total_analyzed} sources analyzed</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center">
        <span className="text-slate-400 text-sm">Compound score: </span>
        <span className={`font-semibold text-sm ${sentiment.compound >= 0.05 ? 'text-cyan-400' : sentiment.compound <= -0.05 ? 'text-red-400' : 'text-slate-300'}`}>
          {sentiment.compound}
        </span>
      </div>
    </div>
  )
}
