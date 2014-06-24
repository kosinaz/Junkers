/*global ROT, TextBuffer, Player, Level, Being, XY*/
var Game = function () {
  "use strict";
  this.display = null;
  this.textBuffer = null;
  this.level = null;
  this.scheduler = null;
  this.engine = null;
  this.LEVEL_WIDTH = 45;
  this.LEVEL_HEIGHT = 20;
  this.TEXT_HEIGHT = 3;
};

Game.prototype.init = function () {
  "use strict";
  window.addEventListener("load", this);
};

Game.prototype.handleEvent = function (e) {
  "use strict";
  var i;
  switch (e.type) {
  case "load":
    window.removeEventListener("load", this);
    this.display = new ROT.Display({
      width: this.LEVEL_WIDTH,
      height: this.LEVEL_HEIGHT + this.TEXT_HEIGHT,
      fontFamily: "Arial"
    });
    document.body.appendChild(this.display.getContainer());
    this.display.setOptions({
      fontSize: this.display.computeFontSize(screen.availWidth, screen.availHeight)
    });
    this.textBuffer = new TextBuffer(this.display, this.LEVEL_HEIGHT, this.TEXT_HEIGHT);
    this.scheduler = new ROT.Scheduler.Speed();
    this.engine = new ROT.Engine(this.scheduler);
    this.level = new Level(this.LEVEL_WIDTH, this.LEVEL_HEIGHT);
    this.level.setEntity(new Player("⇑⇗⇒⇘⇓⇙⇐⇖"));
    for (i = 0; i < 10; i += 1) {
      this.level.setEntity(new Being("⇧⬀⇨⬂⇩⬃⇦⬁"));
    }
    for (i in this.level.beings) {
      if (this.level.beings.hasOwnProperty(i)) {
        this.scheduler.add(this.level.beings[i], true);
      }
    }
    this.engine.start();
    break;
  }
};

Game.prototype.over = function () {
  "use strict";
  this.engine.lock();
  /* FIXME show something */
};

var GAME = new Game();
GAME.init();
