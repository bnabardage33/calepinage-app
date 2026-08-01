import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app import models
from app.routers import chantier

app = FastAPI(
    title="Calepinage Bardage API",
    description="API pour la gestion de chantiers, bardage et métré",
    version="1.0.0"
)

# CORS — autorise le frontend Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://calepinage-frontend.onrender.com",
        os.environ.get("FRONTEND_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Création automatique des tables (en dev uniquement)
# En prod, utiliser Alembic pour les migrations
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(chantier.router)

@app.get("/")
def root():
    return {
        "message": "Bienvenue sur l'API Calepinage Bardage 🏗️",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "database": engine.dialect.name}

@app.get("/api/debug-db")
def debug_db(key: str = Query(...)):
    debug_key = os.environ.get("DEBUG_KEY")
    if not debug_key or key != debug_key:
        raise HTTPException(status_code=404, detail="Not Found")
    return {
        "dialect": engine.dialect.name,
        "database_url_presente": bool(os.environ.get("DATABASE_URL")),
    }
