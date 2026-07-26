class Mouse {

    constructor(engine){

        this.engine = engine;

        this.drag = false;

        this.lastX = 0;
        this.lastY = 0;

        this.init();

    }

    init(){

        const canvas = this.engine.canvas;

        canvas.addEventListener("mousedown",(e)=>{

            if(e.button===1){

                this.drag=true;

                this.lastX=e.clientX;
                this.lastY=e.clientY;

            }

        });

        window.addEventListener("mouseup",()=>{

            this.drag=false;

        });

        canvas.addEventListener("mousemove",(e)=>{

            if(!this.drag) return;

            this.engine.camera.x +=
                e.clientX-this.lastX;

            this.engine.camera.y +=
                e.clientY-this.lastY;

            this.lastX=e.clientX;
            this.lastY=e.clientY;

        });

        canvas.addEventListener("wheel",(e)=>{

            e.preventDefault();

            if(e.deltaY<0){

                this.engine.camera.zoom*=1.10;

            }else{

                this.engine.camera.zoom*=0.90;

            }

            this.engine.camera.zoom=Math.max(

                this.engine.camera.minZoom,

                Math.min(

                    this.engine.camera.maxZoom,

                    this.engine.camera.zoom

                )

            );

        });

    }

}
