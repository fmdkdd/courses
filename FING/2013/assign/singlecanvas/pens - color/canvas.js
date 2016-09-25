document.addEventListener('DOMContentLoaded', init);

var canvas;
var ctxt;
var lastPoint;
var pen;

function init() {
	canvas = document.querySelector('canvas');
	ctxt = canvas.getContext('2d');

	window.addEventListener('resize', function() {
		canvas.setAttribute('width', window.innerWidth - 5);
		canvas.setAttribute('height', window.innerHeight - 50);

		setupContext();
	});

	window.dispatchEvent(new Event('resize'));

	var buttons = document.querySelectorAll('button');
	for (var i = 0; i < buttons.length; ++i) {
		var b = buttons[i];
		b.addEventListener('click', function(event) {
			changePen(event.target.getAttribute('data-color'));
		});
	}

	canvas.addEventListener('mousedown', startDrawing);
	canvas.addEventListener('mouseup', stopDrawing);
}

function changePen(color) {
	pen = color;
}

function setupContext() {
	ctxt.lineWidth = 5;
	ctxt.lineCap = 'round';
}

function startDrawing(event) {
	canvas.addEventListener('mousemove', draw);

	lastPoint = { x: event.pageX, y: event.pageY };
}

function stopDrawing() {
	canvas.removeEventListener('mousemove', draw);
}

function draw(event) {
	var currentPoint = { x: event.pageX, y: event.pageY };

	if (pen === 'red')
		drawSegment(lastPoint, currentPoint, 'red');
	else if (pen === 'green')
		drawSegment(lastPoint, currentPoint, 'green');
	else
		drawSegment(lastPoint, currentPoint, 'black');

	lastPoint = currentPoint;
}

function drawSegment(p1, p2, color) {
	ctxt.strokeStyle = color;

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
