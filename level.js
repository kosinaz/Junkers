var Level = function () {
    /* FIXME data structure for storing entities */
    this._beings = {};

    /* FIXME map data */
    this._size = new XY(80, 25);
    this._map = {};
    this._emptySpaces = [];

    this._wall = new Entity({
        ch: "#",
        fg: "#444",
        bg: null
    });
}

Level.prototype.getSize = function () {
    return this._size;
}

Level.prototype.setEntity = function (entity, xy, direction) {
    /* FIXME remove from old position, draw */
    if (entity.getLevel() == this) {
        delete this._beings[entity.getXY()];
    }

    entity.setPosition(xy, this); /* propagate position data to the entity itself */

    /* FIXME set new position, draw */
    this._beings[xy] = entity;
    if (entity.getVisual().d) entity.setDir(direction);
}

Level.prototype.getEntityAt = function (xy) {
    return this._beings[xy] || this._map[xy] || this._wall;
}

Level.prototype.getBeings = function () {
    /* FIXME list of all beings */
    return this._beings;
}

Level.prototype.build = function () {
    var cellular = new ROT.Map.Cellular(this.getSize().x, this.getSize().y, {
        connected: true
    });
    cellular.randomize(0.5);
    cellular.create(this._storeSpaces.bind(this));
}

Level.prototype._storeSpaces = function (x, y, value) {
    if (value) return;
    var xy = new XY(x, y);
    this._map[xy] = new Entity({
        ch: ".",
        fg: "#888",
        bg: null
    });
    this._emptySpaces.push(xy);
}

Level.prototype.pickSpace = function () {
    return this._emptySpaces.splice(ROT.RNG.getUniformInt(0, this._emptySpaces.length), 1)[0];
}
