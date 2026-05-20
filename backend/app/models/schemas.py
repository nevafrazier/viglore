from pydantic import BaseModel
from typing import Optional


class SearchResponse(BaseModel):
    query: str
    sentiment: dict
    keywords: list[dict]
    news_articles: list[dict]
    summary: str


class StockResponse(BaseModel):
    ticker: str
    price: Optional[str] = None
    change: Optional[str] = None
    change_percent: Optional[str] = None
    volume: Optional[str] = None
    error: Optional[str] = None
