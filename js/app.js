// ==========================================
// CALEPINAGE PRO V2
// APP.JS
// Point d'entrée de l'application
// ==========================================

let app = {};

window.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Calepinage Pro V2");

    // ==========================
    // Initialisation
    // ==========================

    app.state = new State();

    app.storage = new Storage(app.state);

    app.canvas = new CanvasManager(
        document.getElementById("canvas"),
        app.state
    );

    app.dashboard = new Dashboard(app);

    app.notifications = new Notifications();

    // ==========================
    // Boutons principaux
    // ==========================

    document
        .getElementById("newFacadeBtn")
        .addEventListener("click", openFacadeModal);

    document
        .getElementById("cancelFacade")
        .addEventListener("click", closeFacadeModal);

    document
        .getElementById("facadeForm")
        .addEventListener("submit", createFacade);

    console.log("✅ Application prête");

});


// ==========================================
// OUVERTURE MODAL
// ==========================================

function openFacadeModal(){

    document
        .getElementById("facadeModal")
        .classList.add("open");

}


// ==========================================
// FERMETURE MODAL
// ==========================================

function closeFacadeModal(){

    document
        .getElementById("facadeModal")
        .classList.remove("open");

    document
        .getElementById("facadeForm")
        .reset();

}


// ==========================================
// CREATION FACADE
// ==========================================

function createFacade(e){

    e.preventDefault();

    const facade = {

        id: Date.now(),

        nom:
            document.getElementById("facadeName").value,

        largeur:
            Number(document.getElementById("facadeWidth").value),

        hauteur:
            Number(document.getElementById("facadeHeight").value),

        type:
            document.getElementById("facadeType").value,

        pose:
            document.getElementById("facadePose").value,

        ouvertures:[]

    };

    app.state.addFacade(facade);

    app.canvas.draw();

    closeFacadeModal();

    console.log("Façade créée :", facade);

}
