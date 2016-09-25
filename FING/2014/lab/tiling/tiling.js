/* eslint-env browser */

var $ = document.querySelector.bind(document);

document.addEventListener('DOMContentLoaded', init);

function init() {
  var $screen = document.querySelector('#screen');
  manager.init($screen);

  $('#new-window').addEventListener('click', function() {
    manager.newFrame();
    manager.reflow();
  });

  $('#horizontal-flow').addEventListener('click', function() {
    manager.flowStyle = horizontalFlow;
    manager.reflow();
  });

  $('#vertical-flow').addEventListener('click', function() {
    manager.flowStyle = verticalFlow;
    manager.reflow();
  });

  $('#full-flow').addEventListener('click', function() {
    manager.flowStyle = fullFlow;
    manager.reflow();
  });

  $('#increase-master').addEventListener('click', function() {
    manager.increaseMaster();
    manager.reflow();
  });

  $('#decrease-master').addEventListener('click', function() {
    manager.decreaseMaster();
    manager.reflow();
  });
}

var horizontalFlow = {
  reflow: function(manager) {
    var h = manager.height;
    if (manager.masterSize > 0 && manager.masterSize < manager.frames.length)
      h /= 2;
    var y = manager.height - h;

    // Master frames
    var frames = manager.frames.slice(0, manager.masterSize);
    var w = manager.width / frames.length;
    frames.forEach(function(f, i) {
      f.resize(w, h);
      f.move(i * w, 0);
      f.show();
    });

    // Rest frames
    frames = manager.frames.slice(manager.masterSize);
    w = manager.width / frames.length;
    frames.forEach(function(f, i) {
      f.resize(w, h);
      f.move(i * w, y);
      f.show();
    });
  },
};

var verticalFlow = {
  reflow: function(manager) {
    // Flow by master/rest parts
    var w = manager.width;
    if (manager.masterSize > 0 && manager.masterSize < manager.frames.length)
      w /= 2;
    var x = manager.width - w;

    // Master frames
    var frames = manager.frames.slice(0, manager.masterSize);
    var h = manager.height / frames.length;
    frames.forEach(function(f, i) {
      f.resize(w, h);
      f.move(0, i * h);
      f.show();
    }.bind(manager));

    // Rest frames
    frames = manager.frames.slice(manager.masterSize);
    h = manager.height / frames.length;
    frames.forEach(function(f, i) {
      f.resize(w, h);
      f.move(x, i * h);
      f.show();
    });
  },
};

var fullFlow = {
  reflow: function(manager) {
    var w = manager.width;
    var h = manager.height;
    manager.frames.forEach(function(f, i) {
      if (i === 0) {
        f.resize(w, h);
        f.move(0, 0);
        f.show();
      } else {
        f.hide();
      }
    });
  },
};

// What is a prototype manager when it needs a $root that does not
// exist before the DOM is ready?

var manager = {
  frames: [],
  masterSize: 1,
  $screen: null,
  width: 800, height: 600,
  counter: 0,

  init: function($screen) {
    this.layout = verticalFlow;

    this.$screen = $screen;
    $screen.style.width = this.width + 'px';
    $screen.style.height = this.height + 'px';
  },

  newFrame: function(pane) {
    var f = Object.create(frame);
    //f.pane = pane;
    f.name = 'Frame ' + this.counter;
    this.counter += 1;
    this.add(f);
  },

  add: function(frame) {
    frame.attach(this.$screen);
    this.frames.push(frame);
  },

  remove: function(frame) {
    this.frames.splice(this.frames.indexOf(frame), 1);
    this.$screen.removeChild(frame.$frame);
  },

  reflow: function() {
    this.layout.reflow(this);
  },

  increaseMaster: function() {
    this.masterSize = Math.min(this.masterSize + 1, this.frames.length);
  },

  decreaseMaster: function() {
    this.masterSize = Math.max(this.masterSize - 1, 0);
  },
};

var canvas = {
  name: 'Canvas',
  $canvas: document.createElement('canvas'),

  init: function() {
    this.$canvas = document.createElement('canvas');
    this.$ctxt = this.$canvas.getContext('2d');

    return this;
  },

  rename: function(name) {
    this.name = name;
  },

  draw: function() {
    this.$ctxt.fillRect(10,10,10,10);
  },
}.init();

var $frame = document.createElement('div');
var $frameHeader = document.createElement('div');
$frameHeader.classList.add('frameheader');
var $title = document.createElement('h2');
$frameHeader.appendChild($title);
$title.textContent = 'Frame';
var $close = document.createElement('button');
$close.textContent = 'Close';
$frameHeader.appendChild($close);
$frame.appendChild($frameHeader);

var frame = {
  x: 0, y: 0,
  width: 100, height: 100,
  pane: canvas,

  init: function() {
    this.$frame = $frame.cloneNode(true);
    this.move(this.x, this.y);

    this.$label = this.$frame.querySelector('h2');
    this.rename(this.pane.name);

    this.$frame.querySelector('button')
      .addEventListener('click', function() {
        manager.remove(this);
        manager.reflow();
      }.bind(this));

    return this;
  },

  new: function() {
    var o = Object.create(this);
    o.init();
    return o;
  },

  attach: function($root) {
    $root.appendChild(this.$frame);
  },

  move: function(x, y) {
    this.x = x;
    this.$frame.style.left = x + 'px';
    this.y = y;
    this.$frame.style.top = y + 'px';
  },

  resize: function(width, height) {
    this.width = width;
    this.$frame.style.width = width + 'px';
    this.height = height;
    this.$frame.style.height = height + 'px';
  },

  rename: function(name) {
    this.$label.textContent = name;
  },

  show: function() {
    this.$frame.style.display = 'block';
  },

  hide: function() {
    this.$frame.style.display = 'none';
  },
}.init();
