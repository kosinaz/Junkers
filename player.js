/*global Being, ROT, Game, XY*/
var Player = function (ch) {
    "use strict";
    Being.call(this, ch);
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
    Game.textBuffer.flush();
    Game.engine.lock();
    window.addEventListener("keydown", this);
    window.addEventListener("click", this);
};

Player.prototype.die = function () {
    "use strict";
    Being.prototype.die.call(this);
    Game.over();
};

Player.prototype.handleEvent = function (e) {
    "use strict";
    if (this.handleKey(e.keyCode) || this.handleMouse(Game.display.eventToPosition(e))) {
        window.removeEventListener("keydown", this);
        window.removeEventListener("click", this);
        Game.textBuffer.clear();
        Game.engine.unlock();
    }
};

Player.prototype.handleKey = function (code) {
    "use strict";
    if (this.keys.hasOwnProperty(code)) {
        this.level.setEntity(this, this.xy.plus(new XY(ROT.DIRS[8][this.keys[code]][0], ROT.DIRS[8][this.keys[code]][1])), this.keys[code]);
        return true;
    }

    return false; /* unknown key */
};

Player.prototype.handleMouse = function (position) {
    "use strict";
    var i;
    this.target = new XY(position[0], position[1]);
    this.path = [];
    new ROT.Path.AStar(this.target.x, this.target.y, function (x, y) {
        return Game.level.map.hasOwnProperty(new XY(x, y));
    }).compute(this.xy.x, this.xy.y, function (x, y) {
        this.path.push(new XY(x, y));
    }.bind(this));
    for (i in this.fov) {
        if (this.fov.hasOwnProperty(i)) {
            if (this.fov[i].is(this.path[this.path.length - 2])) {
                this.level.setEntity(this, this.path[1], this.xy.dir8To(this.path[1]));
                return true;
            }
        }
    }
    return false; /* out of fov */
};
