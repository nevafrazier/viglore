import httpx

HEADERS = {
    "User-Agent": "web:signalscope:v1.0 (by /u/nevafrazier)",
    "Accept": "application/json",
}

PUSHSHIFT_HEADERS = {"User-Agent": "SignalScope/1.0"}


def search_reddit(query: str, limit: int = 15) -> list[dict]:
    results = []
    urls = [
        ("https://www.reddit.com/search.json", {"q": query, "limit": limit, "sort": "relevance", "type": "link", "raw_json": 1}),
        (f"https://www.reddit.com/search.json", {"q": query, "limit": limit, "sort": "new", "type": "link", "raw_json": 1}),
    ]
    for url, params in urls:
        try:
            resp = httpx.get(url, headers=HEADERS, params=params, timeout=15, follow_redirects=True)
            if resp.status_code != 200:
                continue
            data = resp.json()
            posts = data.get("data", {}).get("children", [])
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
            if results:
                break
        except Exception:
            continue
    return results
