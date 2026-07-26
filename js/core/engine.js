// ======================================
// CALEPINAGE PRO
// ENGINE.JS
// Moteur principal du logiciel
// ======================================


class Engine {


    constructor(canvasId) {


        // Canvas principal
        this.canvas = document.getElementById(canvasId);

        if (!this.canvas) {

            console.error(
                "Canvas introuvable : " + canvasId
            );

            return;

        }


        this.ctx = this.canvas.getContext("2d");


        // Dimensions
        this.width = 0;
        this.height = 0;


        // Modules
        this.camera = null;
        this.mouse = null;
        this.objectManager = null;


        // Etat moteur
        this.running = false;
        this.lastTime = 0;


        console.log(
            "⚙️ Engine créé"
        );

    }



    // ==============================
    // Redimensionnement Canvas
    // ==============================

    resize() {


        this.width =
            this.canvas.parentElement.clientWidth;


        this.height =
            this.canvas.parentElement.clientHeight;


        this.canvas.width = this.width;

        this.canvas.height = this.height;


    }



    // ==============================
    // Démarrage moteur
    // ==============================

    start() {


        this.resize();


        window.addEventListener(
            "resize",
            () => {

                this.resize();

            }
        );


        this.running = true;


        this.loop();


        console.log(
            "🚀 Engine démarré"
        );

    }



    // ==============================
    // Boucle principale
    // ==============================

    loop(time = 0) {


        if (!this.running) return;



        const deltaTime =
            time - this.lastTime;


        this.lastTime = time;



        this.update(deltaTime);


        this.render();



        requestAnimationFrame(
            (t) => this.loop(t)
        );


    }



    // ==============================
    // Mise à jour logique
    // ==============================

    update(deltaTime) {


        // Ici viendront :
        // - outils
        // - déplacements objets
        // - animations
        // - calculs


    }



    // ==============================
    // Affichage
    // ==============================

    render() {

        Renderer.draw(this);

    }



    // ==============================
    // Arrêt moteur
    // ==============================

    stop() {


        this.running = false;


        console.log(
            "⛔ Engine arrêté"
        );

    }


}
