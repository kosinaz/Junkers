/*global Entity, ROT, XY, Game*/
var Being = function (visual) {
    "use strict";
    Entity.call(this, visual);

    this.dir = 0;
    this.range = 10;
    this.speed = 100;
    this.hp = 10;
    this.fov = [];
    this.minfov = [];
};
Being.extend(Entity);

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
    this.dir = ROT.RNG.getUniformInt(0, 7);
    if (ROT.RNG.getUniformInt(0, 1)) {
        this.moveTo(this.xy.plus(new XY(ROT.DIRS[8][this.dir][0], ROT.DIRS[8][this.dir][1])));
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

Being.prototype.moveTo = function (xy) {
    "use strict";
    if (this.level.beings.hasOwnProperty(xy)) {
        Game.textBuffer.write("An entity attacks.");
    } else if (this.level.map.hasOwnProperty(xy)) {
        this.level.setEntity(this, xy);
    }
};

Being.prototype.computeFOV = function () {
    "use strict";
    this.fov = [];
    Game.rsc.compute180(this.xy.x, this.xy.y, this.range, this.dir, function (x, y, range, visibility) {
        this.fov.push(new XY(x, y));
    }.bind(this));
    this.minfov = [];
    Game.rsc.compute180(this.xy.x, this.xy.y, 1, this.dir, function (x, y, range, visibility) {
        this.minfov.push(new XY(x, y));
    }.bind(this));
};
