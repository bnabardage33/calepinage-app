// ======================================
// CALEPINAGE PRO
// SELECTION.JS
// Gestion sélection objets
// ======================================


class Selection {


    constructor(engine){


        this.engine = engine;


        this.selected = null;


        this.init();


    }





    init(){


        const canvas = this.engine.canvas;



        // PC + tactile
        canvas.addEventListener(
            "click",
            (e)=>{


                const rect =
                canvas.getBoundingClientRect();



                const x =
                e.clientX - rect.left;


                const y =
                e.clientY - rect.top;



                this.selectAt(
                    x,
                    y
                );


            }
        );



    }





    selectAt(screenX,screenY){



        const point =
        this.engine.camera.screenToWorld(
            screenX,
            screenY
        );



        let found = null;



        const objects =
        this.engine.objectManager.getAll();



        // Recherche objet sous le curseur
        for(
            let i = objects.length-1;
            i >= 0;
            i--
        ){


            const obj = objects[i];



            if(
                obj.contains &&
                obj.contains(
                    point.x,
                    point.y
                )
            ){

                found = obj;

                break;

            }


        }





        // Désélection ancienne

        if(this.selected){

            this.selected.selected = false;

        }



        // Nouvelle sélection

        this.selected = found;



        if(found){

            found.selected = true;

            console.log(
                "Objet sélectionné :",
                found.type
            );

        }


    }


}
