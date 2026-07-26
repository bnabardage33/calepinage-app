// ======================================
// CALEPINAGE PRO
// GRID.JS
// Grille de travail CAO
// ======================================


class Grid {


    static draw(engine) {


        const ctx = engine.ctx;

        const camera = engine.camera;


        // Taille réelle de la grille
        // 500 mm = 0,5 mètre
        let baseSize = 500;


        // Adaptation au zoom
        let size = baseSize * camera.zoom;



        // Si trop serré, on augmente
        while(size < 25){

            baseSize *= 2;

            size = baseSize * camera.zoom;

        }



        // Si trop espacé, on réduit
        while(size > 150){

            baseSize /= 2;

            size = baseSize * camera.zoom;

        }



        // Couleur grille
        ctx.strokeStyle = "#3a4148";
        ctx.lineWidth = 1 / camera.zoom;



        // Position départ
        const startX =
            (-camera.x / camera.zoom)
            % baseSize;


        const startY =
            (-camera.y / camera.zoom)
            % baseSize;



        // ==========================
        // Petites lignes
        // ==========================

        for(
            let x = startX;
            x < engine.width / camera.zoom;
            x += baseSize
        ){


            ctx.beginPath();

            ctx.moveTo(x, -camera.y / camera.zoom);

            ctx.lineTo(
                x,
                (-camera.y / camera.zoom)
                +
                engine.height / camera.zoom
            );

            ctx.stroke();


        }



        for(
            let y = startY;
            y < engine.height / camera.zoom;
            y += baseSize
        ){


            ctx.beginPath();

            ctx.moveTo(-camera.x / camera.zoom,y);

            ctx.lineTo(
                (-camera.x / camera.zoom)
                +
                engine.width / camera.zoom,
                y
            );

            ctx.stroke();


        }



        // ==========================
        // Axes principaux
        // ==========================


        ctx.lineWidth =
            2 / camera.zoom;



        // Axe vertical X=0

        ctx.strokeStyle="#e05a5a";

        ctx.beginPath();

        ctx.moveTo(0,-100000);

        ctx.lineTo(0,100000);

        ctx.stroke();



        // Axe horizontal Y=0

        ctx.strokeStyle="#5ae07a";

        ctx.beginPath();

        ctx.moveTo(-100000,0);

        ctx.lineTo(100000,0);

        ctx.stroke();



    }


}
