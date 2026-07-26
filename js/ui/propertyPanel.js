// ======================================
// CALEPINAGE PRO
// PROPERTY PANEL
// ======================================

class PropertyPanel {

    constructor(engine) {

        this.engine = engine;

        this.panel = document.getElementById("propertyPanel");

        this.update();

    }

    update() {

        if (!this.panel) return;

        const selected = this.engine.selection.selected;

        if (!selected) {

            this.panel.innerHTML = `
                <h3>Propriétés</h3>
                <p>Aucun objet sélectionné.</p>
            `;

            return;

        }

        this.panel.innerHTML = `
            <h3>Propriétés</h3>

            <p><strong>Type :</strong> ${selected.type}</p>

            <p><strong>Largeur :</strong> ${Math.round(selected.width)} mm</p>

            <p><strong>Hauteur :</strong> ${Math.round(selected.height)} mm</p>

            <p><strong>X :</strong> ${Math.round(selected.x)} mm</p>

            <p><strong>Y :</strong> ${Math.round(selected.y)} mm</p>
        `;

    }

}
