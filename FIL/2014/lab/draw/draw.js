document.addEventListener('DOMContentLoaded', init);

var drawing = false;
var $canvas;
var ctxt;

function init() {
  $canvas = document.querySelector('#canvas');
  ctxt = $canvas.getContext('2d');

  $canvas.addEventListener('mousedown', startDrawing);
  $canvas.addEventListener('mouseup', stopDrawing);
  $canvas.addEventListener('mousemove', draw);
}

function startDrawing() {
  drawing = true;
}

function stopDrawing() {
  drawing = true;
}

function draw(event) {
  if (!drawing) return;

  var xy = relativeMouseCoords($canvas, event);

  ctxt.fillStyle = 'rebeccapurple';
  ctxt.fillRect(xy[0], xy[1], 3, 3);
}

function relativeMouseCoords($obj, event) {
  var rect = $obj.getBoundingClientRect();
  return [event.clientX - rect.left, event.clientY - rect.top];
}
