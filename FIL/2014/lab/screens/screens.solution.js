/* eslint-env browser */

// # Objects for user interfaces

// Abstractions are very useful in user interface programming as they
// hide the implementation details and promote reuse.  They are
// especially valuable in the browser, where specifications are always
// evolving and properties, function names change often.

// We are going to define two different objects to abstract a "screen"
// used to draw basic figures.  The first will use the Canvas API, the
// second will use an HTML table where each pixel is a 'td' cell.

// ## The entry point

// When the document is loaded ...
document.addEventListener('DOMContentLoaded', init);

// Here is a test for our two objects.  They have exactly the same
// interface.  They are created with:
// - an element in the DOM (for attaching the table or canvas)
// - width and height, the dimension of the screen in pixels
// - a scale: each pixel of the screen will be scaled to this number
//   of actual pixels on our monitor
function init() {
  var dom = DOMScreen.new(document.querySelector('#dom-screen'), 64, 64, 8);
  var cnv = CanvasScreen.new(document.querySelector('#canvas-screen'), 64, 64, 8);

  [dom, cnv].forEach(function(screen) {
    // Should display one pixel in each corner
    screen.putPixel(0, 0, 'pink');
    screen.putPixel(0, 63, 'red');
    screen.putPixel(63, 0, 'blue');
    screen.putPixel(63, 63, 'purple');
    // One empty rectangle
    screen.strokeRect(1, 1, 16, 8, 'green');
    // Two fill squares
    screen.fillRect(1, 55, 8, 8, 'pink');
    screen.fillRect(10, 10, 10, 10, 'rebeccapurple');
  });
}

// ## The abstract screen

// `Screen` contains high-level drawing functions that only use the
// basic `putPixel`.  `putPixel` is specific to each screen
// implementation and takes three arguments: `x`, `y` and `color`.
var Screen = {
  fillRect: function(left, top, width, height, color) {
    for (var x=left; x < left + width; ++x)
      for(var y=top; y < top + height; ++y)
        this.putPixel(x, y, color);
  },

  strokeRect: function(left, top, width, height, color) {
    for (var x=left; x < left + width; ++x) {
      this.putPixel(x, top, color);
      this.putPixel(x, top + height - 1, color);
    }
    for (var y=top; y < top + height; ++y) {
      this.putPixel(left, y, color);
      this.putPixel(left + width - 1, y, color);
    }
  },
};

// ## The DOM screen

// This screen implementation uses an HTML table for the drawing
// surface.  Each pixel is an HTML 'td' cell.  Its prototype is also
// `Screen`.
var DOMScreen = {
  __proto__: Screen,

  // The `new` function creates creates an HTML 'table', `height` 'tr'
  // elements, each with `width` 'td' cells of fixed size (`scale`).
  new: function($root, width, height, scale) {
    var $table = document.createElement('table');
    $table.style.tableLayout = 'fixed';
    $table.style.borderCollapse = 'collapse';

    for (var y = 0; y < height; y++) {
      var $tr = document.createElement('tr');
      for (var x = 0; x < width; x++) {
        var $td = document.createElement('td');
        $td.style.height = scale + 'px';
        $td.style.width = scale + 'px';
        $td.setAttribute('data-x', x);
        $td.setAttribute('data-y', y);
        $tr.appendChild($td);
      }
      $table.appendChild($tr);
    }

    $root.appendChild($table);

    return {
      __proto__: this,
      $root: $root,
      $table: $table,
      height: height,
      width: width,
      scale: scale,
    };
  },

  // `putPixel` uses `element.childNodes` to access the 'td' cell at
  // `(x,y)` and change its 'backgroundColor' style attribute.
  putPixel: function(x, y, color) {
    this.$table.childNodes[y].childNodes[x].style.backgroundColor = color;
  },
};

// ## The Canvas screen

// This screen implementation uses the canvas as the drawing surface.
// Its prototype is `Screen`.
var CanvasScreen = {
  __proto__: Screen,

  // The `new` function creates the HTML canvas element, gets its 2d
  // context, appends the canvas to the `$root` element and return a
  // new `CanvasScreen`.
  new: function($root, width, height, scale) {
    var $canvas = document.createElement('canvas');
    $canvas.setAttribute('width', width * scale);
    $canvas.setAttribute('height', height * scale);

    var ctxt = $canvas.getContext('2d');
    ctxt.scale(scale, scale);

    $root.appendChild($canvas);

    return {
      __proto__: this,
      $root: $root,
      $canvas: $canvas,
      ctxt: ctxt,
      height: height,
      width: width,
      scale: scale,
    };
  },

  // The `putPixel` function sets the pixel at `(x,y)` to the given
  // `color` using the canvas context (`fillStyle` and `fillRect`).
  putPixel: function(x, y, color) {
    this.ctxt.fillStyle = color;
    this.ctxt.fillRect(x, y, 1, 1);
  },
};
