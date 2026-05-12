import re
import httpx
from fastapi import APIRouter

router = APIRouter()

TICKER_MAP = {
    "nvidia": "NVDA", "microsoft": "MSFT", "apple": "AAPL",
    "google": "GOOGL", "alphabet": "GOOGL", "meta": "META",
    "amazon": "AMZN", "tesla": "TSLA", "netflix": "NFLX",
    "amd": "AMD", "intel": "INTC", "qualcomm": "QCOM",
    "disney": "DIS", "sony": "SONY", "nintendo": "NTDOY",
    "electronic arts": "EA", "take-two": "TTWO", "roblox": "RBLX",
    "minecraft": "MSFT", "activision": "ATVI", "blizzard": "ATVI",
    "spotify": "SPOT", "uber": "UBER", "airbnb": "ABNB",
    "palantir": "PLTR", "salesforce": "CRM", "oracle": "ORCL",
    "ibm": "IBM", "cisco": "CSCO", "dell": "DELL",
    "snapchat": "SNAP", "snap": "SNAP", "coinbase": "COIN",
    "robinhood": "HOOD", "paypal": "PYPL", "visa": "V",
}

def detect_type(description: str) -> str:
    desc = (description or "").lower()
    if any(w in desc for w in ["video game", "sandbox game", "role-playing game", "first-person shooter", "massively multiplayer", "action game", "strategy game", "puzzle game"]):
        return "game"
    if any(w in desc for w in ["film", "animated film", "documentary film", "motion picture"]):
        return "movie"
    if any(w in desc for w in ["television series", "tv series", "streaming series", "animated series", "sitcom"]):
        return "show"
    if any(w in desc for w in ["company", "corporation", "multinational", "technology company", "software company", "holding company"]):
        return "company"
    if any(w in desc for w in ["musician", "rapper", "singer", "band", "recording artist"]):
        return "music"
    if any(w in desc for w in ["politician", "president", "senator", "ceo", "entrepreneur", "businessman", "actor", "actress", "director"]):
        return "person"
    return "general"


def extract_awards(full_text: str) -> list[dict]:
    awards = []

    # Major award patterns — check if won or nominated
    MAJOR_AWARDS = [
        "Academy Award", "Oscar", "BAFTA", "Grammy", "Golden Globe",
        "Emmy", "Tony Award", "Game of the Year", "GOTY",
        "Peabody Award", "Screen Actors Guild", "Spike Video Game Award",
        "D.I.C.E. Award", "Game Developers Choice", "Webby Award",
        "MTV Movie", "Kids' Choice Award", "Teen Choice Award",
        "Billboard Music Award", "American Music Award",
    ]

    for award in MAJOR_AWARDS:
        pattern = rf'(won|win|wins|received|awarded|took home|earned)[\w\s,]{{0,40}}{award}'
        nom_pattern = rf'nominated[\w\s,]{{0,30}}{award}'
        if re.search(pattern, full_text, re.I):
            awards.append({"status": "Won", "name": award})
        elif re.search(nom_pattern, full_text, re.I):
            awards.append({"status": "Nominated", "name": award})
        elif re.search(award, full_text, re.I):
            awards.append({"status": "Mentioned", "name": award})

    return awards[:10]


def extract_achievements(full_text: str) -> list[str]:
    achievements = []
    seen = set()

    DANGLING = {'to', 'the', 'a', 'an', 'of', 'in', 'by', 'at', 'for', 'on', 'and', 'or', 'with', 'as', 'into'}

    patterns = [
        r'(best-selling [\w\s]{3,40}(?:of all time)?)',
        r'(highest-grossing [\w\s]{3,40})',
        r'(most (?:watched|played|downloaded|streamed|successful) [\w\s]{3,35})',
        r'([\d,.]+\s*(?:million|billion) copies (?:sold|shipped))',
        r'([\d,.]+\s*(?:million|billion) (?:monthly active )?(?:players|users|registered accounts))',
        r'(Guinness World Record[s]? for [^.\n]{5,60})',
        r'(first [\w\s]{3,30} to [\w\s\-]{5,50})',
        r'(first [\w\s]{5,50} in history[\w\s,]{0,40})',
        r'(\$[\d,.]+\s*(?:million|billion) (?:in )?(?:revenue|box office|worldwide gross))',
        r'(number[- ]one [\w\s]{5,40})',
        r'([\d]+ (?:platinum|gold) (?:certif\w+|record))',
        r'(inducted into the [\w\s]{5,40})',
        r'(over [\d,.]+\s*(?:million|billion) (?:copies|units|downloads|sales))',
    ]

    for pattern in patterns:
        for m in re.finditer(pattern, full_text, re.I):
            text = m.group(1).strip().rstrip('.,;').capitalize()
            key = text.lower()[:40]
            last_word = text.split()[-1].lower().rstrip('.,;') if text.split() else ''
            if len(text) > 15 and key not in seen and last_word not in DANGLING:
                seen.add(key)
                achievements.append(text)

    return achievements[:6]


