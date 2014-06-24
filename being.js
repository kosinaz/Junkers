/*global Entity, ROT, XY, GAME*/
var Being = function (ch) {
  "use strict";
  Entity.call(this, ch);

  this.dir = 0;
  this.range = 10;
  this.speed = 100;
  this.hp = 10;
  this.fov = {};
  this.target = null;
};
Being.extend(Entity);

Being.prototype.getCh = function () {
  "use strict";
  return this.ch.charAt(this.dir);
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
  var dir = ROT.RNG.getUniformInt(0, 7);
  this.level.setEntity(this, this.xy.plus(new XY(ROT.DIRS[8][dir][0], ROT.DIRS[8][dir][1])), dir);
};

Being.prototype.die = function () {
  "use strict";
  GAME.scheduler.remove(this);
};

Being.prototype.setPosition = function (xy, level) {
  "use strict";
  /* came to a currently active level; add self to the scheduler */
  if (level !== this.level && level === GAME.level) {
    GAME.scheduler.add(this, true);
  }

  return Entity.prototype.setPosition.call(this, xy, level);
};

Being.prototype.computeFOV = function () {
  "use strict";
  var fov = {};
  this.level.rsc.compute180(this.xy.x, this.xy.y, this.range, this.dir, function (x, y, range, visibility) {
    var xy = new XY(x, y);
    if (this.level.light.hasOwnProperty(xy) || this.xy.dist8(xy) < 2) {
      fov[new XY(x, y)] = new XY(x, y);
    }
  }.bind(this));
  return fov;
};
