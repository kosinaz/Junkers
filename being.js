/*global Entity, ROT, XY, GAME*/
var Being = function (ch, level, scheduler, xy, dir) {
  "use strict";
  Entity.call(this, ch);

  this.level = level;
  this.xy = xy || level.pickXY();
  this.dir = dir || ROT.RNG.getUniformInt(0, 7);
  this.range = 10;
  this.speed = 100;
  this.hp = 10;
  this.fov = {};
  this.target = null;
  scheduler.add(this, true);
};
Being.extend(Entity);

Being.prototype.getCh = function () {
  "use strict";
  return this.ch.charAt(this.dir);
};

Being.prototype.setPosition = function (xy, level) {
  'use strict';
  if (level !== this.level && level === GAME.level) {
    GAME.scheduler.add(this, true);
  }
  this.xy = xy;
  this.level = level || this.level;
  return this;
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
  this.level.setBeing(this, this.xy.plus(new XY(ROT.DIRS[8][dir][0], ROT.DIRS[8][dir][1])), dir);
};

Being.prototype.die = function () {
  "use strict";
  GAME.scheduler.remove(this);
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
