/*global Being, ROT, Game, XY*/
var Player = function () {
    "use strict";
    Being.call(this, {
        ch: "⇑⇗⇒⇘⇓⇙⇐⇖",
        fg: "#fff"
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
    var p;
    Game.display.clear();
    this.computeFOV();
    for (p in this.fov) {
        if (this.fov.hasOwnProperty(p)) {
            Game.draw(this.fov[p]);
        }
    }
    Game.textBuffer.flush();
    Game.engine.lock();
    window.addEventListener("keydown", this);
};

Player.prototype.die = function () {
    "use strict";
    Being.prototype.die.call(this);
    Game.over();
};

Player.prototype.handleEvent = function (e) {
    "use strict";
    var code = e.keyCode,
        keyHandled = this.handleKey(e.keyCode);

    if (keyHandled) {
        window.removeEventListener("keydown", this);
        Game.engine.unlock();
    }
};

Player.prototype.handleKey = function (code) {
    "use strict";
    if (this.keys.hasOwnProperty(code)) {
        Game.textBuffer.clear();
        this.dir = this.keys[code];
        this.moveTo(this.xy.plus(new XY(ROT.DIRS[8][this.dir][0], ROT.DIRS[8][this.dir][1])));
        return true;
    }

    return false; /* unknown key */
};
