class Renderer {

    static draw(engine);
    
    engine.objectManager.draw(engine);
    
    const ctx = engine.ctx;

    ctx.clearRect(
        0,
        0,
        engine.width,
        engine.height
    );

    ctx.save();

    ctx.translate(
        engine.camera.x,
        engine.camera.y
    );

    ctx.scale(
        engine.camera.zoom,
        engine.camera.zoom
    );

    Grid.draw(engine);

    ctx.restore();

}
