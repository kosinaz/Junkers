/*global Game, XY, Entity, ROT*/
var Level = function () {
    "use strict";
    var i, xy, cellular;
    /* FIXME data structure for storing entities */
    this.beings = {};
    this.visible = {};

    /* FIXME map data */
    this.size = new XY(Game.display.getOptions().width, Game.display.getOptions().height);
    this.map = {};
    this.emptySpaces = [];

    this.wall = new Entity("◼");
    cellular = new ROT.Map.Cellular(this.size.x, this.size.y - 3, {
        connected: true
    });
    cellular.randomize(0.5);
    cellular.create(function (x, y, value) {
        if (value) {
            return;
        }
        var xy = new XY(x, y);
        this.map[xy] = new Entity("•");
        this.emptySpaces.push(xy);
    }.bind(this));

    this.rsc = new ROT.FOV.RecursiveShadowcasting(function (x, y) {
        return this.map.hasOwnProperty(new XY(x, y));
    }.bind(this));
    this.lightning = new ROT.Lighting(function (x, y) {
        return (this.map.hasOwnProperty(new XY(x, y)) ? 0.1 : 0);
    }.bind(this), {
        range: 10,
        passes: 2
    });
    this.lightning.setFOV(this.rsc);
    for (i = 0; i < 10; i += 1) {
        xy = this.pickXY();
        this.lightning.setLight(xy.x, xy.y, ROT.Color.fromString(["red", "blue", "yellow"].random()));
    }
    this.light = {};
    this.lightning.compute(function (x, y, color) {
        this.light[new XY(x, y)] = [
            Math.min(color[0], 127),
            Math.min(color[1], 127),
            Math.min(color[2], 127)
        ];
    }.bind(this));
};

Level.prototype.setEntity = function (entity, xy, dir) {
    "use strict";
    if (xy === undefined) {
        xy = this.pickXY();
    }
    if (dir === undefined) {
        entity.dir = ROT.RNG.getUniformInt(0, 7);
    }
    /* FIXME remove from old position, draw */
    if (entity.level === this) {
        if (entity.dir !== dir) {
            entity.dir = dir;
            if (this.visible.hasOwnProperty(entity.xy)) {
                this.draw(entity.xy);
            }
            return;
        } else if (!this.map.hasOwnProperty(xy)) {
            return;
        } else if (this.beings.hasOwnProperty(xy)) {
            Game.textBuffer.write("An entity attacks.");
            return;
        } else {
            delete this.beings[entity.xy];
            if (this.visible.hasOwnProperty(entity.xy)) {
                this.draw(entity.xy);
            }
        }
    }
    entity.setPosition(xy, this); /* propagate position data to the entity itself */

    /* FIXME set new position, draw */
    this.beings[xy] = entity;

    if (this.visible.hasOwnProperty(xy)) {
        this.draw(entity.xy);
    }
};

Level.prototype.getEntityAt = function (xy) {
    "use strict";
    return this.beings[xy] || this.map[xy] || this.wall;
};

Level.prototype.getFgAt = function (xy) {
    "use strict";
    var bg = this.getBgAt(xy);
    return [bg[0] ? bg[0] + 127 : 0, bg[1] ? bg[1] + 127 : 0, bg[2] ? bg[2] + 127 : 127];
};

Level.prototype.getBgAt = function (xy) {
    "use strict";
    return this.light[xy] || [0, 0, 0];
};

Level.prototype.getBeings = function () {
    "use strict";
    /* FIXME list of all beings */
    return this.beings;
};

Level.prototype.pickXY = function () {
    "use strict";
    return this.emptySpaces.splice(ROT.RNG.getUniformInt(0, this.emptySpaces.length), 1)[0];
};

Level.prototype.draw = function (xy) {
    "use strict";
    var e = this.getEntityAt(xy),
        fg = this.getFgAt(xy),
        bg = this.getBgAt(xy);
    if (!this.visible.hasOwnProperty(xy)) {
        e = this.map[xy] || this.wall;
        fg = ROT.Color.hsl2rgb([ROT.Color.rgb2hsl(fg)[0], 0, ROT.Color.rgb2hsl(fg)[2] / 2]);
        bg = ROT.Color.hsl2rgb([ROT.Color.rgb2hsl(bg)[0], 0, ROT.Color.rgb2hsl(bg)[2] / 2]);
    }
    Game.display.draw(xy.x, xy.y, e.getCh(), ROT.Color.toHex(fg), ROT.Color.toHex(bg));
};
