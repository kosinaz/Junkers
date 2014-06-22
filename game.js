/*global ROT, TextBuffer, Player, Level, Being, XY*/
var Game = {
    display: null,
    textBuffer: null,
    level: null,
    scheduler: null,
    engine: null,
    LEVEL_WIDTH: 45,
    LEVEL_HEIGHT: 20,
    TEXT_BUFFER_HEIGHT: 3,

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
            this.display = new ROT.Display({width: this.LEVEL_WIDTH, height: this.LEVEL_HEIGHT + this.TEXT_BUFFER_HEIGHT, fontFamily: "Arial"});
            document.body.appendChild(this.display.getContainer());
            this.display.setOptions({fontSize : this.display.computeFontSize(screen.availWidth, screen.availHeight)});
            this.textBuffer = new TextBuffer(this.display, this.LEVEL_HEIGHT, this.TEXT_BUFFER_HEIGHT);
            this.scheduler = new ROT.Scheduler.Speed();
            this.engine = new ROT.Engine(this.scheduler);
            this.setLevel(new Level(this.LEVEL_WIDTH, this.LEVEL_HEIGHT));
            this.level.setEntity(new Player("⇑⇗⇒⇘⇓⇙⇐⇖"));
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

    setLevel: function (level) {
        "use strict";
        var p;
        /* remove old beings from the scheduler */
        this.scheduler.clear();

        this.level = level;
        this.textBuffer.clear();

        /* add new beings to the scheduler */
        for (p in this.level.beings) {
            if (this.level.beings.hasOwnProperty(p)) {
                this.scheduler.add(this.level.beings[p], true);
            }
        }
    }
};
