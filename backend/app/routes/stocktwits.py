from fastapi import APIRouter
from app.services.stocktwits_service import get_stocktwits

router = APIRouter()

@router.get("/stocktwits")
def stocktwits(ticker: str):
    messages = get_stocktwits(ticker)
    return {"ticker": ticker, "messages": messages}
