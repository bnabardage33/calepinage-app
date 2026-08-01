import os
import json
import aiohttp
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.database import SessionLocal
from sqlalchemy import text

METEO_API_KEY = os.environ.get("METEO_API_KEY")
METEO_CACHE_DUREE = timedelta(hours=1)

class MeteoService:
    """Service de récupération et cache des données météo"""
    
    @classmethod
    async def get_meteo(cls, lat: float, lon: float, db: Optional[Session] = None) -> Dict[str, Any]:
        """Récupère la météo avec cache en base de données"""
        
        cache_key = f"{lat:.4f},{lon:.4f}"

        # Vérifier le cache en base (silencieux si la table n'existe pas encore)
        if db:
            try:
                result = db.execute(
                    text("""
                        SELECT donnees, date_expiration 
                        FROM cache_meteo 
                        WHERE coord_key = :key 
                          AND date_expiration > NOW()
                    """),
                    {"key": cache_key}
                ).fetchone()
                
                if result:
                    return result[0]
            except Exception as e:
                print(f"⚠️ Cache météo indisponible (lecture) : {e}")
                db.rollback()
        
        # Appel API
        if not METEO_API_KEY:
            return cls._fallback_meteo(lat, lon)
        
        try:
            url = "https://api.openweathermap.org/data/2.5/forecast"
            params = {
                "lat": lat,
                "lon": lon,
                "appid": METEO_API_KEY,
                "units": "metric",
                "lang": "fr",
                "cnt": 8
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        formatted = cls._format_meteo(data)
                        
                        # Sauvegarder en cache (silencieux si la table n'existe pas encore)
                        if db:
                            try:
                                db.execute(
                                    text("""
                                        INSERT INTO cache_meteo (coord_key, donnees, date_expiration)
                                        VALUES (:key, :donnees, :expiration)
                                        ON CONFLICT (coord_key) DO UPDATE
                                        SET donnees = :donnees, 
                                            date_recuperation = NOW(),
                                            date_expiration = :expiration
                                    """),
                                    {
                                        "key": cache_key,
                                        "donnees": json.dumps(formatted),
                                        "expiration": datetime.now() + METEO_CACHE_DUREE
                                    }
                                )
                                db.commit()
                            except Exception as e:
                                print(f"⚠️ Cache météo indisponible (écriture) : {e}")
                                db.rollback()
                        
                        return formatted
                    else:
                        return cls._fallback_meteo(lat, lon)
        except Exception as e:
            print(f"⚠️ Erreur météo: {e}")
            return cls._fallback_meteo(lat, lon)
    
    @classmethod
    def _format_meteo(cls, data: Dict) -> Dict:
        """Formate les données pour l'affichage"""
        if not data.get("list"):
            return cls._fallback_meteo(0, 0)
        
        today = data["list"][0]
        tomorrow = data["list"][4] if len(data["list"]) > 4 else today
        
        return {
            "actuel": {
                "temperature": round(today["main"]["temp"]),
                "ressenti": round(today["main"]["feels_like"]),
                "humidite": today["main"]["humidity"],
                "vent": round(today["wind"]["speed"] * 3.6),
                "vent_rafales": round(today["wind"].get("gust", 0) * 3.6),
                "description": today["weather"][0]["description"],
                "icone": today["weather"][0]["icon"],
                "pluie": today.get("rain", {}).get("3h", 0),
            },
            "previsions": [
                {
                    "heure": item["dt_txt"][11:16],
                    "temperature": round(item["main"]["temp"]),
                    "description": item["weather"][0]["description"],
                    "icone": item["weather"][0]["icon"],
                    "pluie": item.get("rain", {}).get("3h", 0),
                    "vent": round(item["wind"]["speed"] * 3.6),
                }
                for item in data["list"][:4]
            ],
            "demain": {
                "temperature": round(tomorrow["main"]["temp"]),
                "description": tomorrow["weather"][0]["description"],
                "icone": tomorrow["weather"][0]["icon"],
                "pluie": tomorrow.get("rain", {}).get("3h", 0),
                "vent": round(tomorrow["wind"]["speed"] * 3.6),
            },
            "peut_travailler": cls._peut_travailler(data["list"][0]),
            "ville": data.get("city", {}).get("name", "Inconnu"),
            "pays": data.get("city", {}).get("country", ""),
            "maj": datetime.now().isoformat(),
        }
    
    @classmethod
    def _peut_travailler(cls, prevision: Dict) -> Dict:
        """Vérifie si les conditions sont bonnes pour le bardage"""
        pluie = prevision.get("rain", {}).get("3h", 0)
        vent = prevision["wind"]["speed"] * 3.6
        temperature = prevision["main"]["temp"]
        
        pluie_ok = pluie < 0.5
        vent_ok = vent < 40
        temp_ok = temperature > 0
        
        return {
            "ok": pluie_ok and vent_ok and temp_ok,
            "pluie_ok": pluie_ok,
            "vent_ok": vent_ok,
            "temp_ok": temp_ok,
            "message": cls._message_meteo(pluie_ok, vent_ok, temp_ok)
        }
    
    @classmethod
    def _message_meteo(cls, pluie_ok: bool, vent_ok: bool, temp_ok: bool) -> str:
        if pluie_ok and vent_ok and temp_ok:
            return "✅ Conditions idéales pour le bardage"
        elif not pluie_ok:
            return "⚠️ Risque de pluie — protéger les matériaux"
        elif not vent_ok:
            return "⚠️ Vent fort — attention aux manipulations en hauteur"
        elif not temp_ok:
            return "❌ Température trop basse — risque de gel"
        else:
            return "⚠️ Conditions dégradées — prudence"
    
    @classmethod
    def _fallback_meteo(cls, lat: float, lon: float) -> Dict:
        """Données météo de secours"""
        return {
            "actuel": {
                "temperature": "N/A",
                "ressenti": "N/A",
                "humidite": "N/A",
                "vent": "N/A",
                "description": "Données non disponibles",
                "icone": "01d",
                "pluie": 0,
            },
            "previsions": [],
            "demain": {
                "temperature": "N/A",
                "description": "N/A",
                "icone": "01d",
                "pluie": 0,
                "vent": "N/A",
            },
            "peut_travailler": {
                "ok": False,
                "message": "⚠️ Météo indisponible — vérifier sur site",
                "pluie_ok": False,
                "vent_ok": False,
                "temp_ok": False,
            },
            "ville": "Inconnu",
            "pays": "",
            "maj": datetime.now().isoformat(),
        }


# ===== ENDPOINT FASTAPI =====
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.chantier import Chantier

router = APIRouter(prefix="/meteo", tags=["meteo"])

@router.get("/chantier/{chantier_id}")
async def get_meteo_chantier(chantier_id: int, db: Session = Depends(get_db)):
    """Récupère la météo pour un chantier"""
    chantier = db.get(Chantier, chantier_id)
    if not chantier:
        raise HTTPException(status_code=404, detail="Chantier introuvable")
    
    if not chantier.latitude or not chantier.longitude:
        raise HTTPException(
            status_code=400,
            detail="Coordonnées GPS non renseignées pour ce chantier"
        )
    
    return await MeteoService.get_meteo(chantier.latitude, chantier.longitude, db)


@router.get("/coords")
async def get_meteo_coords(lat: float, lon: float, db: Session = Depends(get_db)):
    """Récupère la météo pour des coordonnées GPS"""
    return await MeteoService.get_meteo(lat, lon, db)


@router.get("/cache/clear")
async def clear_meteo_cache(db: Session = Depends(get_db)):
    """Vide le cache météo (admin)"""
    try:
        db.execute(text("DELETE FROM cache_meteo"))
        db.commit()
        return {"status": "Cache vidé avec succès"}
    except Exception as e:
        db.rollback()
        return {"status": f"Cache indisponible : {e}"}
