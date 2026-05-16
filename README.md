<h1 align="center">Viglore</h1>

<p align="center">
  Market intelligence for any company, stock, or topic — powered by live news, NLP sentiment, stock data, and U.S. city rankings.
</p>

<p align="center">
  <a href="https://viglore.com"><img src="https://img.shields.io/badge/Live%20App-viglore.com-34d399?style=flat-square" alt="Live App"/></a>
  &nbsp;
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Deployed-Vercel%20%2B%20Railway-000000?style=flat-square&logo=vercel&logoColor=white" alt="Deployed"/>
</p>

---

## What It Does

Viglore lets you search any company, stock, or topic and instantly surfaces a full intelligence snapshot:

- **Sentiment score** from live news headlines using VADER NLP
- **Top news articles** filtered and ranked by relevance
- **Wikipedia context** — overview, founding year, headquarters, key facts
- **Keyword extraction** from recent coverage
- **City signal** — which U.S. cities are most economically connected to your query
- **Stock page** — live price, market cap, P/E ratio, EPS, historical chart, and Stocktwits trader sentiment feed
- **City rankings** — 100 U.S. cities ranked by tech market strength with sortable profiles

The name comes from *vigilance + lore*. Tagline: **Stay Vigilant. Stay Informed.**

---

## Pages

| Page | Description |
|---|---|
| **Home** | Landing page with trending news pulled live from Guardian API, filterable by category |
| **Dashboard** | Core search experience — sentiment, news, keywords, Wikipedia context, city signal |
| **Stocks** | Ticker search with live price, company fundamentals, chart, and Stocktwits social feed |
| **Cities** | 100 U.S. cities ranked by tech market strength, fully sortable, click for full city profile |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 · React Router · Tailwind CSS · Recharts · Axios · Vite |
| **Backend** | FastAPI · VADER Sentiment (vaderSentiment) · httpx · SQLAlchemy |
| **APIs** | NewsAPI · Finnhub · Stocktwits (public) · Guardian API · Wikipedia REST API |
| **Deployment** | Vercel (frontend) · Railway (backend, port 8080) |

---

## Architecture

```
Browser
  ├── Vercel (React frontend, viglore.com)
  │     ├── Dashboard → Railway API for search, sentiment, Wikipedia
  │     ├── Stocks    → Railway API for Finnhub + Stocktwits data
  │     ├── Cities    → Local cityData.js (100 cities, no API call)
  │     └── Home      → Guardian API fetched directly in-browser
  └── Railway (FastAPI backend)
        ├── /api/search     → NewsAPI + VADER NLP sentiment
        ├── /api/describe   → Wikipedia REST API
        ├── /api/suggest    → Wikipedia opensearch disambiguation
        ├── /api/stocks     → Finnhub live price
        ├── /api/company    → Alpha Vantage fundamentals
        ├── /api/stocktwits → Stocktwits public feed
        └── /api/city-signal → matches query to city data
```

City data lives in `frontend/src/data/cityData.js` — 100 cities with jobs, salary, cost of living, weather, colleges, and major industries loaded directly by the frontend with no backend dependency.

---

## Security

![Security Headers](https://img.shields.io/badge/Security%20Headers-A%20Rated-34d399?style=flat-square)

- HTTP security headers on both frontend and backend — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- CORS locked to production domain only (`viglore.com`) — no wildcard origins
- Rate limiting on all external API endpoints via `slowapi` — prevents quota abuse
- Input validation and max-length constraints on all query parameters
- API keys stored as environment variables, never committed to source control

---

## Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # fill in your API keys
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI runs at `http://localhost:5173` and expects the API at `http://localhost:8000`.

---

## Environment Variables

**Backend `.env`**

```
NEWS_API_KEY=your_newsapi_key
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
FINNHUB_KEY=your_finnhub_key
```

**Frontend (Vercel or `.env.local`)**

```
VITE_API_URL=http://localhost:8000   # local
# VITE_API_URL=https://your-railway-backend.up.railway.app   # production
```

---

## Project Structure

```
viglore/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI entry point, CORS config
│   │   ├── routes/               # One file per endpoint group
│   │   │   ├── search.py         # News + VADER sentiment
│   │   │   ├── describe.py       # Wikipedia overview
│   │   │   ├── stocks.py         # Finnhub + Alpha Vantage
│   │   │   ├── stocktwits.py     # Stocktwits feed
│   │   │   ├── city_signal.py    # Query-to-city matching
│   │   │   └── city_lookup.py    # Wikipedia fallback for unlisted cities
│   │   └── services/             # External API clients + NLP logic
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/                # Home, Dashboard, Stocks, Cities
    │   ├── components/           # SentimentMeter, NewsCard, StockCard, etc.
    │   ├── data/
    │   │   └── cityData.js       # 100 U.S. cities — all city data lives here
    │   └── services/             # Axios API client
    └── vite.config.js
```

---

## Data Sources

| Data | Source | Notes |
|---|---|---|
| News & sentiment | NewsAPI + VADER NLP | Articles filtered to query in title |
| Trending news (Home) | Guardian API | Fetched browser-side; bypasses Railway |
| Stock price | Finnhub | Switched from Alpha Vantage (25 req/day limit) |
| Company fundamentals | Alpha Vantage | P/E, market cap, EPS, sector |
| Trader sentiment | Stocktwits public API | No auth required |
| Topic context | Wikipedia REST API | Requires User-Agent header |
| City profiles | Local JS file | 100 cities, deployed instantly via Vercel |

---

Built by [Neva Frazier](https://nevafrazier.com)
