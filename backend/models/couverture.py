from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class TypeCouverture(Base):
    __tablename__ = "type_couverture"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String, nullable=False)
    norme_pente_min = Column(Float)
    norme_pente_max = Column(Float)
    recouvrement_min_recommande = Column(Float)


class PenteCalcul(Base):
    __tablename__ = "pente_calcul"

    id = Column(Integer, primary_key=True, autoincrement=True)
    pan_id = Column(Integer, ForeignKey("pan.id"), nullable=False)
    surface_projetee = Column(Float, nullable=False)
    surface_reelle = Column(Float, nullable=False)
    recouvrement_applique = Column(Float)
    quantite_materiau_ajustee = Column(Float)

    pan = relationship("Pan", back_populates="pentes")
