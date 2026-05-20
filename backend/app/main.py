import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.limiter import limiter
from app.routes import search, stocks, cities, trends, describe, city_signal, stocktwits, city_lookup, trending_topics, trending_searches
from app.database.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Viglore API", version="1.0.0", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

_raw_origins = os.getenv("ALLOWED_ORIGINS", "https://viglore.com,https://www.viglore.com")
allowed_origins = [o.strip() for o in _raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(search.router, prefix="/api")
app.include_router(stocks.router, prefix="/api")
app.include_router(cities.router, prefix="/api")
app.include_router(trends.router, prefix="/api")
app.include_router(describe.router, prefix="/api")
app.include_router(city_signal.router, prefix="/api")
app.include_router(stocktwits.router, prefix="/api")
app.include_router(city_lookup.router, prefix="/api")
app.include_router(trending_topics.router, prefix="/api")
app.include_router(trending_searches.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Viglore API is running"}
