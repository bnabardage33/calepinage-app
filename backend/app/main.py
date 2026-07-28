from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models  # noqa: F401 — enregistre tous les modèles auprès de SQLAlchemy
from app.routers import chantier

app = FastAPI(title="Calepinage Bardage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
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
