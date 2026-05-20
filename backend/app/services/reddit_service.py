import logging
import httpx

logger = logging.getLogger(__name__)
HEADERS = {"User-Agent": "Viglore/1.0"}


def search_reddit(query: str, limit: int = 15) -> list[dict]:
    """Search Hacker News for relevant discussions."""
    results = []
    try:
        resp = httpx.get(
            "https://hn.algolia.com/api/v1/search",
            headers=HEADERS,
            params={"query": query, "tags": "story", "hitsPerPage": limit},
            timeout=10,
        )
        for h in resp.json().get("hits", []):
            title = h.get("title", "")
            if not title:
                continue
            results.append({
                "title": title,
                "score": h.get("points", 0),
                "url": h.get("url") or f"https://news.ycombinator.com/item?id={h.get('objectID')}",
                "comments": h.get("num_comments", 0),
                "subreddit": "Hacker News",
                "created_utc": h.get("created_at_i", 0),
            })
    except Exception as e:
        logger.warning("Hacker News fetch failed for '%s': %s", query, e)
    return results
