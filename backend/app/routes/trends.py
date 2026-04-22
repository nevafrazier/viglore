from fastapi import APIRouter
from app.services.reddit_service import search_reddit
from app.services.sentiment_service import analyze_texts
from app.utils.keywords import extract_keywords

router = APIRouter()


@router.get("/trends")
async def trends(q: str):
    posts = search_reddit(q, limit=20)
    texts = [p["title"] for p in posts]
    sentiment = analyze_texts(texts)
    keywords = extract_keywords(texts)

    return {
        "query": q,
        "sentiment": sentiment,
        "keywords": keywords,
        "discussion_volume": len(posts),
        "top_posts": posts[:5],
    }
