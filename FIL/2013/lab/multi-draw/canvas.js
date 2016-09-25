document.addEventListener('DOMContentLoaded', init);

var drawingArea;

var ctxts = [];
var activeBrushes = [];

var defaultCtxt;

function init() {
  window.addEventListener('resize', function() {
    var canvases = document.querySelectorAll('canvas');
    for (var i = 0; i < canvases.length; ++i) {
      canvases[i].setAttribute('width', window.innerWidth);
      canvases[i].setAttribute('height', window.innerHeight - 50);
    }
  });

  var controls = document.querySelector('#controls');
  controls.addEventListener('click', function(event) {
    var brushName = event.target.getAttribute('data-brush');
    if (brushName)
      changeBrush(brushName);
  });

  var dummyCanvas = document.createElement('canvas');
  defaultCtxt = dummyCanvas.getContext('2d');

  drawingArea = document.querySelector('#canvases');
  drawingArea.addEventListener('mousedown', startDrawing);
  drawingArea.addEventListener('mouseup', stopDrawing);
}

// Setup WebSocket

var url = 'ws:' + document.URL.split(':')[1] + ':8080';
var ws = new WebSocket(url);
ws.onopen = function() { console.log('Connected'); };
ws.onclose = function() { console.log('Disconnected'); };
ws.onmessage = function(msg) {
  var body = JSON.parse(msg.data);

  //console.log(body.from, body.type);

  if (!(body.from in ctxts))
    actions.newCanvas(body.from);

  if (!(body.from in activeBrushes))
    actions.changeBrush(body.from, 'randomWidthPencil');

  if (body.type == 'your id')
    document.querySelector('canvas#client' + body.from).style.zIndex = 1;

  else if (body.type == 'change brush')
    actions.changeBrush(body.from, body.data);

  else
    actions.draw(body.from, body.type, body.data);
};

var actions = {};

actions.newCanvas = function(id, onTop) {
  onTop = onTop || false;

  var newCanvas = document.createElement('canvas');
  newCanvas.setAttribute('id', 'client' + id);
  newCanvas.setAttribute('width', window.innerWidth);
  newCanvas.setAttribute('height', window.innerHeight - 50);

  var canvases = document.querySelector('#canvases');
  canvases.appendChild(newCanvas);

  ctxts[id] = newCanvas.getContext('2d');
};

actions.changeBrush = function(id, brushName) {
  var ctxt = ctxts[id];

  activeBrushes[id] = Object.create(brushes[brushName]);
  restoreDefaults(ctxt);
  activeBrushes[id].setup(ctxt);
};

actions.draw = function(id, operation, point) {
  var brush = activeBrushes[id];
  var ctxt = ctxts[id];
  brush[operation](ctxt, point);
}

function send(msgType, data) {
  var msg = {
    type: msgType,
    data: data,
  };
  //console.log(msg, JSON.stringify(msg));
  ws.send(JSON.stringify(msg));
}

function startDrawing(event) {
  drawingArea.addEventListener('mousemove', draw);
  //console.log(event);
  send('down', { x: event.layerX, y: event.layerY });
  //currentBrush.down({ x: event.clientX, y: event.clientY });
}

function stopDrawing(event) {
  drawingArea.removeEventListener('mousemove', draw);
  send('up', { x: event.layerX, y: event.layerY });
  //currentBrush.up({ x: event.clientX, y: event.clientY });
}

function draw(event) {
  send('move', { x: event.layerX, y: event.layerY });
  //currentBrush.move({ x: event.clientX, y: event.clientY });
}

function changeBrush(brush) {
  send('change brush', brush);

  // currentBrush = brushes[brush];
  // restoreDefaults();
  // currentBrush.setup();
}

function restoreDefaults(ctxt) {
  var prop = [
    'fillStyle',
    'strokeStyle',
    'globalAlpha',
    'lineWidth',
    'lineJoin',
    'lineCap',
    'shadowBlur',
    'shadowColor',
  ]

  prop.forEach(function(p) {
    ctxt[p] = defaultCtxt[p];
  });
}

// Brushes based on http://perfectionkills.com/exploring-canvas-drawing-techniques/

var brushes = {};

