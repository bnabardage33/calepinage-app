// ======================================
// CALEPINAGE PRO
// TOUCH.JS
// Gestion tactile mobile/tablette
// ======================================


class Touch {


    constructor(engine){


        this.engine = engine;

        this.canvas = engine.canvas;


        this.touches = [];


        this.lastDistance = null;


        this.dragging = false;


        this.lastX = 0;
        this.lastY = 0;



        this.init();

    }




    init(){



        // Début tactile

        this.canvas.addEventListener(
            "touchstart",
            (e)=>{


                e.preventDefault();


                this.touches =
                e.touches;



                // Un doigt = déplacement caméra
                // (sauf si un outil de dessin est actif,
                //  auquel cas c'est FacadeTool qui gère le geste)

                if(e.touches.length === 1 && Tools.current === "select"){


                    this.dragging = true;


                    this.lastX =
                    e.touches[0].clientX;


                    this.lastY =
                    e.touches[0].clientY;


                }



                // Deux doigts = zoom

                if(e.touches.length === 2){


                    this.lastDistance =
                    this.distance(
                        e.touches[0],
                        e.touches[1]
                    );


                }


            },
            {
                passive:false
            }
        );





        // Mouvement tactile

        this.canvas.addEventListener(
            "touchmove",
            (e)=>{


                e.preventDefault();



                // Déplacement 1 doigt (caméra)

                if(e.touches.length === 1 &&
                   this.dragging &&
                   Tools.current === "select"){



                    const dx =
                    e.touches[0].clientX
                    -
                    this.lastX;



                    const dy =
                    e.touches[0].clientY
                    -
                    this.lastY;



                    this.engine.camera.move(
                        dx,
                        dy
                    );



                    this.lastX =
                    e.touches[0].clientX;



                    this.lastY =
                    e.touches[0].clientY;


                }




                // Zoom 2 doigts

                if(e.touches.length === 2){



                    const distance =
                    this.distance(
                        e.touches[0],
                        e.touches[1]
                    );



                    if(this.lastDistance){



                        const delta =
                        distance -
                        this.lastDistance;



                        const rect =
                        this.canvas.getBoundingClientRect();



                        const centerX =
                        (
                            e.touches[0].clientX
                            +
                            e.touches[1].clientX
                        )
                        /2
                        -
                        rect.left;



                        const centerY =
                        (
                            e.touches[0].clientY
                            +
                            e.touches[1].clientY
                        )
                        /2
                        -
                        rect.top;




                        if(delta > 0){


                            this.engine.camera.zoomAt(
                                centerX,
                                centerY,
                                1.05
                            );


                        }
                        else{


                            this.engine.camera.zoomAt(
                                centerX,
                                centerY,
                                0.95
                            );


                        }


                    }



                    this.lastDistance =
                    distance;


                }



            },
            {
                passive:false
            }
        );





        // Fin tactile

        this.canvas.addEventListener(
            "touchend",
            ()=>{


                this.dragging = false;


                this.lastDistance = null;


            }
        );



    }





    distance(a,b){


        const dx =
        a.clientX - b.clientX;


        const dy =
        a.clientY - b.clientY;



        return Math.sqrt(
            dx*dx +
            dy*dy
        );


    }



}
