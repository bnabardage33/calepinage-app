// ======================================
// CALEPINAGE PRO
// MOUSE.JS
// Gestion souris PC
// ======================================


class Mouse {


    constructor(engine){

        this.engine = engine;

        this.canvas = engine.canvas;

        this.dragging = false;

        this.lastX = 0;
        this.lastY = 0;


        this.init();

    }



    init(){


        // Déplacement avec clic molette

        this.canvas.addEventListener(
            "mousedown",
            (e)=>{


                if(e.button === 1){

                    this.dragging = true;


                    this.lastX = e.clientX;
                    this.lastY = e.clientY;


                }


            }
        );



        window.addEventListener(
            "mouseup",
            ()=>{

                this.dragging = false;

            }
        );



        // Déplacement caméra

        this.canvas.addEventListener(
            "mousemove",
            (e)=>{


                if(!this.dragging) return;



                const dx =
                e.clientX - this.lastX;


                const dy =
                e.clientY - this.lastY;



                this.engine.camera.move(
                    dx,
                    dy
                );



                this.lastX = e.clientX;
                this.lastY = e.clientY;


            }
        );



        // Zoom souris

        this.canvas.addEventListener(
            "wheel",
            (e)=>{


                e.preventDefault();



                const rect =
                this.canvas.getBoundingClientRect();



                const x =
                e.clientX - rect.left;


                const y =
                e.clientY - rect.top;



                if(e.deltaY < 0){


                    this.engine.camera.zoomAt(
                        x,
                        y,
                        1.10
                    );


                }
                else{


                    this.engine.camera.zoomAt(
                        x,
                        y,
                        0.90
                    );


                }


            },
            {
                passive:false
            }
        );


    }


}
