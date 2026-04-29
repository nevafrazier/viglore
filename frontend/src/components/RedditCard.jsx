const sentimentLabel = (score) => {
  if (score >= 0.05) return { text: 'Positive', color: 'text-green-400 bg-green-950/40' }
  if (score <= -0.05) return { text: 'Critical', color: 'text-red-400 bg-red-950/40' }
  return { text: 'Neutral', color: 'text-slate-400 bg-slate-800' }
}

export default function RedditCard({ post }) {
  const label = sentimentLabel(post.sentiment_score ?? 0)

  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer"
      className="block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-orange-900 hover:bg-slate-800/60 transition-all">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs text-orange-400 font-medium bg-orange-950/40 px-2 py-0.5 rounded-full">{post.subreddit === 'Hacker News' ? 'HN' : `r/${post.subreddit}`}</span>
        <span className="text-xs text-slate-500">↑ {post.score.toLocaleString()}</span>
        <span className="text-xs text-slate-500">💬 {post.comments}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ml-auto ${label.color}`}>{label.text}</span>
      </div>
      <h4 className="text-slate-200 font-medium text-sm leading-snug">{post.title}</h4>
    </a>
  )
}
