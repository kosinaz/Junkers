/*global Being, ROT, GAME, XY*/
var Player = function (ch, level, scheduler, xy, dir) {
  "use strict";
  Being.call(this, ch, level, scheduler, xy, dir);
  this.keys = {};
  this.keys[ROT.VK_K] = 0;
  this.keys[ROT.VK_UP] = 0;
  this.keys[ROT.VK_NUMPAD8] = 0;
  this.keys[ROT.VK_U] = 1;
  this.keys[ROT.VK_NUMPAD9] = 1;
  this.keys[ROT.VK_L] = 2;
  this.keys[ROT.VK_RIGHT] = 2;
  this.keys[ROT.VK_NUMPAD6] = 2;
  this.keys[ROT.VK_N] = 3;
  this.keys[ROT.VK_NUMPAD3] = 3;
  this.keys[ROT.VK_J] = 4;
  this.keys[ROT.VK_DOWN] = 4;
  this.keys[ROT.VK_NUMPAD2] = 4;
  this.keys[ROT.VK_B] = 5;
  this.keys[ROT.VK_NUMPAD1] = 5;
  this.keys[ROT.VK_H] = 6;
  this.keys[ROT.VK_LEFT] = 6;
  this.keys[ROT.VK_NUMPAD4] = 6;
  this.keys[ROT.VK_Y] = 7;
  this.keys[ROT.VK_NUMPAD7] = 7;

  this.keys[ROT.VK_PERIOD] = -1;
  this.keys[ROT.VK_CLEAR] = -1;
  this.keys[ROT.VK_NUMPAD5] = -1;
  this.mouseDown = false;
  window.addEventListener("keydown", this);
  window.addEventListener("mousedown", this);
  window.addEventListener("mouseup", this);
};
Player.extend(Being);

Player.prototype.act = function () {
  "use strict";
  var i;
  this.level.visible = this.computeFOV();
  for (i in this.fov) {
    if (this.fov.hasOwnProperty(i)) {
      if (!this.level.visible.hasOwnProperty(i)) {
        this.level.draw(this.fov[i]);
      }
    }
  }
  for (i in this.level.visible) {
    if (this.level.visible.hasOwnProperty(i)) {
      if (!this.fov.hasOwnProperty(i)) {
        this.level.draw(this.level.visible[i]);
      }
    }
  }
  this.fov = this.level.visible;
  GAME.text.flush();
  GAME.engine.lock();
  if (this.mouseDown && this.target) {
    setTimeout(this.moveToTargetAndUnlock.bind(this), 100);
  }
};

Player.prototype.die = function () {
  "use strict";
  Being.prototype.die.call(this);
  GAME.over();
};

Player.prototype.handleEvent = function (e) {
  "use strict";
  switch (e.type) {
  case "mouseup":
    this.target = null;
    this.mouseDown = false;
    return;
  case "mousedown":
    this.target = new XY(
      GAME.display.eventToPosition(e)[0],
      GAME.display.eventToPosition(e)[1]
    );
    this.mouseDown = true;
    break;
  case "keydown":
    this.target = this.xy.plus(new XY(
      ROT.DIRS[8][this.keys[e.keyCode]][0],
      ROT.DIRS[8][this.keys[e.keyCode]][1]
    ));
    break;
  }
  this.moveToTargetAndUnlock();
};

Player.prototype.moveToTargetAndUnlock = function () {
  "use strict";
  if (this.moveToTarget()) {
    GAME.text.clear();
    GAME.engine.unlock();
  }
};
