document.addEventListener('DOMContentLoaded', init);

var canvas;
var ctxt;
var lastPoints = [];
var pen;

function init() {
	canvas = document.querySelector('canvas');
	ctxt = canvas.getContext('2d');

  // Fit canvas to window, but leave place for buttons
	window.addEventListener('resize', function() {
		canvas.setAttribute('width', window.innerWidth - 5);
		canvas.setAttribute('height', window.innerHeight - 50);
	});

  // Initial resize
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
}

function changePen(brush) {
	pen = brush;
}

function setupContext() {
	ctxt.lineCap = 'round';
	ctxt.lineJoin = 'round';
	ctxt.shadowBlur = 4;
}

function startDrawing(event) {
	canvas.addEventListener('mousemove', draw);

	lastPoints.push({ x: event.pageX, y: event.pageY });
}

function stopDrawing() {
	canvas.removeEventListener('mousemove', draw);
}

function draw(event) {
	var currentPoint = { x: event.pageX, y: event.pageY };

	if (pen === 'dots')
		drawPoint(currentPoint, 'black');
	else if (pen === 'lines')
		drawSegment(lastPoints[lastPoints.length-1], currentPoint, 'black');
	else if (pen === 'curves')
		drawCurve(lastPoints, 'black');
	else if (pen === 'erase')
		drawSegment(lastPoints[lastPoints.length-1], currentPoint, 'white', 15);
	else
		drawSegment(lastPoints[lastPoints.length-1], currentPoint, 'black');

	lastPoints.push(currentPoint);
}

function drawPoint(p, color) {
	setupContext();
	ctxt.fillStyle = color;
	ctxt.shadowColor = color;

	ctxt.beginPath();
	ctxt.arc(p.x, p.y, 5, 0, 2 * Math.PI);
	ctxt.fill();
}

function drawCurve(lastPoints, color) {
	if (lastPoints.length < 3)
		return;

	setupContext();
	ctxt.lineWidth = 5;
	ctxt.strokeStyle = color;
	ctxt.shadowColor = color;

	var last = lastPoints[lastPoints.length-1];
	var middle = lastPoints[lastPoints.length-2];
	var first = lastPoints[lastPoints.length-3];

	ctxt.beginPath();
	ctxt.moveTo(first.x, first.y);
	ctxt.quadraticCurveTo(middle.x, middle.y, last.x, last.y);
	ctxt.stroke();
}

function drawSegment(p1, p2, color, lineWidth) {
	setupContext();
	ctxt.lineWidth = lineWidth || 5;
	ctxt.strokeStyle = color;
	ctxt.shadowColor = color;

	ctxt.beginPath();
	ctxt.moveTo(p1.x, p1.y);
	ctxt.lineTo(p2.x, p2.y);
	ctxt.stroke();
}

function randomHue() {
	return Math.floor(Math.random() * 360);
}

function hueToColor(hue) {
	return 'hsl(' + hue + ', 60%, 50%)';
}
