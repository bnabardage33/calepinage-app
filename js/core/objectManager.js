// ======================================
// CALEPINAGE PRO
// OBJECT MANAGER
// ======================================

class ObjectManager {

    constructor() {

        this.objects = [];

    }

    add(object) {

        this.objects.push(object);

    }

    remove(id) {

        this.objects = this.objects.filter(
            object => object.id !== id
        );

    }

    clear() {

        this.objects = [];

    }

    getAll() {

        return this.objects;

    }

    draw(engine) {

        this.objects.forEach(object => {

            if (typeof object.draw === "function") {

                object.draw(engine);

            }

        });

    }

}
