document.addEventListener('DOMContentLoaded', function() {
	start();
});

var width, height;

function start() {
	var canvas = document.querySelector('#canvas');
  var ctxt = canvas.getContext('2d');

  width = canvas.width;
  height = canvas.height;

  bindListeners(ctxt);

  displayLoop(function() {
    redraw(ctxt);
  });

  var updateLoop = setInterval(function() {
	  moveSnake(snake.direction);
  }, speed);

  var tailLoop = setInterval(function() {
    snake.extend();
  }, 600);
}

var speed = 150;

function bindListeners(ctxt) {
	document.addEventListener('keydown', function(event) {
    var keys = {
      37: 'left',
      38: 'down',
      39: 'right',
      40: 'up',
    }

    if (event.which in keys)
      snake.direction = keys[event.which];
  });
}

function canGoThere(x, y) {
  return x >= 0 && x < width && y >= 0 && y < height;
}

function redraw(ctxt) {
  ctxt.clearRect(0, 0, width, height);
	snake.draw(ctxt);
}

function moveSnake(direction) {
  var mapDir = {
    'left': [-1, 0],
    'right': [1, 0],
    'up': [0, 1],
    'down': [0, -1],
  };

  var delta = mapDir[direction];
	snake.move(delta[0], delta[1]);
}

var snake = {
  pos: {
    x: 0,
    y: 0
  },

  size: 10,

  direction: 'down',

  tail: [],
  tailSize: 10,

  draw: function(ctxt) {
    var size = this.size;

    ctxt.fillStyle = '#ae7';
    size *= 0.8;
    this.tail.forEach(function(pos) {
	    ctxt.fillRect(pos.x - size/2, pos.y - size/2, size, size);
    });

    // Draw head after the tail to appear on top
    ctxt.fillStyle = '#ac7';
    size = this.size;
    ctxt.fillRect(this.pos.x - size/2, this.pos.y - size/2,
                  size, size);
  },

  move: function(dx, dy) {
    var x = this.pos.x + dx * this.size;
    var y = this.pos.y + dy * this.size;

    if (canGoThere(x, y)) {
      this.tailPush(this.pos);
      this.pos.x = x;
      this.pos.y = y;
    }
  },

  extend: function() {
	  this.tailSize++;
  },

  tailPush: function(pos) {
	  this.tail.unshift({x: pos.x, y: pos.y});
    this.tail.length = this.tailSize;
  },

};

function displayLoop(callback) {
	var requestAnimFrame = (function(){
		return window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(callback, element) { return setTimeout(callback, 1000 / 60); }
	}());

	var frameCount = 0;

	var render = function(time) {
		// Setup next update
		requestAnimFrame(render);

    callback();

		++frameCount;
	}

	requestAnimFrame(render);
}
