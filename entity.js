var Entity = function (ch) {
    'use strict';
    this.ch = ch;
    this.xy = null;
    this.level = null;
};

Entity.prototype.setPosition = function (xy, level) {
    'use strict';
    this.xy = xy;
    this.level = level;
    return this;
};

Entity.prototype.getCh = function () {
    'use strict';
    return this.ch;
};
