import httpx

HEADERS = {"User-Agent": "SignalScope/1.0"}


def get_stocktwits(ticker: str, limit: int = 15) -> list[dict]:
    results = []
    try:
        resp = httpx.get(
            f"https://api.stocktwits.com/api/2/streams/symbol/{ticker}.json",
            headers=HEADERS,
            timeout=10,
        )
        messages = resp.json().get("messages", [])
        for m in messages[:limit]:
            sentiment = None
            if m.get("entities", {}).get("sentiment"):
                sentiment = m["entities"]["sentiment"].get("basic")
            results.append({
                "body": m.get("body", ""),
                "username": m.get("user", {}).get("username", ""),
                "followers": m.get("user", {}).get("followers", 0),
                "created_at": m.get("created_at", ""),
                "url": f"https://stocktwits.com/{m.get('user', {}).get('username', '')}",
                "sentiment": sentiment,
            })
    except Exception:
        pass
    return results
