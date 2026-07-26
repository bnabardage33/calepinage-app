// ======================================
// GENERATEUR DE CALEPINAGE
// ======================================

class CalepinageGenerator {

    static generate(facade) {

        facade.panels = [];

        let x = 0;

        while (x < facade.width) {

            let largeur = facade.panelWidth;

            if (x + largeur > facade.width) {

                largeur = facade.width - x;

            }

            facade.panels.push({

                x: x,

                y: 0,

                width: largeur,

                height: facade.height

            });

            x += facade.panelWidth;

        }

    }

}
