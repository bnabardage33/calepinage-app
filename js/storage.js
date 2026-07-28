// ==========================================
// CALEPINAGE PRO V2
// STORAGE.JS
// Sauvegarde locale
// ==========================================

class Storage {

    constructor(state){

        this.state = state;

    }

    save(){

        localStorage.setItem(

            "calepinage-pro",

            JSON.stringify(this.state.getProject())

        );

        console.log("💾 Projet sauvegardé");

    }

    load(){

        const data = localStorage.getItem("calepinage-pro");

        if(!data) return;

        this.state.setProject(

            JSON.parse(data)

        );

        console.log("📂 Projet chargé");

    }

    clear(){

        localStorage.removeItem("calepinage-pro");

    }

}
