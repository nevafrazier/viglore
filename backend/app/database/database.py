from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from datetime import datetime, UTC

DATABASE_URL = "sqlite:///./techsentinel.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


class SearchCache(Base):
    __tablename__ = "search_cache"
    id = Column(Integer, primary_key=True)
    query = Column(String, index=True)
    result_json = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))


class SearchLog(Base):
    __tablename__ = "search_logs"
    id = Column(Integer, primary_key=True)
    query = Column(String(200), nullable=False, index=True)
    searched_at = Column(DateTime, default=lambda: datetime.now(UTC))


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
