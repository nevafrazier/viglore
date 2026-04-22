from fastapi import APIRouter
from app.services.stock_service import get_stock_quote, get_company_overview

router = APIRouter()


@router.get("/stocks")
async def stocks(ticker: str):
    return await get_stock_quote(ticker)


@router.get("/company")
async def company(ticker: str):
    overview = await get_company_overview(ticker)
    if not overview:
        return {"error": "Company data unavailable or API limit reached"}
    return overview
