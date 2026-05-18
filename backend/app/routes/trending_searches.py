from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database.database import get_db, SearchLog

router = APIRouter()


@router.get("/trending-searches")
def trending_searches(db: Session = Depends(get_db)):
    cutoff = datetime.utcnow() - timedelta(days=7)
    results = (
        db.query(SearchLog.query, func.count(SearchLog.id).label("count"))
        .filter(SearchLog.searched_at >= cutoff)
        .group_by(SearchLog.query)
        .order_by(func.count(SearchLog.id).desc())
        .limit(10)
        .all()
    )
    return [{"query": r.query, "count": r.count} for r in results]
