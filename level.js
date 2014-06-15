/*global XY, Entity, ROT*/
var Level = function () {
    "use strict";
    /* FIXME data structure for storing entities */
    this.beings = {};

    /* FIXME map data */
    this.size = new XY(80, 25);
    this.map = {};
    this.emptySpaces = [];

    this.wall = new Entity({
        ch: "#",
        fg: "#444",
        bg: null
    });
};

Level.prototype.getSize = function () {
    "use strict";
    return this.size;
};

Level.prototype.setEntity = function (entity, xy, direction) {
    "use strict";
    /* FIXME remove from old position, draw */
    if (entity.getLevel() === this) {
        delete this.beings[entity.getXY()];
    }

    entity.setPosition(xy, this); /* propagate position data to the entity itself */

    /* FIXME set new position, draw */
    this.beings[xy] = entity;
    if (entity.getVisual().d) {
        entity.setDir(direction);
    }
};

Level.prototype.getEntityAt = function (xy) {
    "use strict";
    return this.beings[xy] || this.map[xy] || this.wall;
};

Level.prototype.getBeings = function () {
    "use strict";
    /* FIXME list of all beings */
    return this.beings;
};

Level.prototype.build = function () {
    "use strict";
    var cellular = new ROT.Map.Cellular(this.getSize().x, this.getSize().y, {
        connected: true
    });
    cellular.randomize(0.5);
    cellular.create(this.storeSpaces.bind(this));
};

Level.prototype.storeSpaces = function (x, y, value) {
    "use strict";
    if (value) {
        return;
    }
    var xy = new XY(x, y);
    this.map[xy] = new Entity({
        ch: ".",
        fg: "#888",
        bg: null
    });
    this.emptySpaces.push(xy);
};

Level.prototype.pickSpace = function () {
    "use strict";
    return this.emptySpaces.splice(ROT.RNG.getUniformInt(0, this.emptySpaces.length), 1)[0];
};
