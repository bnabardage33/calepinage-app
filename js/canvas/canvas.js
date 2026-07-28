// ==========================================
// CALEPINAGE PRO V2
// CANVAS.JS
// Gestion du dessin
// ==========================================

class CanvasManager {

    constructor(canvas, state) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.state = state;

        this.resize();

        window.addEventListener("resize", () => this.resize());

    }

    // ==========================
    // Taille du canvas
    // ==========================

    resize() {

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.draw();

    }

    // ==========================
    // Dessin complet
    // ==========================

    draw() {

        const ctx = this.ctx;

        // Fond
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.fillStyle = "#272d33";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grille
        this.drawGrid();

        // Façades
        this.drawFacades();

    }

    // ==========================
    // Grille
    // ==========================

    drawGrid() {

        const ctx = this.ctx;

        const pas = 50;

        ctx.strokeStyle = "#3d4650";
        ctx.lineWidth = 1;

        for(let x = 0; x < this.canvas.width; x += pas){

            ctx.beginPath();
            ctx.moveTo(x,0);
            ctx.lineTo(x,this.canvas.height);
            ctx.stroke();

        }

        for(let y = 0; y < this.canvas.height; y += pas){

            ctx.beginPath();
            ctx.moveTo(0,y);
            ctx.lineTo(this.canvas.width,y);
            ctx.stroke();

        }

    }

    // ==========================
    // Dessin des façades
    // ==========================

    drawFacades() {

        const ctx = this.ctx;

        const facades = this.state.getFacades();

        let y = 80;

        facades.forEach(facade => {

            const largeur = facade.largeur / 50;
            const hauteur = facade.hauteur / 50;

            ctx.fillStyle = "#4A90D9";
            ctx.fillRect(100, y, largeur, hauteur);

            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            ctx.strokeRect(100, y, largeur, hauteur);

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "14px Arial";
            ctx.fillText(facade.nom, 110, y - 10);

            y += hauteur + 40;

        });

    }

}
