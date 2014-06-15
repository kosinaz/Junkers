/*global ROT, TextBuffer, Player, Level, Being, XY*/
var Game = {
    scheduler: null,
    engine: null,
    player: null,
    level: null,
    display: null,
    textBuffer: null,

    init: function () {
        "use strict";
        window.addEventListener("load", this);
    },

    handleEvent: function (e) {
        "use strict";
        var i;
        switch (e.type) {
        case "load":
            window.removeEventListener("load", this);
            this.scheduler = new ROT.Scheduler.Speed();
            this.engine = new ROT.Engine(this.scheduler);
            this.display = new ROT.Display();
            this.textBuffer = new TextBuffer(this.display);
            document.body.appendChild(this.display.getContainer());
            this.player = new Player();
            this.switchLevel(new Level());
            this.level.build();
            this.level.setEntity(this.player);
            for (i = 0; i < 10; i += 1) {
                this.level.setEntity(new Being({
                    ch: "⇧⬀⇨⬂⇩⬃⇦⬁",
                    fg: "#a00"
                }));
            }
            this.rsc = new ROT.FOV.RecursiveShadowcasting(function (x, y) {
                return this.level.map.hasOwnProperty(new XY(x, y));
            }.bind(this));
            this.engine.start();
            break;
        }
    },

    draw: function (xy) {
        "use strict";
        var e = this.level.getEntityAt(xy);
        this.display.draw(xy.x, xy.y, e.visual.ch.charAt(e.dir), e.visual.fg, e.visual.bg);
    },

    over: function () {
        "use strict";
        this.engine.lock();
        /* FIXME show something */
    },

    switchLevel: function (level) {
        "use strict";
        /* remove old beings from the scheduler */
        this.scheduler.clear();

        this.level = level;
        var size = this.level.size,
            bufferSize = 3,
            beings,
            p;
        this.display.setOptions({
            width: size.x,
            height: size.y + bufferSize
        });
        this.textBuffer.configure({
            display: this.display,
            position: new XY(0, size.y),
            size: new XY(size.x, bufferSize)
        });
        this.textBuffer.clear();

        /* add new beings to the scheduler */
        beings = this.level.beings;
        for (p in beings) {
            if (beings.hasOwnProperty(p)) {
                this.scheduler.add(beings[p], true);
            }
        }
    }
};

Game.init();
