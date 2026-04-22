import os
import httpx
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://www.alphavantage.co/query"


def _key():
    return os.getenv("ALPHA_VANTAGE_KEY")


def _fmt_large(val: str) -> str:
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
        return val or "N/A"


async def get_stock_quote(ticker: str) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(BASE_URL, params={
            "function": "GLOBAL_QUOTE",
            "symbol": ticker.upper(),
            "apikey": _key(),
        })
        data = resp.json().get("Global Quote", {})
        if not data:
            return {"ticker": ticker.upper(), "error": "Ticker not found or API limit reached"}
        return {
            "ticker": data.get("01. symbol"),
            "price": data.get("05. price"),
            "change": data.get("09. change"),
            "change_percent": data.get("10. change percent"),
            "volume": data.get("06. volume"),
            "high": data.get("03. high"),
            "low": data.get("04. low"),
            "prev_close": data.get("08. previous close"),
        }


async def get_company_overview(ticker: str) -> dict | None:
    async with httpx.AsyncClient() as client:
        resp = await client.get(BASE_URL, params={
            "function": "OVERVIEW",
            "symbol": ticker.upper(),
            "apikey": _key(),
        })
        data = resp.json()
        if not data or "Symbol" not in data:
            return None
        return {
            "name": data.get("Name"),
            "sector": data.get("Sector"),
            "industry": data.get("Industry"),
            "description": data.get("Description"),
            "market_cap": _fmt_large(data.get("MarketCapitalization", "")),
            "pe_ratio": data.get("PERatio"),
            "eps": data.get("EPS"),
            "revenue": _fmt_large(data.get("RevenueTTM", "")),
            "profit_margin": data.get("ProfitMargin"),
            "week_52_high": data.get("52WeekHigh"),
            "week_52_low": data.get("52WeekLow"),
            "analyst_target": data.get("AnalystTargetPrice"),
            "beta": data.get("Beta"),
            "dividend_yield": data.get("DividendYield"),
            "exchange": data.get("Exchange"),
        }
