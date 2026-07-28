-- ============================================================
-- Schéma SQLite — Outil calepinage bardage / couverture
-- Modules : Calepinage (V1), Suivi (planning/client), Stock, Pente/Couverture
-- ============================================================

PRAGMA foreign_keys = ON;

-- ============================================================
-- CLIENT / CHANTIER
-- ============================================================

CREATE TABLE client (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nom             TEXT NOT NULL,
    societe         TEXT,
    telephone       TEXT,
    email           TEXT,
    adresse         TEXT,
    date_creation   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE chantier (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_unique       TEXT NOT NULL UNIQUE,
    client_id           INTEGER NOT NULL,
    adresse_chantier    TEXT NOT NULL,
    latitude            REAL,
    longitude           REAL,
    statut              TEXT NOT NULL DEFAULT 'en_cours'
                            CHECK (statut IN ('en_cours', 'termine', 'archive')),
    notes               TEXT,
    date_creation       TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE RESTRICT
);

CREATE INDEX idx_chantier_client ON chantier(client_id);
CREATE INDEX idx_chantier_statut ON chantier(statut);

-- ============================================================
-- FAÇADE (surfaces verticales — bardage)
-- ============================================================

CREATE TABLE facade (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    chantier_id     INTEGER NOT NULL,
    nom             TEXT NOT NULL,
    type_forme      TEXT NOT NULL DEFAULT 'rectangle'
                        CHECK (type_forme IN ('rectangle', 'pignon', 'forme_libre')),
    largeur         REAL NOT NULL,
    hauteur         REAL NOT NULL,
    larg_hg         REAL,           -- utilisé pour type pignon
    larg_hd         REAL,           -- utilisé pour type pignon
    orientation     TEXT,           -- ex: "Nord", "Sud-Est"
    FOREIGN KEY (chantier_id) REFERENCES chantier(id) ON DELETE CASCADE
);

CREATE INDEX idx_facade_chantier ON facade(chantier_id);

-- ============================================================
-- PAN (surfaces inclinées — couverture / bardage incliné)
-- ============================================================

CREATE TABLE type_couverture (
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    nom                         TEXT NOT NULL,          -- ex: "Bardage incliné", "Tôle métallique"
    norme_pente_min             REAL,                    -- en degrés
    norme_pente_max             REAL,
    recouvrement_min_recommande REAL                     -- en cm ou %
);

CREATE TABLE pan (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    chantier_id         INTEGER NOT NULL,
    nom                 TEXT NOT NULL,          -- ex: "Versant Sud"
    longueur_rampant    REAL NOT NULL,
    largeur             REAL NOT NULL,
    angle_degres        REAL NOT NULL,
    type_couverture_id  INTEGER,
    FOREIGN KEY (chantier_id) REFERENCES chantier(id) ON DELETE CASCADE,
    FOREIGN KEY (type_couverture_id) REFERENCES type_couverture(id) ON DELETE SET NULL
);

CREATE INDEX idx_pan_chantier ON pan(chantier_id);

CREATE TABLE pente_calcul (
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    pan_id                      INTEGER NOT NULL,
    surface_projetee            REAL NOT NULL,
    surface_reelle               REAL NOT NULL,          -- ajustée selon l'angle
    recouvrement_applique        REAL,
    quantite_materiau_ajustee    REAL,
    date_calcul                  TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (pan_id) REFERENCES pan(id) ON DELETE CASCADE
);

CREATE INDEX idx_pente_calcul_pan ON pente_calcul(pan_id);

-- ============================================================
-- FOURNISSEUR / MATÉRIAU
-- ============================================================

CREATE TABLE fournisseur (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nom         TEXT NOT NULL,
    contact     TEXT,
    telephone   TEXT,
    email       TEXT
);

CREATE TABLE materiau (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    type                TEXT NOT NULL
                            CHECK (type IN ('panneau_composite', 'bardage_metallique',
                                             'rail', 'lisse', 'equerre', 'visserie')),
    fournisseur_id      INTEGER,
    reference           TEXT NOT NULL,
    longueur_standard   REAL,
    largeur_standard    REAL,
    epaisseur_standard  REAL,
    prix_unitaire       REAL,
    disponibilite       TEXT DEFAULT 'disponible'
                            CHECK (disponibilite IN ('disponible', 'rupture', 'sur_commande')),
    FOREIGN KEY (fournisseur_id) REFERENCES fournisseur(id) ON DELETE SET NULL
);

CREATE INDEX idx_materiau_fournisseur ON materiau(fournisseur_id);
CREATE INDEX idx_materiau_type ON materiau(type);

-- ============================================================
-- PANNEAU POSÉ (détail du calepinage sur une façade)
-- ============================================================

CREATE TABLE panneau_pose (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    facade_id           INTEGER NOT NULL,
    materiau_id         INTEGER NOT NULL,
    numero_panneau      INTEGER NOT NULL,       -- numérotation pour le PDF
    position_x          REAL NOT NULL,
    position_y          REAL NOT NULL,
    largeur             REAL NOT NULL,
    hauteur             REAL NOT NULL,
    decoupe             INTEGER NOT NULL DEFAULT 0,   -- booléen 0/1
    chute_largeur        REAL,
    chute_hauteur        REAL,
    FOREIGN KEY (facade_id) REFERENCES facade(id) ON DELETE CASCADE,
    FOREIGN KEY (materiau_id) REFERENCES materiau(id) ON DELETE RESTRICT
);

CREATE INDEX idx_panneau_pose_facade ON panneau_pose(facade_id);

-- ============================================================
-- MÉTRÉ (polymorphe : rattaché à une Façade OU un Pan)
-- ============================================================

CREATE TABLE metre (
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    facade_id                   INTEGER,
    pan_id                      INTEGER,
    fige_le                     TEXT NOT NULL DEFAULT (datetime('now')),
    surface_totale               REAL NOT NULL,
    quantite_panneaux            INTEGER,
    quantite_rails               INTEGER,
    quantite_lisses              INTEGER,
    quantite_equerres            INTEGER,
    quantite_visserie            INTEGER,
    marge_chute_pourcentage      REAL DEFAULT 0,
    source                      TEXT NOT NULL DEFAULT 'recalcule'
                                    CHECK (source IN ('manuel', 'recalcule')),
    FOREIGN KEY (facade_id) REFERENCES facade(id) ON DELETE CASCADE,
    FOREIGN KEY (pan_id) REFERENCES pan(id) ON DELETE CASCADE,
    -- un seul des deux doit être rempli (jamais les deux, jamais aucun)
    CHECK (
        (facade_id IS NOT NULL AND pan_id IS NULL)
        OR (facade_id IS NULL AND pan_id IS NOT NULL)
    )
);

CREATE INDEX idx_metre_facade ON metre(facade_id);
CREATE INDEX idx_metre_pan ON metre(pan_id);

-- ============================================================
-- STOCK
-- ============================================================

CREATE TABLE stock_materiau (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    materiau_id         INTEGER NOT NULL UNIQUE,
    quantite_disponible REAL NOT NULL DEFAULT 0,
    seuil_alerte        REAL DEFAULT 0,
    emplacement         TEXT,
    derniere_maj        TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (materiau_id) REFERENCES materiau(id) ON DELETE CASCADE
);

CREATE TABLE chute (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    materiau_id             INTEGER NOT NULL,
    chantier_origine_id     INTEGER,
    largeur                 REAL NOT NULL,
    hauteur                 REAL NOT NULL,
    statut                  TEXT NOT NULL DEFAULT 'disponible'
                                CHECK (statut IN ('disponible', 'reservee', 'utilisee')),
    date_creation           TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (materiau_id) REFERENCES materiau(id) ON DELETE CASCADE,
    FOREIGN KEY (chantier_origine_id) REFERENCES chantier(id) ON DELETE SET NULL
);

CREATE INDEX idx_chute_materiau ON chute(materiau_id);
CREATE INDEX idx_chute_statut ON chute(statut);

CREATE TABLE mouvement_stock (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    stock_materiau_id   INTEGER NOT NULL,
    chantier_id         INTEGER,
    type                TEXT NOT NULL
                            CHECK (type IN ('entree', 'sortie', 'reservation')),
    quantite            REAL NOT NULL,
    date                TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (stock_materiau_id) REFERENCES stock_materiau(id) ON DELETE CASCADE,
    FOREIGN KEY (chantier_id) REFERENCES chantier(id) ON DELETE SET NULL
);

CREATE INDEX idx_mouvement_stock_materiau ON mouvement_stock(stock_materiau_id);

-- ============================================================
-- PLANNING
-- ============================================================

CREATE TABLE equipe (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nom     TEXT NOT NULL,
    membres TEXT           -- liste de noms, stockée en JSON: '["Jean", "Marc"]'
);

CREATE TABLE intervention (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    chantier_id     INTEGER NOT NULL,
    equipe_id       INTEGER,
    date_debut      TEXT NOT NULL,
    date_fin        TEXT,
    statut          TEXT NOT NULL DEFAULT 'planifiee'
                        CHECK (statut IN ('planifiee', 'en_cours', 'terminee', 'reportee')),
    meteo_prevue    TEXT,       -- résultat API, mis en cache (JSON ou texte résumé)
    FOREIGN KEY (chantier_id) REFERENCES chantier(id) ON DELETE CASCADE,
    FOREIGN KEY (equipe_id) REFERENCES equipe(id) ON DELETE SET NULL
);

CREATE INDEX idx_intervention_chantier ON intervention(chantier_id);
CREATE INDEX idx_intervention_dates ON intervention(date_debut, date_fin);

CREATE TABLE avancement (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    chantier_id             INTEGER NOT NULL,
    date                    TEXT NOT NULL,
    pourcentage_avancement  REAL NOT NULL DEFAULT 0 CHECK (pourcentage_avancement BETWEEN 0 AND 100),
    commentaire             TEXT,
    meteo_reelle            TEXT,       -- API, surchargeable manuellement
    FOREIGN KEY (chantier_id) REFERENCES chantier(id) ON DELETE CASCADE
);

CREATE INDEX idx_avancement_chantier ON avancement(chantier_id, date);

-- ============================================================
-- DOCUMENTS PDF
-- ============================================================

CREATE TABLE document_pdf (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    chantier_id         INTEGER NOT NULL,
    type                TEXT NOT NULL
                            CHECK (type IN ('plan', 'liste_decoupe', 'metre')),
    chemin_fichier      TEXT NOT NULL,
    date_generation     TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (chantier_id) REFERENCES chantier(id) ON DELETE CASCADE
);

CREATE INDEX idx_document_pdf_chantier ON document_pdf(chantier_id);
