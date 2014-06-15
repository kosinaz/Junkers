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
        var i, level;
        switch (e.type) {
        case "load":
            window.removeEventListener("load", this);

            this.scheduler = new ROT.Scheduler.Speed();
            this.engine = new ROT.Engine(this.scheduler);
            this.display = new ROT.Display({
                fontSize: 16
            });
            this.textBuffer = new TextBuffer(this.display);
            document.body.appendChild(this.display.getContainer());
            this.player = new Player();

            /* FIXME build a level and position a player */
            level = new Level();
            this.switchLevel(level);
            this.level.build();
            this.level.setEntity(this.player, this.level.pickSpace());
            this.player.setDir(ROT.RNG.getUniformInt(0, 7));
            for (i = 0; i < 10; i += 1) {
                this.level.setEntity(new Being({
                    ch: "e",
                    d: "⇧⬀⇨⬂⇩⬃⇦⬁",
                    fg: "#a00"
                }), this.level.pickSpace());
            }
            this.rsc = new ROT.FOV.RecursiveShadowcasting(this.lightPasses.bind(this));

            this.engine.start();
            break;
        }
    },

    draw: function (xy) {
        "use strict";
        var entity = this.level.getEntityAt(xy),
            visual = entity.getVisual();
        this.display.draw(xy.x, xy.y, visual.d ? visual.d.charAt(entity.getDir()) : visual.ch, visual.fg, visual.bg);
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
        var size = this.level.getSize(),
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
        beings = this.level.getBeings();
        for (p in beings) {
            if (beings.hasOwnProperty(p)) {
                this.scheduler.add(beings[p], true);
            }
        }
    },

    lightPasses: function (x, y) {
        "use strict";
        return this.level.getEntityAt(new XY(x, y)).getVisual().ch !== "#";
    }
};

Game.init();
