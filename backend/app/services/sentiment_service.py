from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()


def analyze_texts(texts: list[str]) -> dict:
    if not texts:
        return {"positive": 0, "neutral": 0, "negative": 0, "compound": 0, "total_analyzed": 0}

    scores = [analyzer.polarity_scores(t) for t in texts]
    pos = sum(1 for s in scores if s["compound"] >= 0.05)
    neg = sum(1 for s in scores if s["compound"] <= -0.05)
    neu = len(scores) - pos - neg
    avg_compound = sum(s["compound"] for s in scores) / len(scores)
    total = len(scores)

    return {
        "positive": round(pos / total * 100, 1),
        "neutral": round(neu / total * 100, 1),
        "negative": round(neg / total * 100, 1),
        "compound": round(avg_compound, 3),
        "total_analyzed": total,
    }
