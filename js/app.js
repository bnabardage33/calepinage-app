// ======================================
// CALEPINAGE PRO
// APP.JS
// Point d'entrée du logiciel
// ======================================


let engine = null;


window.addEventListener("DOMContentLoaded", () => {


    console.log("🚀 Démarrage Calepinage Pro");


    // Création du moteur principal
    engine = new Engine("canvas");


    // Initialisation caméra
    engine.camera = new Camera();


    // Gestionnaire des objets
    engine.objectManager = new ObjectManager();


    // Gestion souris
    if ("ontouchstart" in window) {

    engine.touch = new Touch(engine);

}
else {

    engine.mouse = new Mouse(engine);

}


    // Outil façade
    engine.facadeTool = new FacadeTool(engine);


    // Démarrage moteur
    engine.start();


    console.log("✅ Calepinage Pro prêt");


});
