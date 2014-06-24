/*global XY*/
var TextBuffer = function (display, position, height) {
  "use strict";
  this.data = [];
  this.display = display;
  this.position = position;
  this.height = height;
};

TextBuffer.prototype.clear = function () {
  "use strict";
  this.data = [];
};

TextBuffer.prototype.write = function (text) {
  "use strict";
  this.data.push(text);
};

TextBuffer.prototype.flush = function () {
  "use strict";
  var i, j;
  /* clear */
  for (i = 0; i < this.display.getOptions().width; i += 1) {
    for (j = 0; j < this.height; j += 1) {
      this.display.draw(i, this.position + j);
    }
  }
  this.display.drawText(0, this.position, this.data.join(" "));
};
