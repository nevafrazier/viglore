import httpx
from fastapi import APIRouter

router = APIRouter()

INDUSTRY_KEYWORDS = {
    "Technology": ["technology", "software", "tech hub", "silicon"],
    "Healthcare": ["medical", "hospital", "healthcare", "biotech", "pharmaceutical"],
    "Finance": ["financial", "banking", "finance", "insurance", "investment"],
    "Defense": ["military", "defense", "air force", "army", "naval", "fort"],
    "Manufacturing": ["manufacturing", "factory", "automotive", "industrial"],
    "Education": ["university", "college", "research university", "academic"],
    "Energy": ["energy", "oil", "natural gas", "petroleum", "renewable"],
    "Logistics": ["logistics", "shipping", "port", "distribution", "supply chain"],
    "Agriculture": ["agriculture", "farming", "agribusiness", "crop"],
    "Government": ["government", "federal", "capitol", "state capital"],
}

def detect_industries(text: str) -> list[str]:
    text_lower = text.lower()
    found = []
    for industry, keywords in INDUSTRY_KEYWORDS.items():
        if any(k in text_lower for k in keywords):
            found.append(industry)
    return found[:5] if found else ["General Services"]


async def fetch_wikipedia(city: str) -> tuple[str, str]:
    name = city.strip().title()
    candidates = [
        name.replace(" ", "_"),
        f"{name.replace(' ', '_')},_United_States",
        f"{name.replace(' ', '_')}_(city)",
        f"{name.replace(' ', '_')}_(city,_United_States)",
    ]
    async with httpx.AsyncClient(timeout=8) as client:
        for title in candidates:
            try:
                resp = await client.get(
                    f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}",
                    headers={"User-Agent": "Viglore/1.0 (contact@viglore.com)"},
                )
                if resp.status_code == 200:
                    data = resp.json()
                    page_type = data.get("type", "")
                    extract = data.get("extract", "")
                    # Skip disambiguation and articles not about a place
                    if page_type == "disambiguation" or not extract:
                        continue
                    # Make sure this is actually about a city/place
                    if any(w in extract.lower() for w in ["city", "town", "municipality", "county seat", "capital"]):
                        return extract, data.get("title", name)
            except Exception:
                continue
    return "", name


@router.get("/city-lookup")
async def city_lookup(city: str):
    from .cities import CITY_DATA

    city_lower = city.lower().strip()

    # Check our ranked database first
    for c in CITY_DATA:
        name_lower = c["name"].lower()
        short_name = name_lower.split(",")[0].strip()
        if city_lower == short_name or city_lower == name_lower:
            return {**c, "is_estimated": False}

    # Fall back to Wikipedia
    summary, title = await fetch_wikipedia(city)

    if not summary:
        return {"error": f"Could not find information for '{city}'. Try including the state (e.g. 'Tucson, AZ')."}

    industries = detect_industries(summary)
    truncated = summary[:700] + ("..." if len(summary) > 700 else "")

    return {
        "name": title,
        "is_estimated": True,
        "growth_label": "Emerging",
        "summary": truncated,
        "tech_score": None,
        "total_tech_jobs": None,
        "ai_jobs": None,
        "finance_tech_jobs": None,
        "avg_salary": None,
        "startup_activity": None,
        "top_industries": industries,
        "colleges": [],
        "major_companies": [],
        "cost_of_living": None,
        "weather": None,
    }
