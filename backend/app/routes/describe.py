from fastapi import APIRouter, Query, Request
from app.limiter import limiter
from app.services.wikipedia_service import fetch_topic, fetch_suggestions

router = APIRouter()


@router.get("/suggest")
@limiter.limit("60/minute")
async def suggest(request: Request, q: str = Query(..., min_length=1, max_length=200)):
    options = await fetch_suggestions(q)
    return {"query": q, "options": options}


@router.get("/describe")
@limiter.limit("30/minute")
async def describe(
    request: Request,
    q: str = Query(..., min_length=1, max_length=200),
    title: str = Query(None, max_length=200),
):
    return await fetch_topic(q, title)
