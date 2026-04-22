const GRADE_INFO = {
  A:  { verdict: 'Very Positive',     color: 'text-green-400',  bg: 'bg-green-950/40 border-green-900/50' },
  B:  { verdict: 'Mostly Positive',   color: 'text-green-400',  bg: 'bg-green-950/40 border-green-900/50' },
  'C+': { verdict: 'Slightly Positive', color: 'text-green-300', bg: 'bg-green-950/20 border-green-900/30' },
  C:  { verdict: 'Mixed / Neutral',   color: 'text-slate-400',  bg: 'bg-slate-800 border-slate-700' },
  'C-': { verdict: 'Slightly Negative', color: 'text-red-300',  bg: 'bg-red-950/20 border-red-900/30' },
  D:  { verdict: 'Mostly Negative',   color: 'text-red-400',    bg: 'bg-red-950/40 border-red-900/50' },
  F:  { verdict: 'Very Negative',     color: 'text-red-500',    bg: 'bg-red-950/50 border-red-900/60' },
}

export default function SentimentMeter({ sentiment }) {
  if (!sentiment) return null

  const { positive, neutral, negative, compound, total_analyzed, reddit_count, news_count } = sentiment

  let grade
  if (compound >= 0.5)       grade = 'A'
  else if (compound >= 0.2)  grade = 'B'
  else if (compound >= 0.05) grade = 'C+'
  else if (compound > -0.05) grade = 'C'
  else if (compound > -0.2)  grade = 'C-'
  else if (compound > -0.5)  grade = 'D'
  else                       grade = 'F'

  const { verdict, color, bg } = GRADE_INFO[grade]
  const needlePos = Math.min(Math.max(((compound + 1) / 2) * 100, 2), 98)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold text-base">Sentiment Rating</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            AI-analyzed tone across{' '}
            <span className="text-slate-400 font-medium">{total_analyzed} sources</span>
          </p>
        </div>
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${bg}`}>
          <span className={`text-4xl font-black ${color}`}>{grade}</span>
          <div>
            <div className={`font-semibold text-sm ${color}`}>{verdict}</div>
            <div className="text-slate-600 text-xs">overall rating</div>
          </div>
        </div>
      </div>

      {/* Segmented bar */}
      <div className="flex rounded-lg overflow-hidden h-4 mb-2 gap-px">
        <div className="bg-green-500 transition-all duration-700" style={{ width: `${positive}%` }} />
        <div className="bg-slate-600 transition-all duration-700" style={{ width: `${neutral}%` }} />
        <div className="bg-red-500 transition-all duration-700"   style={{ width: `${negative}%` }} />
      </div>
      <div className="flex justify-between text-xs mb-5">
        <span className="text-green-400 font-semibold">▲ Positive {positive}%</span>
        <span className="text-slate-500">Neutral {neutral}%</span>
        <span className="text-red-400 font-semibold">▼ Negative {negative}%</span>
      </div>

      {/* Compound score slider */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-600 mb-1.5">
          <span>−1.0 Very Negative</span>
          <span>0 Neutral</span>
          <span>Very Positive +1.0</span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden"
          style={{ background: 'linear-gradient(to right, #ef4444 0%, #94a3b8 50%, #22c55e 100%)' }}>
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-slate-900 shadow-lg"
            style={{ left: `${needlePos}%`, transform: 'translate(-50%, -50%)' }} />
        </div>
        <div className="text-center mt-2">
          <span className="text-slate-500 text-xs">Compound score: </span>
          <span className={`text-sm font-bold ${color}`}>{compound}</span>
          <span className="text-slate-600 text-xs"> / 1.0</span>
        </div>
      </div>

      {/* What this means */}
      <div className="border-t border-slate-800 pt-4">
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">How this is calculated</p>
        <p className="text-slate-500 text-xs leading-relaxed">
          This rating uses <span className="text-slate-400">VADER sentiment analysis</span> — a natural language processing model
          trained to score the emotional tone of text. Each headline and post is scored from −1.0 (very negative) to +1.0
          (very positive), then averaged into a compound score. The letter grade maps the compound score to an A–F scale.
        </p>
        <div className="flex flex-wrap gap-3 mt-3">
          {reddit_count !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              {reddit_count} Reddit posts analyzed
            </div>
          )}
          {news_count !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {news_count} news articles analyzed
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Source: VADER NLP · vaderSentiment library
          </div>
        </div>
      </div>
    </div>
  )
}
