from sqlalchemy import (
    Column, Integer, String, Float, ForeignKey, CheckConstraint
)
from sqlalchemy.orm import relationship
from app.database import Base


class Fournisseur(Base):
    __tablename__ = "fournisseur"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String, nullable=False)
    contact = Column(String)
    telephone = Column(String)
    email = Column(String)

    materiaux = relationship("Materiau", back_populates="fournisseur")


class Materiau(Base):
    __tablename__ = "materiau"

    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String, nullable=False)
    fournisseur_id = Column(Integer, ForeignKey("fournisseur.id"))
    reference = Column(String, nullable=False)
    longueur_standard = Column(Float)
    largeur_standard = Column(Float)
    epaisseur_standard = Column(Float)
    prix_unitaire = Column(Float)
    disponibilite = Column(String, default="disponible")

    __table_args__ = (
        CheckConstraint(
            "type IN ('panneau_composite','bardage_metallique','rail','lisse','equerre','visserie')",
            name="ck_materiau_type",
        ),
        CheckConstraint(
            "disponibilite IN ('disponible','rupture','sur_commande')",
            name="ck_materiau_disponibilite",
        ),
    )

    fournisseur = relationship("Fournisseur", back_populates="materiaux")
    stock = relationship("StockMateriau", back_populates="materiau", uselist=False, cascade="all, delete-orphan")


class PanneauPose(Base):
    __tablename__ = "panneau_pose"

    id = Column(Integer, primary_key=True, autoincrement=True)
    facade_id = Column(Integer, ForeignKey("facade.id"), nullable=False)
    materiau_id = Column(Integer, ForeignKey("materiau.id"), nullable=False)
    numero_panneau = Column(Integer, nullable=False)
    position_x = Column(Float, nullable=False)
    position_y = Column(Float, nullable=False)
    largeur = Column(Float, nullable=False)
    hauteur = Column(Float, nullable=False)
    decoupe = Column(Integer, default=0)
    chute_largeur = Column(Float)
    chute_hauteur = Column(Float)

    facade = relationship("Facade", back_populates="panneaux")
    materiau = relationship("Materiau")


class Metre(Base):
    __tablename__ = "metre"

    id = Column(Integer, primary_key=True, autoincrement=True)
    facade_id = Column(Integer, ForeignKey("facade.id"))
    pan_id = Column(Integer, ForeignKey("pan.id"))
    surface_totale = Column(Float, nullable=False)
    quantite_panneaux = Column(Integer)
    quantite_rails = Column(Integer)
    quantite_lisses = Column(Integer)
    quantite_equerres = Column(Integer)
    quantite_visserie = Column(Integer)
    marge_chute_pourcentage = Column(Float, default=0)
    source = Column(String, nullable=False, default="recalcule")

    __table_args__ = (
        CheckConstraint(
            "(facade_id IS NOT NULL AND pan_id IS NULL) OR (facade_id IS NULL AND pan_id IS NOT NULL)",
            name="ck_metre_polymorphe",
        ),
        CheckConstraint("source IN ('manuel','recalcule')", name="ck_metre_source"),
    )

    facade = relationship("Facade", back_populates="metres")
    pan = relationship("Pan", back_populates="metres")
