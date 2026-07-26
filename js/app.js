// ======================================
// CALEPINAGE PRO
// APP.JS
// Point d'entrée du logiciel
// ======================================

let engine;

window.addEventListener("DOMContentLoaded", () => {

    engine = new Engine("canvas");

    engine.camera = new Camera();

    engine.objectManager = new ObjectManager();

    engine.start();

});
