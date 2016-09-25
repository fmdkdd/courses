document.addEventListener('DOMContentLoaded', init);

var canvas;
var ctxt;
var isDrawing = false;
var lastPoints = [];

var penTraits = {
  linePen: {
    setupContext: function() {
		  ctxt.lineCap = 'round';
		  ctxt.lineJoin = 'round';

		  ctxt.lineWidth = 5;
		  ctxt.strokeStyle = this.color;

		  ctxt.shadowBlur = 4;
		  ctxt.shadowColor = this.color;
	  },

	  draw: function(currentPoint) {
		  this.setupContext();

		  var last = points[points.length-1];
		  var beforeLast = points[points.length-2];

		  ctxt.beginPath();
		  ctxt.moveTo(beforeLast.x, beforeLast.y);
		  ctxt.lineTo(last.x, last.y);
		  ctxt.stroke();
	  },
  },
};

var pen = {

};

var erasePen = {
	__proto__: pen,

	setupContext: function(color) {
		ctxt.strokeStyle = 'white';
		ctxt.shadowColor = 'white';
		ctxt.lineWidth = 30;
	},
};

var dotPen = {
	__proto__: pen,

	setupContext: function(color) {
		this.__proto__.setupContext();

		ctxt.shadowColor = color;
		ctxt.fillStyle = color;
	},

	draw: function(points, color) {
		this.setupContext(color);

		var p = points[points.length-1];
		var radius = 5;

		ctxt.beginPath();
		ctxt.arc(p.x, p.y, radius, 0, 2 * Math.PI);
		ctxt.fill();
	}
};

var curvesPen = {
	__proto__: pen,

	draw: function(points, color) {
		this.setupContext(color);

		var last = lastPoints[lastPoints.length-1];
		var middle = lastPoints[lastPoints.length-2];
		middle.x += Math.random() * 5 - 10;
		middle.y += Math.random() * 5 - 10;
		var first = lastPoints[lastPoints.length-3];

		ctxt.beginPath();
		ctxt.moveTo(first.x, first.y);
		ctxt.quadraticCurveTo(middle.x, middle.y, last.x, last.y);
		ctxt.stroke();
	}
};

var currentPen = {
	__proto__: pen,

	// State specific to this pen, instead of globals
	currentHue: randomHue(),

	color: function() {
		this.currentHue = this.currentHue + 1 % 360;
		return hueToColor(this.currentHue);
	},
};

function init() {
	canvas = document.querySelector('canvas');
	ctxt = canvas.getContext('2d');

	window.addEventListener('resize', function() {
		canvas.setAttribute('width', window.innerWidth - 5);
		canvas.setAttribute('height', window.innerHeight - 50);
	});

	window.dispatchEvent(new Event('resize'));

	var buttons = document.querySelectorAll('button');
	for (var i = 0; i < buttons.length; ++i) {
		var b = buttons[i];
		b.addEventListener('click', function(event) {
			changePen(event.target.getAttribute('data-brush'));
		});
	}

	canvas.addEventListener('mousedown', startDrawing);
	canvas.addEventListener('mouseup', stopDrawing);
	canvas.addEventListener('mousemove', draw);
}

var pens = {
	'dots': dotPen,
	'lines': pen,
	'erase': erasePen,
	'curves': curvesPen,
};

function changePen(brush) {
	currentPen.__proto__ = pens[brush];
}

function startDrawing(event) {
	isDrawing = true;

	lastPoints.push({ x: event.pageX, y: event.pageY });
}

function stopDrawing() {
	isDrawing = false;
}

function draw(event) {
	var currentPoint = { x: event.pageX, y: event.pageY };
	lastPoints.push(currentPoint);

	if (isDrawing)
		currentPen.draw(lastPoints, currentPen.color());
}

function randomHue() {
	return Math.floor(Math.random() * 360);
}

function hueToColor(hue) {
	return 'hsl(' + hue + ', 60%, 50%)';
}
