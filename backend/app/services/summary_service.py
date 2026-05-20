def generate_summary(query: str, sentiment: dict, keywords: list, articles: list) -> str:
    compound = sentiment["compound"]
    pos = sentiment["positive"]
    neg = sentiment["negative"]
    total = sentiment["total_analyzed"]
    top_keywords = [k["word"] for k in keywords[:5] if k["word"].lower() != query.lower()]
    top_headlines = [a["title"] for a in articles[:3] if a.get("title")]

    if compound >= 0.4:
        tone = "strongly positive"
        momentum = "significant upward momentum in public perception and media coverage"
        outlook = "Current indicators suggest continued favorable attention and growing interest."
    elif compound >= 0.15:
        tone = "moderately positive"
        momentum = "generally favorable sentiment with broad mainstream coverage"
        outlook = "The overall narrative remains constructive with no major headwinds visible in current data."
    elif compound >= 0.05:
        tone = "slightly positive"
        momentum = "cautiously optimistic sentiment with balanced coverage"
        outlook = "Sentiment is leaning positive but remains sensitive to new developments."
    elif compound <= -0.4:
        tone = "strongly negative"
        momentum = "significant negative pressure across news and community discussion"
        outlook = "Current data suggests reputational or market headwinds that warrant close monitoring."
    elif compound <= -0.15:
        tone = "predominantly negative"
        momentum = "notable concern and criticism across analyzed sources"
        outlook = "Discussion trends suggest ongoing scrutiny that may impact perception in the near term."
    elif compound <= -0.05:
        tone = "slightly negative"
        momentum = "mild skepticism or criticism visible in community discussion"
        outlook = "Sentiment is mixed, with critical voices slightly outweighing positive ones."
    else:
        tone = "neutral to mixed"
        momentum = "balanced discussion with no clear directional bias"
        outlook = "The absence of strong sentiment suggests a stable but undramatic current narrative."

    keyword_str = ""
    if top_keywords:
        keyword_str = f" Recurring themes in the conversation include {', '.join(top_keywords[:3])} — indicating these are the dominant sub-narratives driving engagement."

    headline_str = ""
    if top_headlines:
        headline_str = f' Recent coverage includes reports such as "{top_headlines[0]}"'
        if len(top_headlines) > 1:
            headline_str += f' and "{top_headlines[1]}"'
        headline_str += "."

    return (
        f"{query} is currently generating {tone} sentiment across {total} analyzed sources, "
        f"with {pos}% of coverage rated favorable and {neg}% critical — reflecting {momentum}."
        f"{headline_str}"
        f"{keyword_str}"
        f" {outlook}"
    )
