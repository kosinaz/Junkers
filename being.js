/*global Entity, ROT, XY*/
var Being = function (ch, level, scheduler, xy, dir) {
  "use strict";
  Entity.call(this, ch);

  this.level = level;
  this.scheduler = scheduler;
  this.scheduler.add(this, true);
  this.xy = xy || level.pickXY();
  this.dir = dir || ROT.RNG.getUniformInt(0, 7);
  this.range = 10;
  this.speed = 100;
  this.hp = 10;
  this.fov = {};
  this.discovered = {};
  this.target = null;
};
Being.extend(Entity);

Being.prototype.getCh = function () {
  "use strict";
  return this.ch.charAt(this.dir);
};

Being.prototype.setPosition = function (xy, level) {
  'use strict';
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
  if (!this.moveToTarget()) {
    this.target = this.level.emptySpaces.random();
  }
};

Being.prototype.die = function () {
  "use strict";
  this.scheduler.remove(this);
};

Being.prototype.computeFOV = function () {
  "use strict";
  var fov = {};
  this.level.rsc.compute180(this.xy.x, this.xy.y, this.range, this.dir, function (x, y, range, visibility) {
    var xy = new XY(x, y);
    if (this.level.light.hasOwnProperty(xy) || this.xy.dist8(xy) < 2) {
      fov[new XY(x, y)] = this.discovered[new XY(x, y)] = new XY(x, y);
    }
  }.bind(this));
  return fov;
};

Being.prototype.moveToTarget = function () {
  "use strict";
  if (!this.target) {
    return false;
  }
  this.computePath(this.target, this.onDiscovered);
  if (this.path.length === 0) {
    this.computePath(this.target, this.onUndiscovered);
  }
  if (this.path.length < 2) {
    return false;
  }
  if (this.level.setBeing(this, this.path[1], this.xy.dir8To(this.path[1]))) {
    return true;
  }
};

Being.prototype.onDiscovered = function (x, y) {
  "use strict";
  return this.discovered.hasOwnProperty(new XY(x, y)) &&
    this.level.map.hasOwnProperty(new XY(x, y));
};

Being.prototype.onUndiscovered = function (x, y) {
  "use strict";
  return !this.discovered.hasOwnProperty(new XY(x, y)) ||
    this.level.map.hasOwnProperty(new XY(x, y));
};

Being.prototype.computePath = function (xy, onMap) {
  "use strict";
  var astar = new ROT.Path.AStar(xy.x, xy.y, onMap.bind(this));
  this.path = [];
  astar.compute(this.xy.x, this.xy.y, function (x, y) {
    this.path.push(new XY(x, y));
  }.bind(this));
};
