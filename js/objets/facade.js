// ======================================
// CALEPINAGE PRO
// FACADE.JS
// Objet métier Bardage
// ======================================

class Facade {

    constructor(x, y, width, height) {

        this.id = crypto.randomUUID();

        this.type = "facade";

        // Géométrie
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Affichage
        this.color = "#5D8FC2";
        this.selected = false;

        // ==========================
        // Métier Bardage
        // ==========================

        this.name = "Nouvelle façade";

        this.manufacturer = "";

        this.cladding = "";

        this.orientation = "Vertical";

        this.support = "Acier";

        this.insulation = "";

        this.panelWidth = 1000;

        this.panelHeight = 0;

        this.joint = 20;

        this.finishings = [];

        this.openings = [];

        this.panels = [];

    }

    draw(engine) {

        const ctx = engine.ctx;

        ctx.fillStyle = this.color;

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        ctx.strokeStyle = "#1A1A1A";
        ctx.lineWidth = 2 / engine.camera.zoom;

        ctx.strokeRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        if (this.selected) {

            ctx.strokeStyle = "#00BFFF";
            ctx.lineWidth = 3 / engine.camera.zoom;

            ctx.strokeRect(
                this.x,
                this.y,
                this.width,
                this.height
            );

        }

    }

    contains(x, y) {

        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );

    }

}
