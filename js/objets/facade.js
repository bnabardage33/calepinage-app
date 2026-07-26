// ======================================
// FACADE
// ======================================

class Facade {

    constructor(x, y, width, height) {

        this.id = crypto.randomUUID();

        this.type = "facade";

        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.color = "#5d8fc2";

        this.selected = false;

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

        ctx.strokeStyle = "#1b1b1b";

        ctx.lineWidth = 2 / engine.camera.zoom;

        ctx.strokeRect(

            this.x,

            this.y,

            this.width,

            this.height

        );

        if (this.selected) {

            ctx.strokeStyle = "#00b7ff";

            ctx.lineWidth = 3 / engine.camera.zoom;

            ctx.strokeRect(

                this.x,

                this.y,

                this.width,

                this.height

            );

        }

    }

    contains(x,y){


    return (

        x >= this.x &&

        x <= this.x + this.width &&

        y >= this.y &&

        y <= this.y + this.height

    );


}
