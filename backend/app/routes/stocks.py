from fastapi import APIRouter, Query, Request
from app.services.stock_service import get_stock_quote, get_company_overview
from app.limiter import limiter

router = APIRouter()


@router.get("/stocks")
@limiter.limit("20/minute")
async def stocks(request: Request, ticker: str = Query(..., min_length=1, max_length=10)):
    return await get_stock_quote(ticker)


@router.get("/company")
@limiter.limit("10/minute")
async def company(request: Request, ticker: str = Query(..., min_length=1, max_length=10)):
    overview = await get_company_overview(ticker)
    if not overview:
        return {"error": "Company data unavailable or API limit reached"}
    return overview
