from fastapi import APIRouter, Query, Request, Depends
from sqlalchemy.orm import Session
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from app.services.reddit_service import search_reddit
from app.services.news_service import search_news
from app.services.sentiment_service import analyze_texts
from app.services.summary_service import generate_summary
from app.utils.keywords import extract_keywords
from app.database.database import get_db, SearchLog
from app.limiter import limiter

router = APIRouter()
analyzer = SentimentIntensityAnalyzer()


def score_item(text: str) -> float:
    return round(analyzer.polarity_scores(text or "")["compound"], 3)


@router.get("/search")
@limiter.limit("30/minute")
async def search(
    request: Request,
    q: str = Query(..., min_length=1, max_length=200),
    db: Session = Depends(get_db),
):
    db.add(SearchLog(query=q.lower().strip()))
    db.commit()

    reddit_posts = search_reddit(q)
    news_articles = search_news(q)

    for post in reddit_posts:
        post["sentiment_score"] = score_item(post.get("title", ""))
    for article in news_articles:
        article["sentiment_score"] = score_item(
            article.get("title", "") + " " + (article.get("description") or "")
        )

    all_texts = [p["title"] for p in reddit_posts] + [a["title"] for a in news_articles]
    sentiment = analyze_texts(all_texts)
    keywords = extract_keywords(all_texts)
    summary = generate_summary(q, sentiment, keywords, news_articles, reddit_posts)

    return {
        "query": q,
        "sentiment": {
            **sentiment,
            "reddit_count": len(reddit_posts),
            "news_count": len(news_articles),
        },
        "keywords": keywords,
        "reddit_posts": sorted(reddit_posts, key=lambda x: x["sentiment_score"], reverse=True),
        "news_articles": sorted(news_articles, key=lambda x: x["sentiment_score"], reverse=True),
        "summary": summary,
    }