def extract_structured_data(full_text: str, summary: str, content_type: str) -> dict:
    result = {
        "year_created": None, "year_died": None,
        "net_worth": None, "copies_sold": None,
        "players": None, "box_office": None,
        "developer": None, "genre": None, "platforms": None,
    }

    born = re.search(r'born\s+\w+\s+\d+,?\s+(\d{4})', full_text, re.I)
    founded = re.search(r'founded\s+(?:in\s+)?(\d{4})', full_text, re.I)
    released = re.search(r'(?:released|launched|published|premiered)\s+(?:on\s+)?(?:\w+\s+\d+,?\s+)?(\d{4})', full_text, re.I)

    if born:       result["year_created"] = born.group(1)
    elif founded:  result["year_created"] = founded.group(1)
    elif released: result["year_created"] = released.group(1)
    else:
        m = re.search(r'\b((?:19|20)\d{2})\b', summary or full_text)
        if m: result["year_created"] = m.group(1)

    died = re.search(r'died\s+\w+\s+\d+,?\s+(\d{4})', full_text, re.I)
    if died: result["year_died"] = died.group(1)

    worth = re.search(r'net worth\s+(?:of\s+)?(\$[\d,.]+\s*(?:million|billion|trillion)?)', full_text, re.I)
    if worth: result["net_worth"] = worth.group(1).strip()

    copies = re.search(r'([\d,.]+\s*(?:million|billion)\s*copies)', full_text, re.I)
    if copies: result["copies_sold"] = copies.group(1).strip()

    players = re.search(r'([\d,.]+\s*(?:million|billion)\s*(?:monthly active\s*)?(?:players|users|registered))', full_text, re.I)
    if players: result["players"] = players.group(1).strip()

    box = re.search(r'(?:grossed?|box office of?|worldwide gross)\s+(\$[\d,.]+\s*(?:million|billion)?)', full_text, re.I)
    if box: result["box_office"] = box.group(1).strip()

    dev = re.search(r'developed by ([A-Z][^,.\n]{2,35})', full_text)
    if dev: result["developer"] = dev.group(1).strip()
    elif content_type == "movie":
        dir_match = re.search(r'directed by ([A-Z][^,.\n]{2,35})', full_text)
        if dir_match: result["developer"] = dir_match.group(1).strip()

    if content_type == "game":
        gm = re.search(r'(?:is an?|as a)\s+([\w\s\-]{3,30})\s+(?:video )?game', full_text, re.I)
        if gm: result["genre"] = gm.group(1).strip().title()
        found_platforms = [p for p in ["PC", "PlayStation", "Xbox", "Nintendo Switch", "iOS", "Android", "macOS"] if p.lower() in full_text.lower()]
        if found_platforms: result["platforms"] = ", ".join(found_platforms[:4])

    return result


@router.get("/suggest")
async def suggest(q: str):
    headers = {"User-Agent": "TechSentinelAI/1.0 (educational project) httpx/0.27"}
    async with httpx.AsyncClient(headers=headers) as client:
        try:
            resp = await client.get(
                "https://en.wikipedia.org/w/api.php",
                params={
                    "action": "opensearch", "search": q,
                    "limit": "7", "format": "json", "redirects": "resolve",
                },
                timeout=6,
            )
            if resp.status_code == 200:
                data = resp.json()
                titles = data[1] if len(data) > 1 else []
                descs  = data[2] if len(data) > 2 else []
                options = [
                    {"title": t, "description": d}
                    for t, d in zip(titles, descs)
                    if t  # skip empty titles
                ]
                return {"query": q, "options": options}
        except Exception:
            pass
    return {"query": q, "options": []}


@router.get("/describe")
async def describe(q: str, title: str = None):
    # `title` lets the frontend request a specific Wikipedia page after disambiguation
    search_term = (title or q).replace(" ", "_")
    ticker = TICKER_MAP.get(q.lower())

    headers = {"User-Agent": "TechSentinelAI/1.0 (https://github.com/techsentinel; contact@techsentinel.ai) httpx/0.27"}
    async with httpx.AsyncClient(headers=headers) as client:
        try:
            # Fetch short summary for title/description/thumbnail
            summary_resp = await client.get(
                f"https://en.wikipedia.org/api/rest_v1/page/summary/{search_term}",
                timeout=8, follow_redirects=True,
            )
            # Fetch FULL article text for awards/achievements
            full_resp = await client.get(
                "https://en.wikipedia.org/w/api.php",
                params={
                    "action": "query", "prop": "extracts",
                    "titles": search_term, "format": "json",
                    "explaintext": "true", "redirects": "1",
                },
                timeout=10,
            )

            if summary_resp.status_code == 200:
                summary_data = summary_resp.json()
                description = summary_data.get("description", "")
                extract = summary_data.get("extract", "")
                content_type = detect_type(description)

                # Get full text
                full_text = extract
                if full_resp.status_code == 200:
                    pages = full_resp.json().get("query", {}).get("pages", {})
                    page = next(iter(pages.values()), {})
                    full_text = page.get("extract", extract)

                structured = extract_structured_data(full_text, extract, content_type)
                awards = extract_awards(full_text)
                achievements = extract_achievements(full_text)

                return {
                    "found": True,
                    "title": summary_data.get("title"),
                    "description": description,
                    "extract": extract,
                    "thumbnail": summary_data.get("thumbnail", {}).get("source") if summary_data.get("thumbnail") else None,
                    "content_type": content_type,
                    "stock_ticker": ticker,
                    "awards": awards,
                    "achievements": achievements,
                    **structured,
                }
        except Exception:
            pass

    return {
        "found": False, "title": q, "description": None, "extract": None,
        "thumbnail": None, "content_type": "general", "stock_ticker": ticker,
        "awards": [], "achievements": [],
        "year_created": None, "year_died": None, "net_worth": None,
        "copies_sold": None, "players": None, "box_office": None,
        "developer": None, "genre": None, "platforms": None,
    }
