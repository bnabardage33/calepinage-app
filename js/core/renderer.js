// ======================================
// CALEPINAGE PRO
// RENDERER.JS
// Gestion de l'affichage
// ======================================


class Renderer {


    static draw(engine) {


        const ctx = engine.ctx;


        // Nettoyage écran
        ctx.clearRect(
            0,
            0,
            engine.width,
            engine.height
        );


        // Fond
        ctx.fillStyle = "#2b3036";

        ctx.fillRect(
            0,
            0,
            engine.width,
            engine.height
        );



        // Application caméra
        ctx.save();


        ctx.translate(
            engine.camera.x,
            engine.camera.y
        );


        ctx.scale(
            engine.camera.zoom,
            engine.camera.zoom
        );



        // ==========================
        // Calques de dessin
        // ==========================


        // Grille
        Grid.draw(engine);



        // Objets du projet
        if(engine.objectManager){

            engine.objectManager.draw(engine);

        }



        // Fin transformation caméra
        ctx.restore();



        // Interface par dessus
        Renderer.drawOverlay(engine);


    }



    // ==============================
    // Affichage hors caméra
    // ==============================

    static drawOverlay(engine){


        const ctx = engine.ctx;


        // Curseur / informations
        ctx.fillStyle = "#ffffff";

        ctx.font = "14px Arial";


        ctx.fillText(

            "CALEPINAGE PRO",

            15,

            25

        );


    }



}
