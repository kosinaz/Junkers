/*global ROT, TextBuffer, Player, Level, Being, XY*/
var Game = {
    display: null,
    textBuffer: null,
    level: null,
    scheduler: null,
    engine: null,
    player: null,

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
            this.display = new ROT.Display({width: 45, height: 20, fontFamily: "Arial"});
            document.body.appendChild(this.display.getContainer());
            this.display.getOptions().fontSize = this.display.computeFontSize(screen.availWidth, screen.availHeight);
            this.textBuffer = new TextBuffer();
            this.scheduler = new ROT.Scheduler.Speed();
            this.engine = new ROT.Engine(this.scheduler);
            this.player = new Player("⇑⇗⇒⇘⇓⇙⇐⇖");
            this.switchLevel(new Level());
            this.level.setEntity(this.player);
            for (i = 0; i < 10; i += 1) {
                this.level.setEntity(new Being("⇧⬀⇨⬂⇩⬃⇦⬁"));
            }
            this.engine.start();
            break;
        }
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
