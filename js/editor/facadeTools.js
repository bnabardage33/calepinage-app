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

            this.engine.objectManager.add(

                new Facade(

                    Math.min(this.startX, p.x),

                    Math.min(this.startY, p.y),

                    Math.abs(p.x - this.startX),

                    Math.abs(p.y - this.startY)

                )

            );

        });

    }

}
