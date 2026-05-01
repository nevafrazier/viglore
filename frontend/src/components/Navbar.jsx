export default function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white font-bold text-lg tracking-tight">
            Vig<span className="text-cyan-400">lore</span>
          </span>
        </div>
        <div className="flex gap-6 text-sm text-slate-400">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
          <a href="/stocks" className="hover:text-white transition-colors">Stocks</a>
          <a href="/cities" className="hover:text-white transition-colors">Cities</a>
        </div>
      </div>
    </nav>
  )
}
