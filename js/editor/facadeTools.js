class FacadeTool {

    constructor(engine) {

        this.engine = engine;

        this.startX = 0;
        this.startY = 0;

        this.drawing = false;

        this.init();

    }

    init() {

        const canvas = this.engine.canvas;

        canvas.addEventListener("mousedown", (e) => {

            if (Tools.current !== "facade") return;

            if (e.button !== 0) return;

            const p = this.engine.camera.screenToWorld(

                e.offsetX,

                e.offsetY

            );

            this.startX = p.x;
            this.startY = p.y;

            this.drawing = true;

        });

        canvas.addEventListener("mouseup", (e) => {

            if (!this.drawing) return;

            this.drawing = false;

            const p = this.engine.camera.screenToWorld(

                e.offsetX,

                e.offsetY

            );

            this.createFacade(p);

        });


        // ==========================
        // Support tactile (mobile)
        // ==========================

        canvas.addEventListener("touchstart", (e) => {

            if (Tools.current !== "facade") return;

            if (e.touches.length !== 1) return;

            const rect = canvas.getBoundingClientRect();

            const touch = e.touches[0];

            const p = this.engine.camera.screenToWorld(
                touch.clientX - rect.left,
                touch.clientY - rect.top
            );

            this.startX = p.x;
            this.startY = p.y;

            this.drawing = true;

        }, { passive: true });


        canvas.addEventListener("touchend", (e) => {

            if (!this.drawing) return;

            if (Tools.current !== "facade") return;

            this.drawing = false;

            const rect = canvas.getBoundingClientRect();

            // changedTouches car touches est vide au relâchement
            const touch = e.changedTouches[0];

            const p = this.engine.camera.screenToWorld(
                touch.clientX - rect.left,
                touch.clientY - rect.top
            );

            this.createFacade(p);

        });

    }


    // ==============================
    // Création effective de la façade
    // ==============================

    createFacade(p) {

        this.engine.objectManager.add(

            new Facade(

                Math.min(this.startX, p.x),

                Math.min(this.startY, p.y),

                Math.abs(p.x - this.startX),

                Math.abs(p.y - this.startY)

            )

        );

    }

}
