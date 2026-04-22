import { useState, useEffect } from 'react'
import { getStocks } from '../services/api'

const TYPE_LABELS = {
  game:    { icon: '🎮', label: 'Video Game' },
  movie:   { icon: '🎬', label: 'Film' },
  show:    { icon: '📺', label: 'TV / Streaming' },
  company: { icon: '🏢', label: 'Company' },
  music:   { icon: '🎵', label: 'Music' },
  person:  { icon: '👤', label: 'Public Figure' },
  general: { icon: '🔍', label: 'Topic' },
}

const AWARD_ICONS = {
  'Game of the Year': '🏆',
  'Academy Award (Oscar)': '🎬',
  'BAFTA Award': '🎭',
  'Grammy Award': '🎵',
  'Golden Globe': '🌟',
  'Emmy Award': '📺',
  'Best-Selling': '📈',
  'Unicorn / $1B+ Valuation': '🦄',
}

function StatCard({ label, value, accent }) {
  if (!value) return null
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${accent || 'text-slate-500'}`}>{label}</p>
      <p className="text-white font-bold text-sm leading-snug">{value}</p>
    </div>
  )
}

export default function TopicDescription({ info, query }) {
  const [stock, setStock] = useState(null)
  const [stockLoading, setStockLoading] = useState(false)

  useEffect(() => {
    if (info?.stock_ticker) {
      setStockLoading(true)
      getStocks(info.stock_ticker)
        .then(res => setStock(res.data))
        .catch(() => {})
        .finally(() => setStockLoading(false))
    } else {
      setStock(null)
    }
  }, [info?.stock_ticker])

  if (!info?.found) return null

  const typeInfo = TYPE_LABELS[info.content_type] || TYPE_LABELS.general
  const change = stock ? parseFloat(stock.change) : 0
  const isPositive = change >= 0

  // Build stat cards based on what's available
  const statCards = [
    info.year_created && {
      label: info.content_type === 'person' ? 'Born' : info.content_type === 'company' ? 'Founded' : 'Released',
      value: info.year_created,
      accent: 'text-cyan-500',
    },
    info.year_died && {
      label: info.content_type === 'person' ? 'Died' : 'Discontinued',
      value: info.year_died,
      accent: 'text-red-400',
    },
    info.copies_sold && { label: 'Copies Sold', value: info.copies_sold, accent: 'text-green-400' },
    info.players && { label: 'Players / Users', value: info.players, accent: 'text-blue-400' },
    info.box_office && { label: 'Box Office', value: info.box_office, accent: 'text-yellow-400' },
    info.net_worth && { label: 'Net Worth', value: info.net_worth, accent: 'text-green-400' },
    info.developer && { label: info.content_type === 'movie' ? 'Director / Studio' : 'Developer', value: info.developer, accent: 'text-slate-400' },
    info.genre && { label: 'Genre', value: info.genre, accent: 'text-purple-400' },
    info.platforms && { label: 'Platforms', value: info.platforms, accent: 'text-slate-400' },
    // Stock stats
    stock && !stock.error && { label: 'Stock Price', value: `$${parseFloat(stock.price).toFixed(2)}`, accent: 'text-cyan-400' },
    stock && !stock.error && { label: 'Daily Change', value: `${isPositive ? '▲' : '▼'} ${stock.change_percent}`, accent: isPositive ? 'text-green-400' : 'text-red-400' },
    stock && !stock.error && { label: 'Volume', value: parseInt(stock.volume).toLocaleString(), accent: 'text-slate-400' },
  ].filter(Boolean)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

      {/* Header row */}
      <div className="flex gap-4 p-5">
        {info.thumbnail && (
          <img src={info.thumbnail} alt={info.title}
            className="w-20 h-20 object-cover rounded-xl shrink-0 border border-slate-700" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span>{typeInfo.icon}</span>
            <h2 className="text-white font-bold text-lg">{info.title}</h2>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{typeInfo.label}</span>
            {info.stock_ticker && (
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-900/50 px-2 py-0.5 rounded-full">
                {info.stock_ticker}
              </span>
            )}
          </div>
          {info.description && (
            <p className="text-slate-500 text-xs mb-2 italic">{info.description}</p>
          )}
          {/* Shorter description — 2 lines max */}
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{info.extract}</p>
        </div>
      </div>

      {/* Stats grid */}
      {statCards.length > 0 && (
        <div className="px-5 pb-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {statCards.map((s, i) => (
              <StatCard key={i} label={s.label} value={s.value} accent={s.accent} />
            ))}
            {stockLoading && (
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-2">
                <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-500 text-xs">Loading stock...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Awards */}
      {info.awards?.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-yellow-500 text-xs font-semibold uppercase tracking-wider mb-2">🏅 Awards & Recognition</p>
          <div className="flex flex-wrap gap-2">
            {info.awards.map((award, i) => {
              const name = typeof award === 'object' ? award.name : award
              const status = typeof award === 'object' ? award.status : null
              const statusColor = status === 'Won' ? 'text-yellow-300 bg-yellow-950/40 border-yellow-800/50'
                : status === 'Nominated' ? 'text-orange-300 bg-orange-950/30 border-orange-900/40'
                : 'text-slate-300 bg-slate-800/60 border-slate-700/50'
              return (
                <span key={i}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium border ${statusColor}`}>
                  {AWARD_ICONS[name] || '🏅'} {name}
                  {status && <span className="opacity-60 text-[10px] ml-0.5">· {status}</span>}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Achievements */}
      {info.achievements?.length > 0 && (
        <div className="px-5 pb-5">
          <p className="text-green-500 text-xs font-semibold uppercase tracking-wider mb-2">🏆 Records & Achievements</p>
          <ul className="space-y-1.5">
            {info.achievements.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-600">
        <span>Overview: <span className="text-slate-500">Wikipedia</span></span>
        {info.stock_ticker && <span>Market data: <span className="text-slate-500">Alpha Vantage</span></span>}
        <span className="ml-auto">Context panel · Not financial advice</span>
      </div>
    </div>
  )
}
