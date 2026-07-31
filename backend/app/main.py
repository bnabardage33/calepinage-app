import os

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models  # noqa: F401 — enregistre tous les modèles auprès de SQLAlchemy
from app.routers import chantier

app = FastAPI(title="Calepinage Bardage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "https://calepinage-app-1.onrender.com",  # frontend en prod
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Créé les tables si elles n'existent pas encore.
# En prod, remplacer par des migrations Alembic.
Base.metadata.create_all(bind=engine)

app.include_router(chantier.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/debug-db")
def debug_db(key: str = Query(...)):
    """
    Route de diagnostic — protégée par DEBUG_KEY.
    Révèle quel moteur de base de données est réellement utilisé par le
    backend en ce moment (sqlite ou postgresql), et si DATABASE_URL est vue.
    Accès : /api/debug-db?key=<DEBUG_KEY>
    """
    debug_key = os.environ.get("DEBUG_KEY")
    if not debug_key or key != debug_key:
        raise HTTPException(status_code=404, detail="Not Found")

    database_url_env = os.environ.get("DATABASE_URL")

    return {
        "dialect_utilise": engine.dialect.name,
        "database_url_env_presente": database_url_env is not None,
        "database_url_env_debut": (
            database_url_env[:30] + "..." if database_url_env else None
        ),
        "engine_url_host": str(engine.url.host),
        "engine_url_database": str(engine.url.database),
    }
