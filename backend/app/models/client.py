from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Client(Base):
    __tablename__ = "client"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String, nullable=False)
    societe = Column(String)
    telephone = Column(String)
    email = Column(String)
    adresse = Column(String)
    date_creation = Column(DateTime, default=datetime.utcnow)

    # Relation avec Chantier
    # dans app/models/client.py
    chantiers = relationship("app.models.chantier.Chantier", back_populates="client")
