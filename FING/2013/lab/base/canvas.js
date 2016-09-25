document.addEventListener('DOMContentLoaded', init);

var ctxt;

function init() {
  var canvas = document.querySelector('canvas');

  ctxt = canvas.getContext('2d');

  canvas.addEventListener('mousemove', draw);
}

function draw(event) {
  var x = event.pageX;
  var y = event.pageY;

  ctxt.beginPath();
  ctxt.moveTo(x, y);
  ctxt.lineTo(x + 1, y + 1);
  ctxt.stroke();
}
