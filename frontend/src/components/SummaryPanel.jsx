export default function SummaryPanel({ summary, query }) {
  if (!summary) return null

  return (
    <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-900/40 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <h3 className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Sentiment Summary</h3>
      </div>
      <p className="text-slate-200 leading-relaxed">{summary}</p>
      {query && <p className="text-slate-500 text-sm mt-3">Query: <span className="text-slate-400">"{query}"</span></p>}
    </div>
  )
}
