/* eslint-env browser */

document.addEventListener('DOMContentLoaded', init);

var ctxt;

function init() {
  var canvas = document.querySelector('canvas');
  ctxt = canvas.getContext('2d');

  canvas.addEventListener('mousemove', send);
}

// Serialize coordinates then send to the server
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

var url = 'ws:' + document.location.hostname + ':3001';
var ws = new WebSocket(url);
ws.onopen = function() { console.log('CONNECTED'); };
ws.onclose = function() { console.log('DISCONNECTED'); };

// When a message is received from the server, draw the point
ws.onmessage = function(event) {
  // Need to unserialize data first
  var point = JSON.parse(event.data);
  draw(point);
};
