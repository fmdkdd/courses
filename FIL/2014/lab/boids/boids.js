var visionRadius = 3;
var minimumSeparation = 1;

function go() {
  boids.forEach(function(b) { b.flock(); });
}

var boid = {
  flock: function() {
    var nearest = this.nearest();
    if (nearest) {
      if (distance(this, nearest) < minimumSeparation)
        this.separate();
      else {
        this.align();
        this.cohere();
      }
    }
  },

  nearest: function() {
    var nearest = null;
    var minDist = Number.MAX_VALUE;

    boids.forEach(function(b) {
      if (b !== this) {
        var d = distance(this, b);
        if (d < minDist) {
          minDist = d;
          nearest = b;
        }
      }
    });

    return nearest;
  },

  separate: function() {

  },

  draw: function(ctxt) {
    ctxt.beginPath();
    ctxt.moveTo(this.x, this.y);
    ctxt.lineTo(this.x + 10)
  },
};

function distance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
