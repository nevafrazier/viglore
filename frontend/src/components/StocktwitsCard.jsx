const sentimentStyle = {
  Bullish: { color: 'text-green-400', bg: 'bg-green-950/40', label: 'Bullish' },
  Bearish: { color: 'text-red-400',   bg: 'bg-red-950/40',   label: 'Bearish' },
}

export default function StocktwitsCard({ message }) {
  const s = sentimentStyle[message.sentiment] || null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-xs font-semibold">@{message.username}</span>
          {message.followers > 0 && (
            <span className="text-slate-600 text-xs">{message.followers.toLocaleString()} followers</span>
          )}
        </div>
        {s && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.color} ${s.bg}`}>{s.label}</span>
        )}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">{message.body}</p>
    </div>
  )
}
