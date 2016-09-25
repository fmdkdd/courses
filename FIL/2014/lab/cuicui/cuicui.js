// A page is a current picture and a list of pictures.
//
// The current picture is editable, and can be saved with a button.
// When saved, the current picture is sent to the server and erased
// locally.
//
// When a new pic is published on the server, the server notifies the
// client.
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
  var $username = document.querySelector('#username');

  publishPic.addEventListener('click', function() {
    publish($current, $username.value);
    ctxt.clearRect(0, 0, $current.width, $current.height);
  });

  setInterval(function() {
    refresh(function(pics) {
      picList.replace(pics);
    });
  }, 1000);
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

  replace: function(pics) {
    var f = document.createDocumentFragment();

    pics.forEach(function(p) {
      var $img = document.createElement('img');
      $img.setAttribute('src', p.png);
      f.insertBefore($img, f.firstChild);
    });

    this.$root.innerHTML = '';
    this.$root.appendChild(f);
  },
};

function publish($canvas, user) {
  var ctxt = $canvas.getContext('2d');
  ctxt.font = '15px serif';
  ctxt.fillText(user, 0, 15);

  var png = $canvas.toDataURL();
  var data = {
    user: user,
    png: png,
  };

  var req = new XMLHttpRequest();
  req.open('POST', '/pics', true);
  req.send(JSON.stringify(data));
}

function refresh(callback) {
  var req = new XMLHttpRequest();
  req.open('GET', '/pics', true);
  req.responseType = 'json';
  req.onload = function(req) {
    callback(req.target.response);
  };
  req.send();
}
