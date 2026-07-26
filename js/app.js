// ======================================
// CALEPINAGE PRO
// APP.JS
// Point d'entrée du logiciel
// ======================================

let engine = null;

window.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Démarrage Calepinage Pro");

    // Création du moteur
    engine = new Engine("canvas");

    // Modules principaux
    engine.camera = new Camera();
    engine.objectManager = new ObjectManager();

    // Gestion des entrées
    if ("ontouchstart" in window && typeof Touch !== "undefined") {

        engine.touch = new Touch(engine);

    } else if (typeof Mouse !== "undefined") {

        engine.mouse = new Mouse(engine);

    }

    // Sélection
    if (typeof Selection !== "undefined") {

        engine.selection = new Selection(engine);

    }

    // Outil façade
    if (typeof FacadeTool !== "undefined") {

        engine.facadeTool = new FacadeTool(engine);

    }

    // Démarrage
    engine.start();

    console.log("✅ Calepinage Pro prêt");

});
