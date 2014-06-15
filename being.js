/*global Entity, ROT, XY, Game*/
var Being = function (visual) {
    "use strict";
    Entity.call(this, visual);

    this.dir = 0;
    this.range = 10;
    this.speed = 100;
    this.hp = 10;
    this.fov = [];
};
Being.extend(Entity);

Being.prototype.setDir = function (dir) {
    "use strict";
    this.dir = dir;
};

Being.prototype.getDir = function () {
    "use strict";
    return this.dir;
};

/**
 * Called by the Scheduler
 */
Being.prototype.getSpeed = function () {
    "use strict";
    return this.speed;
};

Being.prototype.damage = function (damage) {
    "use strict";
    this.hp -= damage;
    if (this.hp <= 0) {
        this.die();
    }
};

Being.prototype.act = function () {
    "use strict";
    /* FIXME */
    var direction = ROT.RNG.getUniformInt(0, 7),
        dir = ROT.DIRS[8][direction],
        xy = this.xy.plus(new XY(dir[0], dir[1]));

    switch (this.level.getEntityAt(xy).getVisual().ch) {
    case "#":
    case "e":
        break;
    case "@":
        Game.textBuffer.write("An entity attacks the player.");
        xy = this.xy;
        this.setDir(direction);
        break;
    default:
        this.level.setEntity(this, xy, direction); /* FIXME collision detection */
    }
};

Being.prototype.die = function () {
    "use strict";
    Game.scheduler.remove(this);
};

Being.prototype.setPosition = function (xy, level) {
    "use strict";
    /* came to a currently active level; add self to the scheduler */
    if (level !== this.level && level === Game.level) {
        Game.scheduler.add(this, true);
    }

    return Entity.prototype.setPosition.call(this, xy, level);
};

Being.prototype.computeFOV = function (x, y, range, visibility) {
    "use strict";
    this.fov.push(new XY(x, y));
};
