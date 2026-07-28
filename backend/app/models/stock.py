from sqlalchemy import Column, Integer, String, Float, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class StockMateriau(Base):
    __tablename__ = "stock_materiau"

    id = Column(Integer, primary_key=True, autoincrement=True)
    materiau_id = Column(Integer, ForeignKey("materiau.id"), nullable=False, unique=True)
    quantite_disponible = Column(Float, nullable=False, default=0)
    seuil_alerte = Column(Float, default=0)
    emplacement = Column(String)

    materiau = relationship("Materiau", back_populates="stock")
    mouvements = relationship("MouvementStock", back_populates="stock_materiau", cascade="all, delete-orphan")


class Chute(Base):
    __tablename__ = "chute"

    id = Column(Integer, primary_key=True, autoincrement=True)
    materiau_id = Column(Integer, ForeignKey("materiau.id"), nullable=False)
    chantier_origine_id = Column(Integer, ForeignKey("chantier.id"))
    largeur = Column(Float, nullable=False)
    hauteur = Column(Float, nullable=False)
    statut = Column(String, nullable=False, default="disponible")

    __table_args__ = (
        CheckConstraint("statut IN ('disponible','reservee','utilisee')", name="ck_chute_statut"),
    )

    materiau = relationship("Materiau")


class MouvementStock(Base):
    __tablename__ = "mouvement_stock"

    id = Column(Integer, primary_key=True, autoincrement=True)
    stock_materiau_id = Column(Integer, ForeignKey("stock_materiau.id"), nullable=False)
    chantier_id = Column(Integer, ForeignKey("chantier.id"))
    type = Column(String, nullable=False)
    quantite = Column(Float, nullable=False)

    __table_args__ = (
        CheckConstraint("type IN ('entree','sortie','reservation')", name="ck_mouvement_type"),
    )

    stock_materiau = relationship("StockMateriau", back_populates="mouvements")
