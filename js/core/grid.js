// ======================================
// CALEPINAGE PRO
// GRID.JS
// Version simple V1
// ======================================

class Grid {

    static draw(engine) {

        const ctx = engine.ctx;
        const camera = engine.camera;

        const gridSize = 50;

        ctx.strokeStyle = "#3f454d";
        ctx.lineWidth = 1 / camera.zoom;

        const startX = Math.floor((-camera.x / camera.zoom) / gridSize) * gridSize;
        const startY = Math.floor((-camera.y / camera.zoom) / gridSize) * gridSize;

        const endX = startX + engine.width / camera.zoom + gridSize;
        const endY = startY + engine.height / camera.zoom + gridSize;

        // Lignes verticales
        for (let x = startX; x <= endX; x += gridSize) {

            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
            ctx.stroke();

        }

        // Lignes horizontales
        for (let y = startY; y <= endY; y += gridSize) {

            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();

        }

        // Axe X
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2 / camera.zoom;

        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(endX, 0);
        ctx.stroke();

        // Axe Y
        ctx.strokeStyle = "#ff0000";

        ctx.beginPath();
        ctx.moveTo(0, startY);
        ctx.lineTo(0, endY);
        ctx.stroke();

    }

}
