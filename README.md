# 🏗️ BÂTI PRO — Calepinage Bardage

Application complète pour la gestion de chantiers de bardage, calcul de métré automatique, suivi de planning et gestion de stock.

## 🚀 Stack

- **Backend** : FastAPI (Python)
- **Frontend** : React + Vite
- **Base de données** : Supabase (PostgreSQL)
- **Déploiement** : Render (Web Service + Static Site)

## 📦 Fonctionnalités

- ✅ Gestion des clients et chantiers
- ✅ Création de façades avec calcul de métré automatique
- ✅ Calcul des quantités (vis, lisses, rails, équerres)
- ✅ Tableau de bord avec KPIs
- ✅ Planning de la semaine
- ✅ Rappels et tâches

## 🛠️ Installation locale

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
