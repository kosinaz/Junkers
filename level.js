/*global GAME, XY, Entity, ROT*/
var Level = function (width, height) {
  "use strict";
  var i, xy, cellular, max;
  /* FIXME data structure for storing entities */
  this.beings = {};

  /* FIXME map data */
  this.size = new XY(width, height);
  this.map = {};
  this.visible = {};
  this.emptySpaces = [];

  this.wall = new Entity("◼", this);
  cellular = new ROT.Map.Cellular(this.size.x, this.size.y, {
    connected: true
  });
  cellular.randomize(0.5);
  cellular.create(function (x, y, value) {
    if (value) {
      return;
    }
    var xy = new XY(x, y);
    this.map[xy] = new Entity("•", this);
    this.emptySpaces.push(xy);
  }.bind(this));

  this.rsc = new ROT.FOV.RecursiveShadowcasting(function (x, y) {
    return this.map.hasOwnProperty(new XY(x, y));
  }.bind(this));
  this.lightning = new ROT.Lighting(function (x, y) {
    return (this.map.hasOwnProperty(new XY(x, y)) ? 0.1 : 0);
  }.bind(this), {
    range: 5,
    passes: 2
  });
  this.lightning.setFOV(this.rsc);
  for (i = 0; i < 10; i += 1) {
    xy = this.pickXY();
    this.map[xy] = new Entity("☀");
    this.lightning.setLight(xy.x, xy.y, ROT.Color.fromString(["red", "blue", "yellow"].random()));
  }
  this.light = {};
  max = 0;
  this.lightning.compute(function (x, y, color) {
    this.light[new XY(x, y)] = color;
    max = Math.max(color[0], Math.max(color[1], Math.max(color[2], max)));
  }.bind(this));
  max = 255 * 127 / max;
  for (xy in this.light) {
    if (this.light.hasOwnProperty(xy)) {
      this.light[xy] = ROT.Color.multiply(this.light[xy], [max, max, max]);
    }
  }
};

Level.prototype.setBeing = function (being, xy, dir) {
  "use strict";
  xy = xy || being.xy;
  dir = dir === undefined ? being.dir : dir;
  if (being.dir !== dir) {
    being.dir = dir;
    if (this.visible.hasOwnProperty(being.xy)) {
      this.draw(being.xy);
    }
    return true;
  }
  if (!this.map.hasOwnProperty(xy)) {
    return false;
  }
  if (this.beings.hasOwnProperty(xy)) {
    GAME.text.write("An entity attacks.");
    return true;
  }
  delete this.beings[being.xy];
  if (this.visible.hasOwnProperty(being.xy)) {
    this.draw(being.xy);
  }
  /* propagate position data to the entity itself */
  being.setPosition(xy, this);

  /* FIXME set new position, draw */
  this.beings[xy] = being;

  if (this.visible.hasOwnProperty(xy)) {
    this.draw(being.xy);
  }
  return true;
};

Level.prototype.pickXY = function () {
  "use strict";
  return this.emptySpaces.splice(ROT.RNG.getUniformInt(0, this.emptySpaces.length), 1)[0];
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
  GAME.display.draw(xy.x, xy.y, e.getCh(), ROT.Color.toHex(fg), ROT.Color.toHex(bg));
};
