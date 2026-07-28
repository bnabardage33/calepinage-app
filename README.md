# Calepinage Bardage — Refonte

Outil métier pour le calepinage bardage, métré automatique, suivi de chantier,
gestion de stock et calcul de pente/couverture.

## Stack

- **Frontend** : React + Vite (JavaScript)
- **Backend** : FastAPI
- **Base de données** : SQLite

## Structure

```
calepinage-app/
├── backend/
│   ├── app/
│   │   ├── main.py              # point d'entrée FastAPI
│   │   ├── database.py          # config SQLAlchemy + session
│   │   ├── models/               # tables SQLAlchemy (1 fichier par domaine)
│   │   │   ├── chantier.py       # Client, Chantier, Facade, Pan
│   │   │   ├── materiau.py       # Fournisseur, Materiau, PanneauPose, Metre
│   │   │   ├── couverture.py     # TypeCouverture, PenteCalcul
│   │   │   ├── stock.py          # StockMateriau, Chute, MouvementStock
│   │   │   └── planning.py       # Equipe, Intervention, Avancement, DocumentPdf
│   │   ├── schemas/               # schémas Pydantic (validation + sérialisation API)
│   │   ├── routers/               # endpoints FastAPI, groupés par domaine
│   │   └── services/               # logique métier (calcul métré, calcul pente...)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/                 # une page par écran (Chantiers, ChantierDetail...)
│   │   ├── components/             # composants réutilisables
│   │   ├── api/client.js           # tous les appels API centralisés
│   │   └── hooks/                  # hooks React personnalisés
│   └── package.json
└── schema.sql                      # schéma SQL de référence (généré à la main, source de vérité)
```

## Lancer en local

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

L'API tourne sur `http://localhost:8000`. Les tables SQLite sont créées
automatiquement au démarrage (`calepinage.db` dans `backend/`).
Doc interactive : `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend tourne sur `http://localhost:5173` et proxy les requêtes `/api`
vers le backend (voir `vite.config.js`).

## État actuel (V1 — module Calepinage)

- [x] Schéma SQL complet (16 tables, 4 modules) — voir `schema.sql`
- [x] Modèles SQLAlchemy pour toutes les tables
- [x] Schémas Pydantic + endpoints CRUD pour Client / Chantier / Façade
- [ ] Endpoints Panneau_pose (détail calepinage)
- [ ] Endpoint calcul métré automatique (service `calcul_metre.py`)
- [ ] Génération PDF (plan + liste de découpe)
- [ ] Écrans frontend calepinage (saisie façade, visualisation panneaux)

## Prochaines étapes suggérées

1. Service `calcul_metre.py` : logique de calcul automatique (surface, quantités
   panneaux/rails/lisses/équerres/visserie, marge de chute) à partir d'une Façade.
2. Endpoints + schémas pour Matériau/Fournisseur, PanneauPose, Metre.
3. Écran frontend de saisie de façade avec calcul de métré en direct.
4. Génération PDF (probablement `reportlab` ou `weasyprint` côté FastAPI).

Modules 2 (suivi/planning), 3 (stock) et 4 (pente/couverture) : modèles déjà
en base, restent schémas + routers + écrans à construire une fois le
module 1 stabilisé.
