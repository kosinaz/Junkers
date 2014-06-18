/*global Being, ROT, Game, XY*/
var Player = function () {
    "use strict";
    Being.call(this, {
        ch: "⇑⇗⇒⇘⇓⇙⇐⇖",
        fg: [127, 127, 127]
    });
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
    this.fov = this.computeFOV();
    Game.display.clear();
    Game.draw(this.fov);
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
        Game.engine.unlock();
    }
};

Player.prototype.handleKey = function (code) {
    "use strict";
    if (this.keys.hasOwnProperty(code)) {
        Game.textBuffer.clear();
        if (this.dir !== this.keys[code]) {
            this.dir = this.keys[code];
            return true;
        }
        this.moveTo(this.xy.plus(new XY(ROT.DIRS[8][this.dir][0], ROT.DIRS[8][this.dir][1])));
        this.target = null;
        return true;
    }

    return false; /* unknown key */
};

Player.prototype.handleMouse = function (position) {
    "use strict";
    var i, astar;
    this.target = new XY(position[0], position[1]);
    this.path = [];
    astar = new ROT.Path.AStar(this.target.x, this.target.y, function (x, y) {
        return Game.level.map.hasOwnProperty(new XY(x, y));
    }).compute(this.xy.x, this.xy.y, function (x, y) {
        this.path.push(new XY(x, y));
    }.bind(this));
    for (i = 0; i < this.fov.length; i += 1) {
        if (this.fov[i].is(this.path[this.path.length - 2])) {
            if (this.dir !== this.xy.dir8To(this.path[1])) {
                this.dir = this.xy.dir8To(this.path[1]);
                return true;
            }
            this.moveTo(this.path[1]);
            return true;
        }
    }
    return false; /* out of fov */
};
