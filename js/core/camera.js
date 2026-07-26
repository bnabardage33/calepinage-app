// ======================================
// CALEPINAGE PRO
// CAMERA.JS
// Gestion de la vue chantier
// ======================================


class Camera {


    constructor(){


        // Position écran
        this.x = 0;
        this.y = 0;


        // Niveau de zoom
        this.zoom = 1;


        // Limites
        this.minZoom = 0.05;
        this.maxZoom = 20;


    }



    // ==============================
    // Écran -> monde réel
    // ==============================

    screenToWorld(screenX, screenY){


        return {

            x:
            (screenX - this.x)
            /
            this.zoom,


            y:
            (screenY - this.y)
            /
            this.zoom

        };


    }



    // ==============================
    // Monde -> écran
    // ==============================

    worldToScreen(worldX, worldY){


        return {

            x:
            worldX * this.zoom
            +
            this.x,


            y:
            worldY * this.zoom
            +
            this.y

        };


    }



    // ==============================
    // Déplacement
    // ==============================

    move(dx,dy){


        this.x += dx;

        this.y += dy;


    }



    // ==============================
    // Zoom intelligent
    // ==============================

    zoomAt(mouseX, mouseY, factor){



        const before =
        this.screenToWorld(
            mouseX,
            mouseY
        );



        this.zoom *= factor;



        this.zoom =
        Math.max(
            this.minZoom,
            Math.min(
                this.maxZoom,
                this.zoom
            )
        );



        const after =
        this.screenToWorld(
            mouseX,
            mouseY
        );



        this.x +=
        (after.x - before.x)
        *
        this.zoom;



        this.y +=
        (after.y - before.y)
        *
        this.zoom;



    }


}
