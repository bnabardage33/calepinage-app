from pydantic import BaseModel


class MetreCalculRequest(BaseModel):
    marge_chute_pourcentage: float = 0.0


class VisserieOut(BaseModel):
    vis_necessaires: int
    poches_necessaires: int
    poches_a_commander: int
    vis_totales_commandees: int


class LissesRailsOut(BaseModel):
    ml_necessaires: float
    barres_necessaires: int
    barres_a_commander: int
    ml_totaux_commandes: float


class EquerresOut(BaseModel):
    nombre_chevrons: int
    equerres_par_chevron: int
    total_equerres: int


class MetreCalculOut(BaseModel):
    type_bardage: str
    type_bardage_libelle: str
    surface_totale: float
    surface_avec_marge_chute: float
    marge_chute_pourcentage: float
    visserie: VisserieOut
    lisses: LissesRailsOut
    rails: LissesRailsOut
    equerres: EquerresOut
