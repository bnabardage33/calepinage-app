class Grid {

    static draw(engine) {

        const ctx = engine.ctx;

        const size = 50;

        ctx.strokeStyle = "#383d45";
        ctx.lineWidth = 1;

        for (
            let x = 0;
            x < engine.width;
            x += size
        ) {

            ctx.beginPath();

            ctx.moveTo(x, 0);
            ctx.lineTo(x, engine.height);

            ctx.stroke();

        }

        for (
            let y = 0;
            y < engine.height;
            y += size
        ) {

            ctx.beginPath();

            ctx.moveTo(0, y);
            ctx.lineTo(engine.width, y);

            ctx.stroke();

        }

    }

}
