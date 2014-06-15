var Entity = function (visual) {
    "use strict";
    this.visual = visual;
    this.xy = null;
    this.level = null;
};

Entity.prototype.getVisual = function () {
    "use strict";
    return this.visual;
};

Entity.prototype.getXY = function () {
    "use strict";
    return this.xy;
};

Entity.prototype.getLevel = function () {
    "use strict";
    return this.level;
};

Entity.prototype.setPosition = function (xy, level) {
    "use strict";
    this.xy = xy;
    this.level = level;
    return this;
};
