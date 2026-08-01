from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class Equipe(Base):
    __tablename__ = "equipe"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String, nullable=False)
    membres = Column(Text)  # JSON: '["Jean", "Marc"]'


class Intervention(Base):
    __tablename__ = "intervention"

    id = Column(Integer, primary_key=True, autoincrement=True)
    chantier_id = Column(Integer, ForeignKey("chantier.id"), nullable=False)
    equipe_id = Column(Integer, ForeignKey("equipe.id"))
    date_debut = Column(String, nullable=False)
    date_fin = Column(String)
    statut = Column(String, nullable=False, default="planifiee")
    meteo_prevue = Column(Text)

    __table_args__ = (
        CheckConstraint(
            "statut IN ('planifiee','en_cours','terminee','reportee')", name="ck_intervention_statut"
        ),
    )

    chantier = relationship("Chantier", back_populates="interventions")
    equipe = relationship("Equipe")


class Avancement(Base):
    __tablename__ = "avancement"

    id = Column(Integer, primary_key=True, autoincrement=True)
    chantier_id = Column(Integer, ForeignKey("chantier.id"), nullable=False)
    date = Column(String, nullable=False)
    pourcentage_avancement = Column(Float, nullable=False, default=0)
    commentaire = Column(Text)
    meteo_reelle = Column(Text)

    __table_args__ = (
        CheckConstraint(
            "pourcentage_avancement BETWEEN 0 AND 100", name="ck_avancement_pourcentage"
        ),
    )

    chantier = relationship("Chantier", back_populates="avancements")


class DocumentPdf(Base):
    __tablename__ = "document_pdf"

    id = Column(Integer, primary_key=True, autoincrement=True)
    chantier_id = Column(Integer, ForeignKey("chantier.id"), nullable=False)
    type = Column(String, nullable=False)
    chemin_fichier = Column(String, nullable=False)

    __table_args__ = (
        CheckConstraint("type IN ('plan','liste_decoupe','metre')", name="ck_document_type"),
    )

    chantier = relationship("Chantier", back_populates="documents")

# Dans Intervention :
    meteo_prevue = Column(Text)  # JSON stocké

# Dans Avancement :
    meteo_reelle = Column(Text)  # JSON stocké
