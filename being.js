var Being = function (visual) {
    Entity.call(this, visual);

    this._dir = 0;
    this._range = 10;
    this._speed = 100;
    this._hp = 10;
    this._fov = [];
}
Being.extend(Entity);

Being.prototype.setDir = function (dir) {
    this._dir = dir;
}

Being.prototype.getDir = function () {
    return this._dir;
}

/**
 * Called by the Scheduler
 */
Being.prototype.getSpeed = function () {
    return this._speed;
}

Being.prototype.damage = function (damage) {
    this._hp -= damage;
    if (this._hp <= 0) {
        this.die();
    }
}

Being.prototype.act = function () {
    /* FIXME */
    var direction = ROT.RNG.getUniformInt(0, 7);
    var dir = ROT.DIRS[8][direction];
    var xy = this._xy.plus(new XY(dir[0], dir[1]));

    switch (this._level.getEntityAt(xy).getVisual().ch) {
    case "#":
    case "e":
        break;
    case "@":
        Game.textBuffer.write("An entity attacks the player.");
        xy = this._xy;
    default:
        this._level.setEntity(this, xy, direction); /* FIXME collision detection */
    }
}

Being.prototype.die = function () {
    Game.scheduler.remove(this);
}

Being.prototype.setPosition = function (xy, level) {
    /* came to a currently active level; add self to the scheduler */
    if (level != this._level && level == Game.level) {
        Game.scheduler.add(this, true);
    }

    return Entity.prototype.setPosition.call(this, xy, level);
}

Being.prototype._computeFOV = function (x, y, range, visibility) {
    this._fov.push(new XY(x, y));
}
