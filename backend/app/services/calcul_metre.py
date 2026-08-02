"""
Calcul du métré automatique pour une façade de bardage.

Règles métier (validées avec l'artisan, normes DTU) :
- Visserie : grille vis/m² par type de bardage, valeur minimum de la
  fourchette DTU retenue. Vendue en poches de 100 : on arrondit au nombre
  de poches nécessaires + 1 poche de sécurité.
- Lisses / Rails : grille ml/m² par type de bardage (même règle pour les
  deux). Vendues en barres de 3m : arrondi supérieur + 1 barre de sécurité.
- Équerres : uniquement pour chevrons sur mur maçonné/béton (V1 ne gère
  que ce cas — pas d'équerres sur ossature bois, vis directes).
  Formule : (hauteur / entraxe_equerre + 1) équerres par chevron,
  nombre de chevrons = (largeur / entraxe_chevron) + 1.
  L'entraxe chevron réutilise l'entraxe lisses/rails du type de bardage.
"""
import math

# Grille par type de bardage : vis/m² (minimum DTU) et ml/m² pour lisses/rails
# (l'entraxe correspondant est fourni à titre indicatif, la valeur qui compte
# pour le calcul est ml_m2).
REGLES_BARDAGE = {
    "composite": {
        "vis_m2": 40,
        "ml_m2": 2.5,
        "entraxe_chevron": 0.40,
        "libelle": "Composite (clips)",
    },
    "bois_naturel": {
        "vis_m2": 30,
        "ml_m2": 2.0,
        "entraxe_chevron": 2.5,  # valeur par défaut, à confirmer
        "libelle": "Bois naturel",
    },
    "metallique_tole": {
        "vis_m2": 10,
        "ml_m2": 1.0,
        "entraxe_chevron": 1.20,
        "libelle": "Métallique tôle (simple peau)",
    },
    "metallique_cassette": {
        "vis_m2": 8,
        "ml_m2": 2.5,  # même principe que le composite (chevron + clips)
        "entraxe_chevron": 0.40,
        "libelle": "Métallique cassette",
    },
    "panneau_sandwich": {
        "vis_m2": 8,
        "ml_m2": 2.0,
        "entraxe_chevron": 2.0,  # valeur par défaut, à confirmer
        "libelle": "Panneau sandwich",
    },
    "hpl_fibrociment": {
        "vis_m2": 10,
        "ml_m2": 2.0,
        "entraxe_chevron": 0.60,
        "libelle": "HPL / Fibrociment",
    },
}

VIS_PAR_POCHE = 100
LONGUEUR_BARRE = 3.0  # mètres

# Équerres — normes DTU (uniquement pour chevrons sur mur maçonné/béton)
ENTRAXE_EQUERRE_COURANT = 1.35  # mètres
MIN_EQUERRES_PAR_CHEVRON = 3


def calcul_visserie(surface_totale: float, type_bardage: str) -> dict:
    """Nombre de vis nécessaires et de poches à commander (+ 1 poche de sécurité)."""
    regle = REGLES_BARDAGE[type_bardage]
    vis_necessaires = math.ceil(surface_totale * regle["vis_m2"])
    poches_necessaires = math.ceil(vis_necessaires / VIS_PAR_POCHE)
    poches_a_commander = poches_necessaires + 1
    return {
        "vis_necessaires": vis_necessaires,
        "poches_necessaires": poches_necessaires,
        "poches_a_commander": poches_a_commander,
        "vis_totales_commandees": poches_a_commander * VIS_PAR_POCHE,
    }


def calcul_lisses_rails(surface_totale: float, type_bardage: str) -> dict:
    """Mètres linéaires nécessaires et barres à commander (+ 1 barre de sécurité)."""
    regle = REGLES_BARDAGE[type_bardage]
    ml_necessaires = surface_totale * regle["ml_m2"]
    barres_necessaires = math.ceil(ml_necessaires / LONGUEUR_BARRE)
    barres_a_commander = barres_necessaires + 1
    return {
        "ml_necessaires": round(ml_necessaires, 2),
        "barres_necessaires": barres_necessaires,
        "barres_a_commander": barres_a_commander,
        "ml_totaux_commandes": barres_a_commander * LONGUEUR_BARRE,
    }


def calcul_equerres(largeur: float, hauteur: float, type_bardage: str) -> dict:
    """
    Équerres nécessaires pour fixer les chevrons sur mur maçonné/béton.
    V1 : ne gère que ce cas (pas de champ type de mur pour l'instant).
    """
    regle = REGLES_BARDAGE[type_bardage]
    entraxe_chevron = regle["entraxe_chevron"]

    nombre_chevrons = math.ceil(largeur / entraxe_chevron) + 1
    equerres_par_chevron = max(
        MIN_EQUERRES_PAR_CHEVRON,
        math.floor(hauteur / ENTRAXE_EQUERRE_COURANT) + 1,
    )
    total_equerres = nombre_chevrons * equerres_par_chevron

    return {
        "nombre_chevrons": nombre_chevrons,
        "equerres_par_chevron": equerres_par_chevron,
        "total_equerres": total_equerres,
    }


def calcul_metre_facade(
    largeur: float,
    hauteur: float,
    type_bardage: str,
    marge_chute_pourcentage: float = 0.0,
    type_forme: str = "rectangle",
    hauteur_pointe: float | None = None,
) -> dict:
    """
    Calcule le métré complet d'une façade.

    Pour un pignon : `hauteur` = hauteur des murs (à l'égout),
    `hauteur_pointe` = hauteur au faîtage (point le plus haut, au centre).
    Surface = rectangle (largeur × hauteur) + triangle du dessus.
    """
    if type_bardage not in REGLES_BARDAGE:
        raise ValueError(
            f"type_bardage inconnu : {type_bardage!r}. "
            f"Valeurs valides : {list(REGLES_BARDAGE)}"
        )

    if type_forme == "pignon":
        if not hauteur_pointe or hauteur_pointe <= hauteur:
            raise ValueError(
                "Pour un pignon, la hauteur au faîtage (pointe) doit être renseignée "
                "et supérieure à la hauteur des murs."
            )
        surface_totale = largeur * hauteur + largeur * (hauteur_pointe - hauteur) / 2
        # Pour les équerres, on prend la hauteur au faîtage (chevron central,
        # le plus long) : légère surestimation sur les chevrons de bord, mais
        # ça évite un manque de matériel sur le chantier.
        hauteur_equerres = hauteur_pointe
    else:
        surface_totale = largeur * hauteur
        hauteur_equerres = hauteur

    surface_avec_marge = surface_totale * (1 + marge_chute_pourcentage / 100)

    visserie = calcul_visserie(surface_avec_marge, type_bardage)
    lisses = calcul_lisses_rails(surface_avec_marge, type_bardage)
    rails = calcul_lisses_rails(surface_avec_marge, type_bardage)  # même règle
    equerres = calcul_equerres(largeur, hauteur_equerres, type_bardage)

    return {
        "type_bardage": type_bardage,
        "type_bardage_libelle": REGLES_BARDAGE[type_bardage]["libelle"],
        "surface_totale": round(surface_totale, 2),
        "surface_avec_marge_chute": round(surface_avec_marge, 2),
        "marge_chute_pourcentage": marge_chute_pourcentage,
        "visserie": visserie,
        "lisses": lisses,
        "rails": rails,
        "equerres": equerres,
    }
