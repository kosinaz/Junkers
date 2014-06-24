var XY = function (x, y) {
  "use strict";
  this.x = x || 0;
  this.y = y || 0;
};

XY.prototype.toString = function () {
  "use strict";
  return this.x + "," + this.y;
};

XY.prototype.is = function (xy) {
  "use strict";
  return (this.x === xy.x && this.y === xy.y);
};

XY.prototype.dist8 = function (xy) {
  "use strict";
  var dx = xy.x - this.x,
    dy = xy.y - this.y;
  return Math.max(Math.abs(dx), Math.abs(dy));
};

XY.prototype.dist4 = function (xy) {
  "use strict";
  var dx = xy.x - this.x,
    dy = xy.y - this.y;
  return Math.abs(dx) + Math.abs(dy);
};

XY.prototype.dist = function (xy) {
  "use strict";
  var dx = xy.x - this.x,
    dy = xy.y - this.y;
  return Math.sqrt(dx * dx + dy * dy);
};

XY.prototype.plus = function (xy) {
  "use strict";
  return new XY(this.x + xy.x, this.y + xy.y);
};

XY.prototype.minus = function (xy) {
  "use strict";
  return new XY(this.x - xy.x, this.y - xy.y);
};

XY.prototype.dir8To = function (xy) {
  "use strict";
  if (this.x === xy.x) {
    if (this.y > xy.y) {
      return 0;
    } else {
      return 4;
    }
  }
  if (this.y === xy.y) {
    if (this.x < xy.x) {
      return 2;
    } else {
      return 6;
    }
  }
  if (this.x < xy.x) {
    if (this.y > xy.y) {
      return 1;
    } else {
      return 3;
    }
  } else {
    if (this.y > xy.y) {
      return 7;
    } else {
      return 5;
    }
  }
};
