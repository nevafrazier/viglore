export default function StockCard({ stock }) {
  if (!stock) return null
  if (stock.error) return (
    <div className="bg-slate-900 border border-red-900/50 rounded-xl p-6 text-red-400 text-sm">
      {stock.error}
    </div>
  )

  const change = parseFloat(stock.change)
  const isPositive = change >= 0
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400'
  const changeBg = isPositive ? 'bg-green-950/40' : 'bg-red-950/40'

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">{stock.ticker}</h2>
          <p className="text-slate-500 text-sm mt-1">Stock Quote</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${changeBg} ${changeColor}`}>
          {isPositive ? '▲' : '▼'} {stock.change_percent}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-slate-500 text-xs mb-1">Price</p>
          <p className="text-white text-xl font-semibold">${parseFloat(stock.price).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Daily Change</p>
          <p className={`text-xl font-semibold ${changeColor}`}>
            {isPositive ? '+' : ''}{parseFloat(stock.change).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Volume</p>
          <p className="text-white text-xl font-semibold">{parseInt(stock.volume).toLocaleString()}</p>
        </div>
      </div>

      <p className="text-slate-600 text-xs mt-4">Data via Alpha Vantage · Not financial advice</p>
    </div>
  )
}
