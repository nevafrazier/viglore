import time
import yfinance as yf

_quote_cache = {}
_overview_cache = {}
CACHE_TTL = 900  # 15 minutes


def _fmt_large(val) -> str:
    try:
        n = float(val)
        if n >= 1_000_000_000_000:
            return f"${n / 1_000_000_000_000:.2f}T"
        if n >= 1_000_000_000:
            return f"${n / 1_000_000_000:.2f}B"
        if n >= 1_000_000:
            return f"${n / 1_000_000:.2f}M"
        return f"${n:,.0f}"
    except Exception:
        return str(val) if val else "N/A"


def _fmt(val, decimals=2) -> str:
    try:
        return f"{float(val):.{decimals}f}"
    except Exception:
        return "N/A"


async def get_stock_quote(ticker: str) -> dict:
    key = ticker.upper()
    cached = _quote_cache.get(key)
    if cached and time.time() - cached["ts"] < CACHE_TTL:
        return cached["data"]

    try:
        t = yf.Ticker(key)
        fi = t.fast_info
        price = fi.last_price
        prev = fi.previous_close
        change = price - prev
        change_pct = (change / prev * 100) if prev else 0

        data = {
            "ticker": key,
            "price": _fmt(price),
            "change": _fmt(change),
            "change_percent": f"{_fmt(change_pct)}%",
            "volume": str(int(fi.three_month_average_volume or 0)),
            "high": _fmt(fi.day_high),
            "low": _fmt(fi.day_low),
            "prev_close": _fmt(prev),
        }
        _quote_cache[key] = {"data": data, "ts": time.time()}
        return data
    except Exception:
        return {"ticker": key, "error": "Ticker not found or data unavailable"}


async def get_company_overview(ticker: str) -> dict | None:
    key = ticker.upper()
    cached = _overview_cache.get(key)
    if cached and time.time() - cached["ts"] < CACHE_TTL:
        return cached["data"]

    try:
        info = yf.Ticker(key).info
        if not info or info.get("quoteType") is None:
            return None

        data = {
            "name": info.get("longName") or info.get("shortName"),
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "description": info.get("longBusinessSummary"),
            "market_cap": _fmt_large(info.get("marketCap")),
            "pe_ratio": _fmt(info.get("trailingPE")),
            "eps": _fmt(info.get("trailingEps")),
            "revenue": _fmt_large(info.get("totalRevenue")),
            "profit_margin": _fmt(info.get("profitMargins")),
            "week_52_high": _fmt(info.get("fiftyTwoWeekHigh")),
            "week_52_low": _fmt(info.get("fiftyTwoWeekLow")),
            "analyst_target": _fmt(info.get("targetMeanPrice")),
            "beta": _fmt(info.get("beta")),
            "dividend_yield": _fmt(info.get("dividendYield")),
            "exchange": info.get("exchange"),
        }
        _overview_cache[key] = {"data": data, "ts": time.time()}
        return data
    except Exception:
        return None
