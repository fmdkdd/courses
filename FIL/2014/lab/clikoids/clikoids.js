/* eslint-env browser */

document.addEventListener('DOMContentLoaded', init);

var ctxt;

function init() {
  var canvas = document.getElementById('canvas');
  ctxt = canvas.getContext('2d');

  tick();
}

function tick() {
  ctxt.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);

  objects.forEach(function(o) { o.move(); });
  objects.forEach(function(o) { o.draw(ctxt); });

  requestAnimationFrame(tick);
}

var roid = {
  x: 0,
  y: 0,
  speed: 1,
  size: 64,
  direction: 0,

  new: function() {
    return {
      __proto__: this,
      direction: Math.random() * Math.PI * 2,
      size: this.size / 2,
    };
  },

  split: function() {
    objects.push(this.new());
    objects.push(this.new());
    objects.push(this.new());
  },

  move: function() {
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;
  },

  draw: function(ctxt) {
    ctxt.strokeStyle = 'black';
    ctxt.strokeRect(this.x - this.size/2, this.y - this.size/2,
                   this.size, this.size);
  }
};

var objects = [roid];
