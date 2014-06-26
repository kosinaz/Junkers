/*global ROT, TextBuffer, Level, Player, Being*/

/**
 * @fileoverview The primary file of the game. Contains the Game object and its
 * initialization, and calls all the other objects from their own files.
 */

/**
 * The main class of the game. Holds the objects of its graphical display, its
 * text area under it, its level data, its scheduler and engine. To start the
 * game, its init function has to be called.
 * @constructor
 */
var Game = function () {
  "use strict";
  this.display = null;
  this.text = null;
  this.level = null;
  this.scheduler = null;
  this.engine = null;
  this.WIDTH = 45;
  this.HEIGHT = 20;
  this.TEXT_HEIGHT = 3;
};

/**
 * Initializes the loading of the game. After the game window has loaded, the
 * handleEvent function continues the initialization.
 */
Game.prototype.init = function () {
  "use strict";
  window.addEventListener("load", this);
};

/**
 * Finishes the initialization of the game. Creates the display, sets its size
 * to full window. Creates the text area, the scheduler, the engine, the level.
 * Creates the player and the NPC-s, adds them to the scheduler, and finally
 * starts the engine.
 * @param {event.type} e The load event.
 */
Game.prototype.handleEvent = function (e) {
  "use strict";
  var i;
  if (e.type !== "load") {
    return;
  }
  window.removeEventListener("load", this);
  this.display = new ROT.Display({
    width: this.WIDTH,
    height: this.HEIGHT + this.TEXT_HEIGHT,
    fontFamily: "Arial"
  });
  document.body.appendChild(this.display.getContainer());
  this.display.setOptions({
    fontSize: this.display.computeFontSize(
      screen.availWidth,
      screen.availHeight
    )
  });
  this.text = new TextBuffer(this.display, this.HEIGHT, this.TEXT_HEIGHT);
  this.scheduler = new ROT.Scheduler.Speed();
  this.engine = new ROT.Engine(this.scheduler);
  this.level = new Level(this.WIDTH, this.HEIGHT);
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
};

Game.prototype.over = function () {
  "use strict";
  this.engine.lock();
  /* FIXME show something */
};

var GAME = new Game();
GAME.init();
