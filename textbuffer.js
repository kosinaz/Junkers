/*global XY*/
var TextBuffer = function () {
    "use strict";
    this.data = [];
    this.options = {
        display: null,
        position: new XY(),
        size: new XY()
    };
};

TextBuffer.prototype.configure = function (options) {
    "use strict";
    var p;
    for (p in options) {
        if (options.hasOwnProperty(p)) {
            this.options[p] = options[p];
        }
    }
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
    var o = this.options,
        d = o.display,
        pos = o.position,
        size = o.size,
        i,
        j,
        text;

    /* clear */
    for (i = 0; i < size.x; i += 1) {
        for (j = 0; j < size.y; j += 1) {
            d.draw(pos.x + i, pos.y + j);
        }
    }

    text = this.data.join(" ");
    d.drawText(pos.x, pos.y, text, size.x);
};
