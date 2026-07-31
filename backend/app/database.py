import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    # Postgres (Supabase) — utilisé en production
    # SQLAlchemy exige "postgresql://", Supabase donne parfois "postgres://"
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(DATABASE_URL)
else:
    # SQLite — utilisé en dev local si DATABASE_URL n'est pas défini
    DATABASE_PATH = os.environ.get("DATABASE_PATH", "./calepinage.db")
    engine = create_engine(
        f"sqlite:///{DATABASE_PATH}", connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
