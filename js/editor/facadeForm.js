// ======================================
// CALEPINAGE PRO
// FACADEFORM.JS
// Création de façade par saisie chantier
// (formulaire fixe, toujours visible — pas de modal)
// ======================================

class FacadeForm {

    constructor(engine) {

        this.engine = engine;

        this.form = document.getElementById("facadeForm");

        this.errorBox = document.getElementById("facadeFormError");

        this.init();

    }


    // ==============================
    // Branchement des événements
    // ==============================

    init() {

        if (!this.form) {

            console.error("FacadeForm : formulaire #facadeForm introuvable dans le DOM");

            return;

        }

        this.form.addEventListener("submit", (e) => {

            e.preventDefault();

            this.handleSubmit();

        });

    }


    // ==============================
    // Lecture + validation des champs
    // ==============================

    readFormData() {

        const name = document.getElementById("facadeName").value.trim();

        const width = parseFloat(document.getElementById("facadeWidth").value);

        const height = parseFloat(document.getElementById("facadeHeight").value);

        const cladding = document.getElementById("facadeCladding").value;

        const orientation = document.getElementById("facadeOrientation").value;

        return { name, width, height, cladding, orientation };

    }

    validate(data) {

        if (!data.name) {

            return "Le nom de la façade est obligatoire.";

        }

        if (!Number.isFinite(data.width) || data.width <= 0) {

            return "La largeur doit être un nombre supérieur à 0.";

        }

        if (!Number.isFinite(data.height) || data.height <= 0) {

            return "La hauteur doit être un nombre supérieur à 0.";

        }

        if (data.width > 100000 || data.height > 100000) {

            return "Dimension trop grande (max 100 000 mm).";

        }

        return null;

    }

    showError(message) {

        if (!this.errorBox) return;

        this.errorBox.textContent = message;

        this.errorBox.hidden = false;

    }

    clearError() {

        if (!this.errorBox) return;

        this.errorBox.textContent = "";

        this.errorBox.hidden = true;

    }


    // ==============================
    // Soumission
    // ==============================

    handleSubmit() {

        this.clearError();

        const data = this.readFormData();

        const error = this.validate(data);

        if (error) {

            this.showError(error);

            return;

        }

        // Création de l'objet métier (logique centralisée dans facade.js)
        const facade = Facade.fromFormData(data, this.engine);

        this.engine.objectManager.add(facade);

        // Recadrage automatique de la caméra sur la façade créée,
        // pour garantir sa visibilité quelle que soit sa taille
        this.fitCameraToFacade(facade);

        // Le formulaire reste affiché (pas de fermeture) :
        // on vide juste les champs pour permettre une nouvelle saisie
        this.form.reset();

    }


    // ==============================
    // Cadrage caméra sur un objet
    // ==============================

    fitCameraToFacade(facade) {

        const camera = this.engine.camera;

        const engine = this.engine;

        // La façade occupera environ 70% de la vue visible
        const margin = 0.7;

        const zoomX = (engine.width * margin) / facade.width;

        const zoomY = (engine.height * margin) / facade.height;

        let zoom = Math.min(zoomX, zoomY);

        zoom = Math.max(camera.minZoom, Math.min(camera.maxZoom, zoom));

        camera.zoom = zoom;

        const facadeCenterX = facade.x + facade.width / 2;

        const facadeCenterY = facade.y + facade.height / 2;

        camera.x = engine.width / 2 - facadeCenterX * zoom;

        camera.y = engine.height / 2 - facadeCenterY * zoom;

    }

}
