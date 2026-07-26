class Tools{

    static current="select";

    static set(tool){

        this.current=tool;

        console.log("Outil actif :", tool);

    }

    // ==============================
    // Branchement des boutons UI
    // ==============================

    static init(){

        const buttons = document.querySelectorAll("[data-tool]");

        buttons.forEach((btn) => {

            btn.addEventListener("click", () => {

                Tools.set(btn.dataset.tool);

            });

        });

    }

}

window.addEventListener("DOMContentLoaded", () => {

    Tools.init();

});
