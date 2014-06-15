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
        fg: "#444"
    });
};

Level.prototype.setEntity = function (entity, xy, dir) {
    "use strict";
    /* FIXME remove from old position, draw */
    if (entity.level === this) {
        delete this.beings[entity.xy];
    }
    if (xy === undefined) {
        xy = this.emptySpaces.splice(ROT.RNG.getUniformInt(0, this.emptySpaces.length), 1)[0];
    }
    if (dir === undefined) {
        dir = ROT.RNG.getUniformInt(0, 7);
    }
    entity.setPosition(xy, this); /* propagate position data to the entity itself */

    /* FIXME set new position, draw */
    this.beings[xy] = entity;
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
    var cellular = new ROT.Map.Cellular(this.size.x, this.size.y, {
        connected: true
    });
    cellular.randomize(0.5);
    cellular.create(function (x, y, value) {
        if (value) {
            return;
        }
        var xy = new XY(x, y);
        this.map[xy] = new Entity({
            ch: ".",
            fg: "#888"
        });
        this.emptySpaces.push(xy);
    }.bind(this));
};
