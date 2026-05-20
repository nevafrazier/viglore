import os
import time
import logging
import httpx
from fastapi import APIRouter
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

logger = logging.getLogger(__name__)
router = APIRouter()
analyzer = SentimentIntensityAnalyzer()

CATEGORIES = ["technology", "business", "science", "health"]
CATEGORY_LABELS = {
    "technology": "Tech",
    "business": "Business",
    "science": "Science",
    "health": "Health",
}

_cache = {"data": None, "ts": 0}
CACHE_TTL = 600


@router.get("/trending")
async def trending():
    if _cache["data"] and time.time() - _cache["ts"] < CACHE_TTL:
        return _cache["data"]

    api_key = os.getenv("NEWS_API_KEY")
    results = []

    async with httpx.AsyncClient(timeout=10) as client:
        for cat in CATEGORIES:
            try:
                resp = await client.get(
                    "https://newsapi.org/v2/top-headlines",
                    params={
                        "category": cat,
                        "language": "en",
                        "pageSize": 6,
                        "country": "us",
                        "apiKey": api_key,
                    },
                )
                data = resp.json()
                articles = data.get("articles", [])
                for a in articles:
                    title = (a.get("title") or "").strip()
                    if not title or "[Removed]" in title:
                        continue
                    score = round(analyzer.polarity_scores(title)["compound"], 3)
                    results.append({
                        "title": title,
                        "description": (a.get("description") or "").strip(),
                        "url": a.get("url", ""),
                        "source": a.get("source", {}).get("name", ""),
                        "category": cat,
                        "category_label": CATEGORY_LABELS[cat],
                        "sentiment": score,
                        "published_at": a.get("publishedAt", ""),
                    })
            except Exception as e:
                logger.warning("Failed to fetch trending topics for category '%s': %s", cat, e)
                continue

    result = {"trending": results}
    _cache["data"] = result
    _cache["ts"] = time.time()
    return result
