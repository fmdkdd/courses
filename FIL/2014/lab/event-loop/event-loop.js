// A simple event-loop mechanism, like the one in JS interpreters.

document.addEventListener('DOMContentLoaded', init);

function init() {
  on('click', b);
  on('click', c);

  var $button = document.querySelector('#button');
  $button.addEventListener('click', function() { emit('click'); });

  setInterval(dispatchEvents, 500);
}

function b() {
  console.log('b');
}

function c() {
  console.log('c');
}

var listeners = {};
var eventQueue = [];

function on(event, callback) {
  if (listeners[event] == null)
    listeners[event] = [];
  listeners[event].push(callback);
}

function emit(event) {
  eventQueue.push(event);
}

function dispatchEvents() {
  var call = Function.prototype.call.bind(Function.prototype.call);

  var queue = eventQueue;
  eventQueue = [];

  queue.forEach(function(e) {
    if (listeners[e])
      listeners[e].forEach(call);
  });
}
