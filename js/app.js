let engine = null;

window.addEventListener("DOMContentLoaded", () => {

    try {

        console.log("1");

        engine = new Engine("canvas");

        console.log("2");

        engine.camera = new Camera();

        console.log("3");

        engine.objectManager = new ObjectManager();

        console.log("4");

        // Gestion des entrées (souris / tactile)
        engine.mouse = new Mouse(engine);
        engine.touch = new Touch(engine);

        // Outils d'édition
        engine.facadeTool = new FacadeTool(engine);

        console.log("4b - modules d'entrée branchés");

        engine.start();

        console.log("5");

    } catch (e) {

        alert(e.message);
        console.error(e);

    }

});
