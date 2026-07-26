// =============================================
// CALEPINAGE PRO
// ENGINE V1
// =============================================

class Engine {

    constructor(canvasId) {

        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.width = 0;
        this.height = 0;

        this.camera = new Camera();

        this.mouse = {
            x: 0,
            y: 0,
            worldX: 0,
            worldY: 0,
            left: false,
            middle: false,
            right: false
        };

        this.objects = [];

        this.running = false;

    }

    resize() {

        this.width = this.canvas.parentElement.clientWidth;
        this.height = this.canvas.parentElement.clientHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

    }

    start() {

        this.mouse = new Mouse(this);
        
        this.running = true;

        this.resize();

        window.addEventListener("resize", () => this.resize());

        this.loop();

    }

    loop() {

        if (!this.running) return;

        Renderer.draw(this);

        requestAnimationFrame(() => this.loop());

    }

}
