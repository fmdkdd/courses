document.addEventListener('DOMContentLoaded', init);

var canvas;
var ctxt;
var currentBrush;

var defaultCtxt;

function init() {
  canvas = document.querySelector('canvas');
  ctxt = canvas.getContext('2d');

  window.addEventListener('resize', function() {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight - 50);
  });

  window.dispatchEvent(new Event('resize'));

  var controls = document.querySelector('#controls');
  controls.addEventListener('click', function(event) {
    var brush = event.target.getAttribute('data-brush');
    if (brush)
      changeBrush(brush);
  });

  var dummyCanvas = document.createElement('canvas');
  defaultCtxt = dummyCanvas.getContext('2d');

  changeBrush('randomWidthPencil');

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mouseup', stopDrawing);
}

function startDrawing(event) {
  canvas.addEventListener('mousemove', draw);
  currentBrush.down({ x: event.clientX, y: event.clientY });
}

function stopDrawing(event) {
  canvas.removeEventListener('mousemove', draw);
  currentBrush.up({ x: event.clientX, y: event.clientY });
}

function draw(event) {
  currentBrush.move({ x: event.clientX, y: event.clientY });
}

function changeBrush(brush) {
  currentBrush = brushes[brush];
  restoreDefaults();
  currentBrush.setup();
}

function restoreDefaults() {
  var prop = [
    'fillStyle',
    'strokeStyle',
    'globalAlpha',
    'lineWidth',
    'lineJoin',
    'lineCap',
    'shadowBlur',
    'shadowColor',
  ];

  prop.forEach(function(p) {
    ctxt[p] = defaultCtxt[p];
  });
}

// Brushes based on http://perfectionkills.com/exploring-canvas-drawing-techniques/

var brushes = {};

brushes.simplePencil = {
  setup: function() {
    ctxt.lineWidth = 1;
    ctxt.lineJoin = ctxt.lineCap = 'round';
  },

  down: function(point) {
    ctxt.beginPath();
    ctxt.moveTo(point.x, point.y);
  },

  move: function(point) {
    ctxt.lineTo(point.x, point.y);
    ctxt.stroke();
  },

  up: function(point) {},
};

brushes.smoothPencil = {
  __proto__: brushes.simplePencil,

  setup: function() {
    ctxt.lineWidth = 10;
    ctxt.lineJoin = ctxt.lineCap = 'round';
  },
};

brushes.edgeSmoothPencil = {
  __proto__: brushes.smoothPencil,

  setup: function() {
    ctxt.lineWidth = 3;
    ctxt.lineJoin = ctxt.lineCap = 'round';
    ctxt.shadowBlur = 10;
    ctxt.shadowColor = 'black';
  },
};

brushes.pointsPencil = {
  __proto__: brushes.simplePencil,

  setup: function() {
    ctxt.lineWidth = 7;
    ctxt.lineJoin = ctxt.lineCap = 'round';
  },

  down: function(point) {
    this.lastPoint = point;
  },

  move: function(point) {
    this.draw(point);
    this.lastPoint = point;
  },

  draw: function(point) {
    ctxt.beginPath();
    ctxt.moveTo(this.lastPoint.x, this.lastPoint.y);
    ctxt.lineTo(point.x, point.y);
    ctxt.stroke();
  },
};

brushes.gradientPencil = {
  __proto__: brushes.pointsPencil,

  draw: function(point) {
    var gradient = ctxt.createRadialGradient(point.x, point.y, 5,
                                             point.x, point.y, 10);

    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.5, 'rgba(0,0,0,0.5)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctxt.fillStyle = gradient;
    ctxt.fillRect(point.x - 10, point.y - 10, 20, 20);
  }
}

brushes.interpolatedPencil = {
  __proto__: brushes.gradientPencil,

  move: function(point) {
    // Polar coordinates
    var d = utils.distanceBetween(this.lastPoint, point);
    var th = utils.angleBetween(this.lastPoint, point);
    var interPoint = { x: this.lastPoint.x, y: this.lastPoint.y };
    var step = 3;

    for (var i = step; i < d; i += step) {
      interPoint.x += Math.cos(th) * step;
      interPoint.y += Math.sin(th) * step;
      this.draw(interPoint);
      this.lastPoint = interPoint;
    }

    this.draw(point);
    this.lastPoint = point;
  },
};

brushes.interpolatedEraser = {
  __proto__: brushes.interpolatedPencil,

  draw: function(point) {
    var gradient = ctxt.createRadialGradient(point.x, point.y, 10,
                                             point.x, point.y, 20);

    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctxt.fillStyle = gradient;
    ctxt.fillRect(point.x - 20, point.y - 20, 40, 40);
  },
};

brushes.randomWidthPencil = {
  __proto__: brushes.pointsPencil,

  draw: function(point) {
    ctxt.lineWidth = Math.random() * 2 + 3;
    this.__proto__.draw.call(this, point);
  }
};

brushes.dotsPencil = {
  setup: function() {},
  down: function(point) {},

  move: function(point) {
    ctxt.beginPath();
    ctxt.arc(point.x, point.y, Math.random() * 15 + 5, false, Math.PI * 2);
    ctxt.fill();
  },

  up: function(point) {},
};

brushes.trippyDots = {
  __proto__: brushes.dotsPencil,

  setup: function() {
    ctxt.fillStyle = utils.hueToColor(utils.randomHue());
  },

  move: function(point) {
    ctxt.globalAlpha = Math.random();
    this.__proto__.move.call(this, point);
  },
};

brushes.neighborPointsPencil = {
  __proto__: brushes.pointsPencil,

  setup: function() {
    ctxt.lineWidth = 1;
    this.points = [];
  },

  down: function(point) {
    this.points.push(point);
  },

  draw: function(point) {
    this.points.push(point);

    var p1 = this.points[this.points.length - 1];
    var p2 = this.points[this.points.length - 2];

    ctxt.beginPath();
    ctxt.moveTo(p2.x, p2.y);
    ctxt.lineTo(p1.x, p1.y);
    ctxt.stroke();

    for (var i = 0, len = this.points.length; i < len; i++) {
      dx = this.points[i].x - p1.x;
      dy = this.points[i].y - p1.y;
      d = dx * dx + dy * dy;

      if (d < 1000) {
        ctxt.beginPath();
        ctxt.strokeStyle = 'rgba(0,0,0,0.3)';
        ctxt.moveTo(p1.x + (dx * 0.2), p1.y + (dy * 0.2));
        ctxt.lineTo(this.points[i].x - (dx * 0.2), this.points[i].y - (dy * 0.2));
        ctxt.stroke();
      }
    }
  },

  up: function(point) {
    this.points.length = 0;
  }
};

var utils = {
  distanceBetween: function(point1, point2) {
    return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x)
                     + (point1.y - point2.y) * (point1.y - point2.y));
  },

  angleBetween: function(point1, point2) {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
  },

  randomHue: function() {
    return Math.floor(Math.random() * 360);
  },

  hueToColor: function(hue) {
    return 'hsl(' + hue + ', 60%, 50%)';
  },
};
