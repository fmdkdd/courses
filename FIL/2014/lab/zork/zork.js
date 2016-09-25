// ## A text-based adventure game
//
// It has rooms, which you can navigate between, and items that you
// can take, inspect, and sometimes use for solving puzzle.

var room;

var defaultRoom = {
  enter: function() {
    room = this;
    this.look();
  },

  look: function() {
    p("You can't see anything.");
  },

  left: function() {
    p("There is nothing on the left");
  },

  right: function() {
    p("Nothing to the right");
  },

  up: function() {
    p("You cannot go up");
  },

  down: function() {
    p("There is no way down");
  },
};

var classroom = {
  __proto__: defaultRoom,

  look: function() {
    p("An empty white room.",
      "There are chairs and tables lying around.",
      "There's an open door to the right, and windows to the left");
  },

  left: function() {
    p("There are windows there");
  },

  right: function() {
    p("You exit through the door");
    corridor.enter();
  },
};

var corridor = {
  __proto__: defaultRoom,

  look: function() {
    p("A long corridor.  It is pitch black.  You are likely to be eaten by a grue.");
  },
};

// Where to start

classroom.enter();

// Actions

function a(action) {
  if (room[action])
    room[action]();
  else
    p("What?");
}

function p(/* args */) {
  console.log.apply(console, arguments);
}
