import os
import time
from fastapi import APIRouter
from newsapi import NewsApiClient
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from dotenv import load_dotenv

load_dotenv()

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
CACHE_TTL = 600  # 10 minutes


@router.get("/trending")
async def trending():
    if _cache["data"] and time.time() - _cache["ts"] < CACHE_TTL:
        return _cache["data"]

    client = NewsApiClient(api_key=os.getenv("NEWS_API_KEY"))
    results = []

    for cat in CATEGORIES:
        try:
            resp = client.get_top_headlines(category=cat, language="en", page_size=6, country="us")
            articles = resp.get("articles", [])
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
        except Exception:
            continue

    result = {"trending": results}
    _cache["data"] = result
    _cache["ts"] = time.time()
    return result
