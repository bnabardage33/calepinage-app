// ==========================================
// CALEPINAGE PRO V2
// STATE.JS
// Gestion des données du projet
// ==========================================

class State {

    constructor() {

        // Projet courant
        this.project = {

            id: Date.now(),

            nom: "Nouveau projet",

            client: "",

            chantier: "",

            date: new Date(),

            facades: []

        };

    }

    // ==========================
    // FAÇADES
    // ==========================

    addFacade(facade) {

        this.project.facades.push(facade);

        console.log("✅ Façade ajoutée");

    }

    removeFacade(id) {

        this.project.facades = this.project.facades.filter(

            facade => facade.id !== id

        );

    }

    getFacade(id) {

        return this.project.facades.find(

            facade => facade.id === id

        );

    }

    getFacades() {

        return this.project.facades;

    }

    clearFacades() {

        this.project.facades = [];

    }

    // ==========================
    // PROJET
    // ==========================

    getProject() {

        return this.project;

    }

    setProject(project) {

        this.project = project;

    }

    newProject() {

        this.project = {

            id: Date.now(),

            nom: "Nouveau projet",

            client: "",

            chantier: "",

            date: new Date(),

            facades: []

        };

        console.log("📁 Nouveau projet créé");

    }

    // ==========================
    // STATISTIQUES
    // ==========================

    getTotalSurface() {

        let total = 0;

        this.project.facades.forEach(facade => {

            total += (facade.largeur * facade.hauteur);

        });

        return total;

    }

    getFacadeCount() {

        return this.project.facades.length;

    }

}
