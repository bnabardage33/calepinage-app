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

        engine.start();

        console.log("5");

    } catch (e) {

        alert(e.message);
        console.error(e);

    }

});
