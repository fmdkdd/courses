// A page is a current picture and a list of pictures.
//
// The current picture is editable, and can be saved with a button.
// Once saved, the current picture is pushed in front of the list, and
// the current picture is painted white.
//
// Pictures in the list are not editable.

document.addEventListener('DOMContentLoaded', init);

function init() {
  var $current = document.querySelector('#current');
  var ctxt = $current.getContext('2d');

  pen.ctxt = ctxt;

  $current.addEventListener('mousedown', function(event) {
    pen.down(relativeMouseCoords($current, event));
  });

  $current.addEventListener('mouseup', function(event) {
    pen.up(relativeMouseCoords($current, event));
  });

  $current.addEventListener('mousemove', function(event) {
    pen.move(relativeMouseCoords($current, event));
  });

  picList.$root = document.querySelector('#pic-list');
  var publishPic = document.querySelector('#publish-pic');

  publishPic.addEventListener('click', function() {
    picList.push($current);
  });
}

var pen = {
  drawing: false,
  ctxt: null,

  down: function() {
    this.drawing = true;
  },

  up: function() {
    this.drawing = false;
  },

  move: function(xy) {
    if (!this.drawing) return;

    this.ctxt.fillStyle = 'rebeccapurple';
    this.ctxt.fillRect(xy[0], xy[1], 3, 3);
  },
};

function relativeMouseCoords($obj, event) {
  var rect = $obj.getBoundingClientRect();
  return [event.clientX - rect.left, event.clientY - rect.top];
}

var picList = {
  $root: null,

  push: function($pic) {
    // Create copy canvas
    var p = document.createElement('canvas');
    var c = p.getContext('2d');
    c.drawImage($pic, 0, 0);

    // Erase given canvas
    $pic.getContext('2d').clearRect(0, 0, $pic.width, $pic.height);

    // Insert in front of the list
    this.$root.insertBefore(p, this.$root.firstChild);
  },
};
