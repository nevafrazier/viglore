from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import search, stocks, cities, trends, describe, city_signal, stocktwits, city_lookup, trending_topics
from app.database.database import init_db

app = FastAPI(title="TechSentinel AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    init_db()

app.include_router(search.router, prefix="/api")
app.include_router(stocks.router, prefix="/api")
app.include_router(cities.router, prefix="/api")
app.include_router(trends.router, prefix="/api")
app.include_router(describe.router, prefix="/api")
app.include_router(city_signal.router, prefix="/api")
app.include_router(stocktwits.router, prefix="/api")
app.include_router(city_lookup.router, prefix="/api")
app.include_router(trending_topics.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "TechSentinel AI backend is running"}
