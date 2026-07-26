// ======================================
// CALEPINAGE PRO
// FACADEFORM.JS
// Création de façade par saisie chantier
// ======================================

class FacadeForm {

    constructor(engine) {

        this.engine = engine;

        this.modal = document.getElementById("facadeFormModal");

        this.form = document.getElementById("facadeForm");

        this.errorBox = document.getElementById("facadeFormError");

        this.init();

    }


    // ==============================
    // Branchement des événements
    // ==============================

    init() {

        if (!this.modal || !this.form) {

            console.error(
                "FacadeForm : formulaire introuvable dans le DOM. " +
                "modal=" + !!this.modal + " form=" + !!this.form
            );

            return;

        }

        // Bouton "+ Nouvelle façade"
        const openBtn = document.getElementById("newFacadeBtn");

        console.log("FacadeForm : bouton newFacadeBtn trouvé =", !!openBtn);

        if (openBtn) {

            openBtn.addEventListener("click", () => {

                console.log("FacadeForm : clic détecté sur newFacadeBtn");

                this.open();

            });

        }

        // Bouton "Annuler" / fermeture
        const cancelBtn = document.getElementById("facadeFormCancel");

        if (cancelBtn) {

            cancelBtn.addEventListener("click", () => this.close());

        }

        // Fermeture au clic sur l'arrière-plan du modal
        this.modal.addEventListener("click", (e) => {

            if (e.target === this.modal) {

                this.close();

            }

        });

        // Soumission du formulaire
        this.form.addEventListener("submit", (e) => {

            e.preventDefault();

            this.handleSubmit();

        });

    }


    // ==============================
    // Ouverture / fermeture
    // ==============================

    open() {

        this.clearError();

        this.form.reset();

        this.modal.hidden = false;

        // Focus direct sur le premier champ (confort mobile)
        const firstField = document.getElementById("facadeName");

        if (firstField) firstField.focus();

    }

    close() {

        this.modal.hidden = true;

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

        this.close();

    }

}
