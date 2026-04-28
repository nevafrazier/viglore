from fastapi import APIRouter
from app.routes.cities import CITY_DATA

router = APIRouter()

@router.get("/city-signal")
def city_signal(q: str):
    q_lower = q.lower().strip()
    words = [w for w in q_lower.split() if len(w) > 2]
    results = []

    for city in CITY_DATA:
        score = 0
        match_reason = None

        for company in city.get("major_companies", []):
            if q_lower in company.lower() or any(w in company.lower() for w in words):
                score += 10
                match_reason = "Major Employer"
                break

        if not match_reason:
            for industry in city.get("top_industries", []):
                if any(w in industry.lower() for w in words):
                    score += 5
                    match_reason = "Key Industry Hub"
                    break

        if score > 0:
            results.append({
                "name": city["name"],
                "tech_score": city["tech_score"],
                "growth_label": city["growth_label"],
                "avg_salary": city["avg_salary"],
                "match_reason": match_reason,
                "top_industries": city["top_industries"][:2],
            })

    results.sort(key=lambda x: x["tech_score"], reverse=True)
    return {"query": q, "cities": results[:6]}
