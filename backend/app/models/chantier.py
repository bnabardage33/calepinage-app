from sqlalchemy import Column, Integer, Float, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base  # Ajustez ce chemin si votre Base est définie ailleurs (ex: ..database)

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
    type_bardage = Column(String)

    __table_args__ = (
        CheckConstraint(
            "type_forme IN ('rectangle','pignon','forme_libre')", name="ck_facade_type_forme"
        ),
        CheckConstraint(
            "type_bardage IS NULL OR type_bardage IN "
            "('composite','bois_naturel','metallique_tole','metallique_cassette',"
            "'panneau_sandwich','hpl_fibrociment')",
            name="ck_facade_type_bardage",
        ),
    )

    chantier = relationship("Chantier", back_populates="facades")
    panneaux = relationship("PanneauPose", back_populates="facade", cascade="all, delete-orphan")
    metres = relationship("Metre", back_populates="facade", cascade="all, delete-orphan")
    
