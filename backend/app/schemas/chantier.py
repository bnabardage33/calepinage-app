from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ClientBase(BaseModel):
    nom: str
    societe: Optional[str] = None
    telephone: Optional[str] = None
    email: Optional[str] = None
    adresse: Optional[str] = None


class ClientCreate(ClientBase):
    pass


class ClientOut(ClientBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    date_creation: datetime


class ChantierBase(BaseModel):
    numero_unique: str
    client_id: int
    adresse_chantier: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    statut: str = "en_cours"
    notes: Optional[str] = None


class ChantierCreate(ChantierBase):
    pass


class ChantierOut(ChantierBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    date_creation: datetime


class FacadeBase(BaseModel):
    chantier_id: int
    nom: str
    type_forme: str = "rectangle"
    largeur: float
    hauteur: float
    hauteur_pointe: Optional[float] = None
    larg_hg: Optional[float] = None
    larg_hd: Optional[float] = None
    orientation: Optional[str] = None
    type_bardage: Optional[str] = None


class FacadeCreate(FacadeBase):
    pass


class FacadeOut(FacadeBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
