var Entity = function (visual) {
    "use strict";
    this.visual = visual;
    this.xy = null;
    this.level = null;
};

Entity.prototype.setPosition = function (xy, level) {
    "use strict";
    this.xy = xy;
    this.level = level;
    return this;
};
