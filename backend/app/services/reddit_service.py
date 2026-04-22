import httpx

HEADERS = {"User-Agent": "TechSentinel AI v1.0"}


def search_reddit(query: str, limit: int = 15) -> list[dict]:
    """Search all of Reddit so any topic returns relevant results."""
    results = []
    try:
        url = "https://www.reddit.com/search.json"
        params = {"q": query, "limit": limit, "sort": "relevance", "type": "link"}
        resp = httpx.get(url, headers=HEADERS, params=params, timeout=10)
        posts = resp.json().get("data", {}).get("children", [])
        for p in posts:
            d = p["data"]
            results.append({
                "title": d.get("title", ""),
                "score": d.get("score", 0),
                "url": f"https://reddit.com{d.get('permalink', '')}",
                "comments": d.get("num_comments", 0),
                "subreddit": d.get("subreddit", ""),
                "created_utc": d.get("created_utc", 0),
            })
    except Exception:
        pass
    return results
