/* eslint-env browser */

document.addEventListener('DOMContentLoaded', init);

function init() {
  var screen = Screen.new(document.body, 200, 150, 5);
  input.bind(window);
  player.reset(screen);

  tick(screen);
}

function tick(screen) {
  player.update(screen);

  requestAnimationFrame(function() { tick(screen); });
}

var Screen = {
  new: function($root, width, height, scale) {
    var $canvas = document.createElement('canvas');
    $canvas.setAttribute('width', width * scale);
    $canvas.setAttribute('height', height * scale);

    var ctxt = $canvas.getContext('2d');
    ctxt.scale(scale, scale);

    $root.appendChild($canvas);

    return {
      __proto__: this,
      $root: $root,
      $canvas: $canvas,
      ctxt: ctxt,
      scale: scale,
      width: width,
      height: height,
    };
  },

  putPixel: function(pos, color) {
    this.ctxt.fillStyle = color;
    this.ctxt.fillRect(pos.x, pos.y, 1, 1);
  },

  isOutside: function(pos) {
    return pos.x < 0 || pos.x >= this.$canvas.width / this.scale
      || pos.y < 0 || pos.y >= this.$canvas.height / this.scale;
  },

  randomPosition: function() {
    return {
      x: Math.floor(Math.random() * this.width),
      y: Math.floor(Math.random() * this.height),
    };
  },

  randomColor: function() {
    var r = Math.floor(Math.random() * 50) + 50;
    var g = Math.floor(Math.random() * 125) + 100;
    var b = Math.floor(Math.random() * 50) + 200;
    return 'rgba(' + [r,g,b,0.6] + ')';
  },
};

var input = {
  keycodes: {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  },

  keys: [],

  bind: function(window) {
    window.addEventListener('keydown', function(e) {
      this.keys[e.which] = true;
    }.bind(this));

    window.addEventListener('keyup', function(e) {
      this.keys[e.which] = false;
    }.bind(this));
  },

  get left() { return this.keys[this.keycodes.LEFT]; },
  get up() { return this.keys[this.keycodes.UP]; },
  get right() { return this.keys[this.keycodes.RIGHT]; },
  get down() { return this.keys[this.keycodes.DOWN]; },
};

var player = {
  pos: {x: 0, y: 0},
  prevPos: {x: 0, y: 0},
  direction: {x: 0, y: 0},
  color: 'black',

  reset: function(screen) {
    this.pos = screen.randomPosition();
    this.color = screen.randomColor();
  },

  update: function(screen) {
    this.move();
    this.checkCollision(screen);
    this.draw(screen);
  },

  move: function() {
    this.direction = {x:0, y:0};
    if (input.up)
      this.direction.y = -1;
    if (input.down)
      this.direction.y = +1;
    if (input.left)
      this.direction.x = -1;
    if (input.right)
      this.direction.x = +1;

    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
    this.pos.x += this.direction.x;
    this.pos.y += this.direction.y;
  },

  checkCollision: function(screen) {
    if (screen.isOutside(this.pos))
      this.reset(screen);
  },

  draw: function(screen) {
    screen.putPixel(this.pos, this.color);
  },
};
