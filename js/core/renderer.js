class Renderer {

    static draw(engine) {

        const ctx = engine.ctx;

        ctx.clearRect(
            0,
            0,
            engine.width,
            engine.height
        );

        Grid.draw(engine);

    }

}
