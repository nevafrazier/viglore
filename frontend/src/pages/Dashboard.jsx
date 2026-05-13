import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchQuery, describeTopic, getSuggestions } from '../services/api'
import SentimentMeter from '../components/SentimentMeter'
import KeywordPanel from '../components/KeywordPanel'
import SummaryPanel from '../components/SummaryPanel'
import NewsCard from '../components/NewsCard'
import RedditCard from '../components/RedditCard'
import TopicDescription from '../components/TopicDescription'
import CitySignalPanel from '../components/CitySignalPanel'

function ArticleSection({ title, subtitle, dot, items, Component }) {
  if (!items?.length) return null
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className={`text-xs font-semibold uppercase tracking-widest ${dot === 'bg-green-400' ? 'text-green-400' : dot === 'bg-red-400' ? 'text-red-400' : 'text-slate-500'}`}>{title}</span>
        <span className="text-slate-700 text-xs ml-1">— {subtitle}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((item, i) => <Component key={i} {...(Component === NewsCard ? { article: item } : { post: item })} />)}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [input, setInput] = useState(searchParams.get('q') || '')
  const [data, setData] = useState(null)
  const [topicInfo, setTopicInfo] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [selectedTitle, setSelectedTitle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('news')

  useEffect(() => {
    if (query) fetchData(query)
  }, [query])

  const fetchData = async (q) => {
    setLoading(true)
    setError(null)
    setData(null)
    setTopicInfo(null)
    setSuggestions([])
    setSelectedTitle(null)
    try {
      const [searchRes, describeRes, suggestRes] = await Promise.all([
        searchQuery(q),
        describeTopic(q),
        getSuggestions(q),
      ])
      setData(searchRes.data)
      setTopicInfo(describeRes.data)
      const opts = suggestRes.data?.options || []
      setSuggestions(opts)
      // auto-select the first option that matches what Wikipedia returned
      if (opts.length > 0) setSelectedTitle(opts[0].title)
    } catch {
      setError('Failed to fetch data. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const selectSuggestion = (title) => {
    if (title === selectedTitle) return
    handleSearch(title)
  }

  const handleSearch = (term) => {
    const q = (term || input).trim()
    if (q) {
      setInput(q)
      setQuery(q)
      navigate(`/dashboard?q=${encodeURIComponent(q)}`)
    }
  }

  const pos   = data?.news_articles.filter(a => a.sentiment_score >= 0.05)  ?? []
  const neu   = data?.news_articles.filter(a => a.sentiment_score > -0.05 && a.sentiment_score < 0.05) ?? []
  const neg   = data?.news_articles.filter(a => a.sentiment_score <= -0.05) ?? []
  const rPos  = data?.reddit_posts.filter(p => p.sentiment_score >= 0.05)   ?? []
  const rNeg  = data?.reddit_posts.filter(p => p.sentiment_score <= -0.05)  ?? []
  const rNeu  = data?.reddit_posts.filter(p => p.sentiment_score > -0.05 && p.sentiment_score < 0.05) ?? []

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Search bar — sticky tool bar */}
      <div className="py-4 border-b border-slate-800 bg-slate-950/95 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-3">
          <div className="text-slate-600 text-sm font-medium shrink-0 hidden md:block">Dashboard</div>
          <div className="hidden md:block text-slate-800">›</div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search a company, game, stock, or topic..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
          />
          <button
            onClick={() => handleSearch()}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-colors text-sm shrink-0"
          >
            Analyze
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex flex-col items-center gap-3 text-slate-400 py-24 justify-center">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Analyzing <span className="text-white font-medium">"{query}"</span> across news sources...</span>
          </div>
        )}

        {error && <p className="text-red-400 py-10 text-center">{error}</p>}

        {!data && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl mb-4">🔍</div>
            <h2 className="text-white font-semibold text-lg mb-2">Ready to analyze</h2>
            <p className="text-slate-500 text-sm max-w-sm">Type any company, stock, game, or topic in the search bar above to see live sentiment scores, news coverage, and trend data.</p>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-6">
            {/* Disambiguation bar */}
            {suggestions.length > 1 && (
              <div className="bg-slate-900 border border-slate-700 rounded-xl px-6 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-white text-sm font-semibold">Showing overview for</span>
                  <span className="text-slate-500 text-sm hidden sm:block">— select a topic to refine results</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => selectSuggestion(s.title)}
                      title={s.description}
                      className={`text-sm px-4 py-2 rounded-lg border font-medium transition-all ${
                        selectedTitle === s.title
                          ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Topic overview */}
            <TopicDescription info={topicInfo} query={query} />

            {/* AI Summary */}
            <SummaryPanel summary={data.summary} query={data.query} />

            {/* Sentiment + Keywords side by side */}
            <div className="grid md:grid-cols-2 gap-5">
              <SentimentMeter sentiment={data.sentiment} />
              <KeywordPanel keywords={data.keywords} query={query} />
            </div>

            {/* City Presence */}
            <CitySignalPanel query={query} />

            {/* News */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">News Articles</span>
                <span className="text-xs bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded-full ml-1">{data.news_articles.length}</span>
              </div>
              <div className="p-5">
                <ArticleSection title="Favorable Coverage" subtitle="articles with a positive tone" dot="bg-green-400" items={pos} Component={NewsCard} />
                <ArticleSection title="Neutral / Informational" subtitle="factual reporting" dot="bg-slate-500" items={neu} Component={NewsCard} />
                <ArticleSection title="Critical Coverage" subtitle="articles with a negative or critical tone" dot="bg-red-400" items={neg} Component={NewsCard} />
                {!pos.length && !neu.length && !neg.length && (
                  <p className="text-slate-500 text-center py-8">No news articles found for this topic.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
