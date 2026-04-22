const QUALITY_LABELS = {
  5: { label: 'Premium Source', color: 'text-cyan-400 bg-cyan-950/40' },
  4: { label: 'Trusted Source', color: 'text-green-400 bg-green-950/40' },
  3: { label: 'Established Source', color: 'text-slate-400 bg-slate-800' },
  2: { label: 'Independent Source', color: 'text-slate-500 bg-slate-800/50' },
}

const sentimentLabel = (score) => {
  if (score >= 0.05)  return { text: 'Positive', color: 'text-green-400 bg-green-950/40' }
  if (score <= -0.05) return { text: 'Critical',  color: 'text-red-400 bg-red-950/40' }
  return { text: 'Neutral', color: 'text-slate-400 bg-slate-800' }
}

export default function NewsCard({ article }) {
  const label   = sentimentLabel(article.sentiment_score ?? 0)
  const quality = QUALITY_LABELS[article.source_quality] || QUALITY_LABELS[2]

  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
      className="block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-900 hover:bg-slate-800/50 transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-300 font-semibold">{article.source}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${quality.color}`}>{quality.label}</span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${label.color}`}>{label.text}</span>
      </div>
      <h4 className="text-slate-200 font-medium text-sm leading-snug mb-2 group-hover:text-white transition-colors">{article.title}</h4>
      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{article.description}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-slate-700 text-xs">{new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        <span className="text-slate-700 text-xs group-hover:text-slate-500 transition-colors">Read article →</span>
      </div>
    </a>
  )
}
