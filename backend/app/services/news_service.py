import os
from newsapi import NewsApiClient
from dotenv import load_dotenv

load_dotenv()

SOURCE_QUALITY = {
    "reuters": 5, "bloomberg": 5, "financial times": 5, "wall street journal": 5,
    "cnbc": 4, "techcrunch": 4, "the verge": 4, "ars technica": 4, "wired": 4,
    "fortune": 4, "yahoo finance": 4, "marketwatch": 4,
    "ign": 4, "polygon": 4, "gamesindustry.biz": 5, "eurogamer": 4,
    "business insider": 3, "forbes": 3, "cnet": 3, "engadget": 3, "kotaku": 3,
    "android central": 3, "9to5mac": 3, "venturebeat": 3,
}

def source_quality_score(source_name: str) -> int:
    name = (source_name or "").lower()
    for key, score in SOURCE_QUALITY.items():
        if key in name:
            return score
    return 2

def title_contains_query(title: str, query: str) -> bool:
    """Article title MUST contain the query or a significant query word."""
    title_l = title.lower()
    q_l = query.lower()
    if q_l in title_l:
        return True
    # For multi-word queries, require at least one significant word in title
    words = [w for w in q_l.split() if len(w) > 3]
    return any(w in title_l for w in words)

def relevance_score(title: str, desc: str, source: str, query: str) -> float:
    t = title.lower()
    d = (desc or "").lower()
    q = query.lower()
    words = [w for w in q.split() if len(w) > 2]

    score = 0.0
    if q in t: score += 8
    if q in d: score += 3
    for w in words:
        if w in t: score += 2
        if w in d: score += 1
    score += t.count(q) * 3
    score += source_quality_score(source)
    return score


def search_news(query: str, limit: int = 12) -> list[dict]:
    client = NewsApiClient(api_key=os.getenv("NEWS_API_KEY"))

    def fetch(q_param):
        try:
            resp = client.get_everything(q=q_param, language="en", sort_by="relevancy", page_size=25)
            return resp.get("articles", [])
        except Exception:
            return []

    articles = fetch(f'"{query}"')
    if len(articles) < 4:
        articles = fetch(query)

    seen_titles = set()
    results = []

    for a in articles:
        title = (a.get("title") or "").strip()
        desc  = (a.get("description") or "").strip()
        source_name = a.get("source", {}).get("name", "")

        if not title or not desc:
            continue
        if title in seen_titles:
            continue
        if "[Removed]" in title:
            continue

        # HARD REQUIREMENT: query must appear in the title
        if not title_contains_query(title, query):
            continue

        seen_titles.add(title)

        score = relevance_score(title, desc, source_name, query)

        results.append({
            "title": title,
            "description": desc,
            "url": a["url"],
            "source": source_name,
            "source_quality": source_quality_score(source_name),
            "published_at": a["publishedAt"],
            "relevance_score": round(score, 1),
        })

    results.sort(key=lambda x: x["relevance_score"], reverse=True)
    return results[:limit]