brushes.simplePencil = {
  setup: function(ctxt) {
    ctxt.lineWidth = 1;
    ctxt.lineJoin = ctxt.lineCap = 'round';
  },

  down: function(ctxt, point) {
    ctxt.beginPath();
    ctxt.moveTo(point.x, point.y);
  },

  move: function(ctxt, point) {
    ctxt.lineTo(point.x, point.y);
    ctxt.stroke();
  },

  up: function(ctxt, point) {},
};

brushes.smoothPencil = {
  __proto__: brushes.simplePencil,

  setup: function(ctxt) {
    ctxt.lineWidth = 10;
    ctxt.lineJoin = ctxt.lineCap = 'round';
  },
};

brushes.edgeSmoothPencil = {
  __proto__: brushes.smoothPencil,

  setup: function(ctxt) {
    ctxt.lineWidth = 3;
    ctxt.lineJoin = ctxt.lineCap = 'round';
    ctxt.shadowBlur = 10;
    ctxt.shadowColor = 'black';
  },
};

brushes.pointsPencil = {
  __proto__: brushes.simplePencil,

  setup: function(ctxt) {
    ctxt.lineWidth = 7;
    ctxt.lineJoin = ctxt.lineCap = 'round';
  },

  down: function(ctxt, point) {
    this.lastPoint = point;
  },

  move: function(ctxt, point) {
    this.draw(ctxt, point);
    this.lastPoint = point;
  },

  draw: function(ctxt, point) {
    ctxt.beginPath();
    ctxt.moveTo(this.lastPoint.x, this.lastPoint.y);
    ctxt.lineTo(point.x, point.y);
    ctxt.stroke();
  },
};

brushes.gradientPencil = {
  __proto__: brushes.pointsPencil,

  draw: function(ctxt, point) {
    var gradient = ctxt.createRadialGradient(point.x, point.y, 5,
                                             point.x, point.y, 10);

    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.5, 'rgba(0,0,0,0.5)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctxt.fillStyle = gradient;
    ctxt.fillRect(point.x - 10, point.y - 10, 20, 20);
  }
};

brushes.interpolatedPencil = {
  __proto__: brushes.gradientPencil,

  move: function(ctxt, point) {
    // Polar coordinates
    var d = utils.distanceBetween(this.lastPoint, point);
    var th = utils.angleBetween(this.lastPoint, point);
    var interPoint = { x: this.lastPoint.x, y: this.lastPoint.y };
    var step = 3;

    for (var i = step; i < d; i += step) {
      interPoint.x += Math.cos(th) * step;
      interPoint.y += Math.sin(th) * step;
      this.draw(ctxt, interPoint);
      this.lastPoint = interPoint;
    }

    this.draw(ctxt, point);
    this.lastPoint = point;
  },
};

brushes.interpolatedEraser = {
  __proto__: brushes.interpolatedPencil,

  draw: function(ctxt, point) {
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

  draw: function(ctxt, point) {
    ctxt.lineWidth = Math.random() * 2 + 3;
    brushes.pointsPencil.draw.call(this, ctxt, point);
  }
},

brushes.dotsPencil = {
  setup: function(ctxt) {},
  down: function(ctxt, point) {},

  move: function(ctxt, point) {
    ctxt.beginPath();
    ctxt.arc(point.x, point.y, Math.random() * 15 + 5, false, Math.PI * 2);
    ctxt.fill();
  },

  up: function(ctxt, point) {},
};

brushes.trippyDots = {
  __proto__: brushes.dotsPencil,

  setup: function(ctxt) {
    ctxt.fillStyle = hueToColor(randomHue());
  },

  move: function(ctxt, point) {
    ctxt.globalAlpha = Math.random();
    brushes.dotsPencil.move.call(this, ctxt, point);
  },
};

brushes.neighborPointsPencil = {
  __proto__: brushes.pointsPencil,

  setup: function(ctxt) {
    ctxt.lineWidth = 1;
    this.points = [];
  },

  down: function(ctxt, point) {
    this.points.push(point);
  },

  draw: function(ctxt, point) {
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

  up: function(ctxt, point) {
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
};

function randomHue() {
  return Math.floor(Math.random() * 360);
}

function hueToColor(hue) {
  return 'hsl(' + hue + ', 60%, 50%)';
}
