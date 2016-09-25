document.addEventListener('DOMContentLoaded', init);

var ctxt;

function init() {
  var canvas = document.querySelector('canvas');

  ctxt = canvas.getContext('2d');

  canvas.addEventListener('mousemove', send);
}

function send(event) {
  var point = { x: event.pageX, y: event.pageY };
	ws.send(JSON.stringify(point));
}

function draw(point) {
  var x = point.x;
  var y = point.y;

  ctxt.beginPath();
  ctxt.moveTo(x, y);
  ctxt.lineTo(x + 1, y + 1);
  ctxt.stroke();
}

// Setup WebSocket

var url = 'ws:' + document.URL.split(':')[1] + ':8080';
var ws = new WebSocket(url);
ws.onopen = function() { console.log('CONNECT'); };
ws.onclose = function() { console.log('DISCONNECT'); };
ws.onmessage = function(event) {
  var point = JSON.parse(event.data);
  draw(point);
};
