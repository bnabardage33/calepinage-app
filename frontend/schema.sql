-- ============================================================
-- SCHÉMA SUPABASE — Calepinage Bardage BÂTI PRO
-- Modules : Calepinage, Suivi, Stock, Couverture, MÉTÉO
-- ============================================================

-- ============================================================
-- CLIENT / CHANTIER
-- ============================================================

CREATE TABLE client (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom             TEXT NOT NULL,
    societe         TEXT,
    telephone       TEXT,
    email           TEXT,
    adresse         TEXT,
    date_creation   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chantier (
    id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    numero_unique       TEXT NOT NULL UNIQUE,
    client_id           BIGINT NOT NULL REFERENCES client(id) ON DELETE RESTRICT,
    adresse_chantier    TEXT NOT NULL,
    latitude            DECIMAL(10, 7),
    longitude           DECIMAL(10, 7),
    statut              TEXT NOT NULL DEFAULT 'en_cours'
                            CHECK (statut IN ('en_cours', 'termine', 'archive')),
    montant_estime      DECIMAL(12, 2) DEFAULT 0,
    notes               TEXT,
    date_creation       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chantier_client ON chantier(client_id);
CREATE INDEX idx_chantier_statut ON chantier(statut);
CREATE INDEX idx_chantier_coords ON chantier(latitude, longitude);

-- ============================================================
-- FAÇADE (surfaces verticales — bardage)
-- ============================================================

CREATE TABLE facade (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    chantier_id     BIGINT NOT NULL REFERENCES chantier(id) ON DELETE CASCADE,
    nom             TEXT NOT NULL,
    type_forme      TEXT NOT NULL DEFAULT 'rectangle'
                        CHECK (type_forme IN ('rectangle', 'pignon', 'forme_libre')),
    largeur         DECIMAL(10, 3) NOT NULL,
    hauteur         DECIMAL(10, 3) NOT NULL,
    larg_hg         DECIMAL(10, 3),
    larg_hd         DECIMAL(10, 3),
    orientation     TEXT,
    type_bardage    TEXT
);

CREATE INDEX idx_facade_chantier ON facade(chantier_id);

-- ============================================================
-- PAN (surfaces inclinées — couverture / bardage incliné)
-- ============================================================

CREATE TABLE type_couverture (
    id                          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom                         TEXT NOT NULL,
    norme_pente_min             DECIMAL(5, 2),
    norme_pente_max             DECIMAL(5, 2),
    recouvrement_min_recommande DECIMAL(5, 2)
);

CREATE TABLE pan (
    id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    chantier_id         BIGINT NOT NULL REFERENCES chantier(id) ON DELETE CASCADE,
    nom                 TEXT NOT NULL,
    longueur_rampant    DECIMAL(10, 3) NOT NULL,
    largeur             DECIMAL(10, 3) NOT NULL,
    angle_degres        DECIMAL(6, 2) NOT NULL,
    type_couverture_id  BIGINT REFERENCES type_couverture(id) ON DELETE SET NULL
);

CREATE INDEX idx_pan_chantier ON pan(chantier_id);

CREATE TABLE pente_calcul (
    id                          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    pan_id                      BIGINT NOT NULL REFERENCES pan(id) ON DELETE CASCADE,
    surface_projetee            DECIMAL(10, 3) NOT NULL,
    surface_reelle              DECIMAL(10, 3) NOT NULL,
    recouvrement_applique       DECIMAL(5, 2),
    quantite_materiau_ajustee   DECIMAL(10, 3),
    date_calcul                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pente_calcul_pan ON pente_calcul(pan_id);

-- ============================================================
-- FOURNISSEUR / MATÉRIAU
-- ============================================================

CREATE TABLE fournisseur (
    id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom         TEXT NOT NULL,
    contact     TEXT,
    telephone   TEXT,
    email       TEXT
);

CREATE TABLE materiau (
    id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type                TEXT NOT NULL
                            CHECK (type IN ('panneau_composite', 'bardage_metallique',
                                             'rail', 'lisse', 'equerre', 'visserie')),
    fournisseur_id      BIGINT REFERENCES fournisseur(id) ON DELETE SET NULL,
    reference           TEXT NOT NULL,
    longueur_standard   DECIMAL(10, 3),
    largeur_standard    DECIMAL(10, 3),
    epaisseur_standard  DECIMAL(10, 3),
    prix_unitaire       DECIMAL(10, 2),
    disponibilite       TEXT DEFAULT 'disponible'
                            CHECK (disponibilite IN ('disponible', 'rupture', 'sur_commande'))
);

CREATE INDEX idx_materiau_fournisseur ON materiau(fournisseur_id);
CREATE INDEX idx_materiau_type ON materiau(type);

-- ============================================================
-- PANNEAU POSÉ (détail du calepinage sur une façade)
-- ============================================================

CREATE TABLE panneau_pose (
    id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    facade_id           BIGINT NOT NULL REFERENCES facade(id) ON DELETE CASCADE,
    materiau_id         BIGINT NOT NULL REFERENCES materiau(id) ON DELETE RESTRICT,
    numero_panneau      INTEGER NOT NULL,
    position_x          DECIMAL(10, 3) NOT NULL,
    position_y          DECIMAL(10, 3) NOT NULL,
    largeur             DECIMAL(10, 3) NOT NULL,
    hauteur             DECIMAL(10, 3) NOT NULL,
    decoupe             INTEGER NOT NULL DEFAULT 0,
    chute_largeur       DECIMAL(10, 3),
    chute_hauteur       DECIMAL(10, 3)
);

CREATE INDEX idx_panneau_pose_facade ON panneau_pose(facade_id);

-- ============================================================
-- MÉTRÉ (polymorphe : rattaché à une Façade OU un Pan)
-- ============================================================

CREATE TABLE metre (
    id                          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    facade_id                   BIGINT REFERENCES facade(id) ON DELETE CASCADE,
    pan_id                      BIGINT REFERENCES pan(id) ON DELETE CASCADE,
    fige_le                     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    surface_totale              DECIMAL(10, 3) NOT NULL,
    quantite_panneaux           INTEGER,
    quantite_rails              INTEGER,
    quantite_lisses             INTEGER,
    quantite_equerres           INTEGER,
    quantite_visserie           INTEGER,
    marge_chute_pourcentage     DECIMAL(5, 2) DEFAULT 0,
    source                      TEXT NOT NULL DEFAULT 'recalcule'
                                    CHECK (source IN ('manuel', 'recalcule')),
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
    id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    materiau_id         BIGINT NOT NULL UNIQUE REFERENCES materiau(id) ON DELETE CASCADE,
    quantite_disponible DECIMAL(10, 3) NOT NULL DEFAULT 0,
    seuil_alerte        DECIMAL(10, 3) DEFAULT 0,
    emplacement         TEXT,
    derniere_maj        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chute (
    id                      BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    materiau_id             BIGINT NOT NULL REFERENCES materiau(id) ON DELETE CASCADE,
    chantier_origine_id     BIGINT REFERENCES chantier(id) ON DELETE SET NULL,
    largeur                 DECIMAL(10, 3) NOT NULL,
    hauteur                 DECIMAL(10, 3) NOT NULL,
    statut                  TEXT NOT NULL DEFAULT 'disponible'
                                CHECK (statut IN ('disponible', 'reservee', 'utilisee')),
    date_creation           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chute_materiau ON chute(materiau_id);
CREATE INDEX idx_chute_statut ON chute(statut);

CREATE TABLE mouvement_stock (
    id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    stock_materiau_id   BIGINT NOT NULL REFERENCES stock_materiau(id) ON DELETE CASCADE,
    chantier_id         BIGINT REFERENCES chantier(id) ON DELETE SET NULL,
    type                TEXT NOT NULL
                            CHECK (type IN ('entree', 'sortie', 'reservation')),
    quantite            DECIMAL(10, 3) NOT NULL,
    date                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mouvement_stock_materiau ON mouvement_stock(stock_materiau_id);

-- ============================================================
-- PLANNING
-- ============================================================

CREATE TABLE equipe (
    id      BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom     TEXT NOT NULL,
    membres TEXT
);

CREATE TABLE intervention (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    chantier_id     BIGINT NOT NULL REFERENCES chantier(id) ON DELETE CASCADE,
    equipe_id       BIGINT REFERENCES equipe(id) ON DELETE SET NULL,
    date_debut      TIMESTAMPTZ NOT NULL,
    date_fin        TIMESTAMPTZ,
    statut          TEXT NOT NULL DEFAULT 'planifiee'
                        CHECK (statut IN ('planifiee', 'en_cours', 'terminee', 'reportee')),
    meteo_prevue    JSONB
);

CREATE INDEX idx_intervention_chantier ON intervention(chantier_id);
CREATE INDEX idx_intervention_dates ON intervention(date_debut, date_fin);

-- ============================================================
-- AVANCEMENT avec MÉTÉO RÉELLE
-- ============================================================

CREATE TABLE avancement (
    id                      BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    chantier_id             BIGINT NOT NULL REFERENCES chantier(id) ON DELETE CASCADE,
    date                    TIMESTAMPTZ NOT NULL,
    pourcentage_avancement  DECIMAL(5, 2) NOT NULL DEFAULT 0
                                CHECK (pourcentage_avancement BETWEEN 0 AND 100),
    commentaire             TEXT,
    meteo_reelle            JSONB
);

CREATE INDEX idx_avancement_chantier ON avancement(chantier_id, date);

-- ============================================================
-- DOCUMENTS PDF
-- ============================================================

CREATE TABLE document_pdf (
    id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    chantier_id         BIGINT NOT NULL REFERENCES chantier(id) ON DELETE CASCADE,
    type                TEXT NOT NULL
                            CHECK (type IN ('plan', 'liste_decoupe', 'metre')),
    chemin_fichier      TEXT NOT NULL,
    date_generation     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_pdf_chantier ON document_pdf(chantier_id);

-- ============================================================
-- TABLE DE CACHE MÉTÉO (optionnelle)
-- ============================================================

CREATE TABLE cache_meteo (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    coord_key       TEXT NOT NULL UNIQUE,  -- "lat,lon"
    donnees         JSONB NOT NULL,
    date_recuperation TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_expiration TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_cache_meteo_coord ON cache_meteo(coord_key);
CREATE INDEX idx_cache_meteo_expiration ON cache_meteo(date_expiration);

-- ============================================================
-- DONNÉES DE BASE (Types de bardage)
-- ============================================================

INSERT INTO type_couverture (nom, norme_pente_min, norme_pente_max, recouvrement_min_recommande)
VALUES 
    ('Bardage incliné', 0, 90, 5),
    ('Tôle métallique', 5, 45, 10),
    ('Ardoise', 25, 60, 15),
    ('Tuile', 20, 40, 12);
