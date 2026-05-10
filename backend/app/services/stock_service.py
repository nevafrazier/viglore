import os
import time
import asyncio
import httpx
from dotenv import load_dotenv

load_dotenv()

BASE = "https://finnhub.io/api/v1"
_quote_cache = {}
_overview_cache = {}
CACHE_TTL = 900  # 15 minutes


def _key():
    return os.getenv("FINNHUB_KEY")


def _fmt(val, decimals=2) -> str:
    try:
        return f"{float(val):.{decimals}f}"
    except Exception:
        return "N/A"


def _fmt_large(val) -> str:
    try:
        n = float(val)
        if n >= 1_000_000:
            return f"${n / 1_000:.2f}B"
        if n >= 1_000:
            return f"${n:.2f}M"
        return f"${n:,.0f}"
    except Exception:
        return "N/A"


async def get_stock_quote(ticker: str) -> dict:
    key = ticker.upper()
    cached = _quote_cache.get(key)
    if cached and time.time() - cached["ts"] < CACHE_TTL:
        return cached["data"]

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{BASE}/quote", params={"symbol": key, "token": _key()})
            q = resp.json()

        if not q or q.get("c", 0) == 0:
            return {"ticker": key, "error": "Ticker not found or data unavailable"}

        change = q.get("d", 0)
        change_pct = q.get("dp", 0)

        data = {
            "ticker": key,
            "price": _fmt(q.get("c")),
            "change": _fmt(change),
            "change_percent": f"{_fmt(change_pct)}%",
            "volume": "N/A",
            "high": _fmt(q.get("h")),
            "low": _fmt(q.get("l")),
            "prev_close": _fmt(q.get("pc")),
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
        async with httpx.AsyncClient(timeout=10) as client:
            profile_resp, metric_resp = await asyncio.gather(
                client.get(f"{BASE}/stock/profile2", params={"symbol": key, "token": _key()}),
                client.get(f"{BASE}/stock/metric", params={"symbol": key, "metric": "all", "token": _key()}),
            )
            profile = profile_resp.json()
            metrics = metric_resp.json().get("metric", {})

        if not profile or not profile.get("name"):
            return None

        data = {
            "name": profile.get("name"),
            "sector": profile.get("finnhubIndustry"),
            "industry": profile.get("finnhubIndustry"),
            "description": None,
            "market_cap": _fmt_large(profile.get("marketCapitalization")),
            "pe_ratio": _fmt(metrics.get("peBasicExclExtraTTM")),
            "eps": _fmt(metrics.get("epsBasicExclExtraAnnual")),
            "revenue": _fmt_large(metrics.get("revenuePerShareAnnual")),
            "profit_margin": _fmt(metrics.get("netProfitMarginAnnual")),
            "week_52_high": _fmt(metrics.get("52WeekHigh")),
            "week_52_low": _fmt(metrics.get("52WeekLow")),
            "analyst_target": _fmt(metrics.get("targetPrice")),
            "beta": _fmt(metrics.get("beta")),
            "dividend_yield": _fmt(metrics.get("dividendYieldIndicatedAnnual")),
            "exchange": profile.get("exchange"),
        }
        _overview_cache[key] = {"data": data, "ts": time.time()}
        return data
    except Exception:
        return None
