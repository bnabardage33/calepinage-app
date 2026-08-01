from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.schemas.chantier import (
    ClientCreate, ClientOut, ChantierCreate, ChantierOut, FacadeCreate, FacadeOut
)
from app.schemas.metre import MetreCalculRequest, MetreCalculOut
from app.services.calcul_metre import calcul_metre_facade, REGLES_BARDAGE
from app.services.meteo import router as meteo_router

router = APIRouter(prefix="/api", tags=["chantier"])
router.include_router(meteo_router)


# ---- Client ----

@router.post("/clients", response_model=ClientOut)
def create_client(payload: ClientCreate, db: Session = Depends(get_db)):
    client = models.Client(**payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.get("/clients", response_model=list[ClientOut])
def list_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()


@router.get("/clients/{client_id}", response_model=ClientOut)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.get(models.Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client introuvable")
    return client


# ---- Chantier ----

@router.post("/chantiers", response_model=ChantierOut)
def create_chantier(payload: ChantierCreate, db: Session = Depends(get_db)):
    if not db.get(models.Client, payload.client_id):
        raise HTTPException(status_code=404, detail="Client introuvable")
    chantier = models.Chantier(**payload.model_dump())
    db.add(chantier)
    db.commit()
    db.refresh(chantier)
    return chantier


@router.get("/chantiers", response_model=list[ChantierOut])
def list_chantiers(db: Session = Depends(get_db)):
    return db.query(models.Chantier).all()


@router.get("/chantiers/{chantier_id}", response_model=ChantierOut)
def get_chantier(chantier_id: int, db: Session = Depends(get_db)):
    chantier = db.get(models.Chantier, chantier_id)
    if not chantier:
        raise HTTPException(status_code=404, detail="Chantier introuvable")
    return chantier


# ---- Façade ----

@router.post("/facades", response_model=FacadeOut)
def create_facade(payload: FacadeCreate, db: Session = Depends(get_db)):
    if not db.get(models.Chantier, payload.chantier_id):
        raise HTTPException(status_code=404, detail="Chantier introuvable")
    facade = models.Facade(**payload.model_dump())
    db.add(facade)
    db.commit()
    db.refresh(facade)
    return facade


@router.get("/chantiers/{chantier_id}/facades", response_model=list[FacadeOut])
def list_facades(chantier_id: int, db: Session = Depends(get_db)):
    return db.query(models.Facade).filter(models.Facade.chantier_id == chantier_id).all()


# ---- Calcul métré ----

@router.post("/facades/{facade_id}/metre", response_model=MetreCalculOut)
def calculer_metre(
    facade_id: int, payload: MetreCalculRequest, db: Session = Depends(get_db)
):
    facade = db.get(models.Facade, facade_id)
    if not facade:
        raise HTTPException(status_code=404, detail="Façade introuvable")
    if not facade.type_bardage:
        raise HTTPException(
            status_code=400,
            detail=(
                "type_bardage non renseigné sur cette façade. "
                f"Valeurs possibles : {list(REGLES_BARDAGE)}"
            ),
        )
    try:
        return calcul_metre_facade(
            largeur=facade.largeur,
            hauteur=facade.hauteur,
            type_bardage=facade.type_bardage,
            marge_chute_pourcentage=payload.marge_chute_pourcentage,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
      
        app.include_router(meteo_router)
