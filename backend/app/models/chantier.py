from sqlalchemy import (
    Column, Integer, String, Float, Text, ForeignKey, CheckConstraint, DateTime, func
)
from sqlalchemy.orm import relationship
from app.database import Base


class Client(Base):
    __tablename__ = "client"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String, nullable=False)
    societe = Column(String)
    telephone = Column(String)
    email = Column(String)
    adresse = Column(Text)
    date_creation = Column(DateTime, server_default=func.now())

    chantiers = relationship("Chantier", back_populates="client", cascade="all, delete-orphan")


class Chantier(Base):
    __tablename__ = "chantier"

    id = Column(Integer, primary_key=True, autoincrement=True)
    numero_unique = Column(String, nullable=False, unique=True)
    client_id = Column(Integer, ForeignKey("client.id"), nullable=False)
    adresse_chantier = Column(Text, nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    statut = Column(String, nullable=False, default="en_cours")
    notes = Column(Text)
    date_creation = Column(DateTime, server_default=func.now())

    __table_args__ = (
        CheckConstraint("statut IN ('en_cours','termine','archive')", name="ck_chantier_statut"),
    )

    client = relationship("Client", back_populates="chantiers")
    facades = relationship("Facade", back_populates="chantier", cascade="all, delete-orphan")
    pans = relationship("Pan", back_populates="chantier", cascade="all, delete-orphan")
    interventions = relationship("Intervention", back_populates="chantier", cascade="all, delete-orphan")
    avancements = relationship("Avancement", back_populates="chantier", cascade="all, delete-orphan")
    documents = relationship("DocumentPdf", back_populates="chantier", cascade="all, delete-orphan")


class Facade(Base):
    __tablename__ = "facade"

    id = Column(Integer, primary_key=True, autoincrement=True)
    chantier_id = Column(Integer, ForeignKey("chantier.id"), nullable=False)
    nom = Column(String, nullable=False)
    type_forme = Column(String, nullable=False, default="rectangle")
    largeur = Column(Float, nullable=False)
    hauteur = Column(Float, nullable=False)
    larg_hg = Column(Float)
    larg_hd = Column(Float)
    orientation = Column(String)

    __table_args__ = (
        CheckConstraint(
            "type_forme IN ('rectangle','pignon','forme_libre')", name="ck_facade_type_forme"
        ),
    )

    chantier = relationship("Chantier", back_populates="facades")
    panneaux = relationship("PanneauPose", back_populates="facade", cascade="all, delete-orphan")
    metres = relationship("Metre", back_populates="facade", cascade="all, delete-orphan")


class Pan(Base):
    __tablename__ = "pan"

    id = Column(Integer, primary_key=True, autoincrement=True)
    chantier_id = Column(Integer, ForeignKey("chantier.id"), nullable=False)
    nom = Column(String, nullable=False)
    longueur_rampant = Column(Float, nullable=False)
    largeur = Column(Float, nullable=False)
    angle_degres = Column(Float, nullable=False)
    type_couverture_id = Column(Integer, ForeignKey("type_couverture.id"))

    chantier = relationship("Chantier", back_populates="pans")
    type_couverture = relationship("TypeCouverture")
    pentes = relationship("PenteCalcul", back_populates="pan", cascade="all, delete-orphan")
    metres = relationship("Metre", back_populates="pan", cascade="all, delete-orphan")
