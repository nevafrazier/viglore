import re
from collections import Counter

STOP_WORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "it", "its", "this", "that", "these", "those",
    "i", "we", "you", "he", "she", "they", "my", "our", "your", "their",
    "not", "no", "so", "as", "if", "then", "than", "about", "up", "out",
    "what", "which", "who", "how", "when", "where", "just", "more", "also",
    "new", "says", "said", "after", "can", "now", "get", "one", "two",
}


def extract_keywords(texts: list[str], top_n: int = 10) -> list[dict]:
    combined = " ".join(texts).lower()
    words = re.findall(r'\b[a-z]{3,}\b', combined)
    filtered = [w for w in words if w not in STOP_WORDS]
    counts = Counter(filtered).most_common(top_n)
    return [{"word": word, "count": count} for word, count in counts]
