/* eslint-env browser */

document.addEventListener('DOMContentLoaded', init);

function init() {
  var screen = Screen.new(document.body, 200, 150, 5);
  input.bind(window);
  player.pos = screen.randomPosition();
  fruit.pos = screen.randomPosition();

  tick(screen);
}

function tick(screen) {
  player.update(screen);
  fruit.draw(screen);

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

  getPixel: function(pos) {
    var area =  this.ctxt.getImageData(this.scale * pos.x,
                                       this.scale * pos.y,
                                       this.scale,
                                       this.scale);
    var pix = area.data.subarray(0, 4);
    var color = 'rgba(' + [].join.call(pix, ',') + ')';
    return color;
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
  dead: false,
  pos: {x: 0, y: 0},
  prevPos: {x: 0, y: 0},
  direction: {x: +1, y: 0},
  headColor: 'red',
  tailColor: 'rgba(0,0,0,255)',

  update: function(screen) {
    if (this.dead) return;

    this.move();
    this.checkCollision(screen);
    this.draw(screen);
  },

  move: function() {
    var prevDir = this.direction;

    if (input.up)
      this.direction = {x: 0, y: -1};
    else if (input.down)
      this.direction = {x: 0, y: +1};
    else if (input.left)
      this.direction = {x: -1, y: 0};
    else if (input.right)
      this.direction = {x: +1, y: 0};

    // Can't go back!
    if (prevDir.x === -this.direction.x
        && prevDir.y === -this.direction.y)
      this.direction = prevDir;

    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
    this.pos.x += this.direction.x;
    this.pos.y += this.direction.y;
  },

  checkCollision: function(screen) {
    // We crash if we are going into ourselves or if we are out of
    // bounds

    var color = screen.getPixel(this.pos);
    var collides = color === this.tailColor || screen.isOutside(this.pos);

    if (collides) {
      this.pos.x = this.prevPos.x;
      this.pos.y = this.prevPos.y;
      this.dead = true;
    }
  },

  draw: function(screen) {
    if (this.dead) {
      screen.putPixel(this.prevPos, this.tailColor);
      screen.putPixel(this.pos, this.tailColor);
      console.log('Game over!');
    } else {
      screen.putPixel(this.prevPos, this.tailColor);
      screen.putPixel(this.pos, this.headColor);
    }
  },
};

var fruit = {
  pos: {x: 0, y: 0},
  color: 'rebeccapurple',

  draw: function(screen) {
    screen.putPixel(this.pos, this.color);
  },
};
