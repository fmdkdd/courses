/* eslint-env browser */

var Tile = {
  symbols: {
    ' ': Empty,
    '$': Coin,
    '@': Jumper,
    '#': Wall,
    '~': Lava,
  },

  new: function(x, y) {
    return {
      __proto__: this,
      x: x, y: y,
    };
  },

  draw: function() {
    var $e = document.createElement('td');
    $e.classList.add(this.type);
    return $e;
  },
};



var Vector = {
  new: function(x,y) {
    return {
      __proto__: this,
      x: x, y: y,
    };
  },
};

var Jumper = {
  new: function(x,y) {
    return {
      __proto__: this,
      pos: Vector.new(x,y),
      speed: Vector.new(0,0),
    };
  },
};

var Level = {
  new: function(map) {
    var tiles = [];
    var height = map.length;
    var width = map[0].length;

    for (var y = 0; y < height; y++) {
      var line = [];
      for (var x = 0; x < width; x++) {
        var tile = Tile.symbols[map[y][x]];
        line.push(tile.new(x, y));
      }
      tiles.push(line);
    }

    return {
      __proto__: this,
      height: height,
      width: width,
      tiles: tiles,
    };
  },

  draw: function() {
    var $e = document.createDocumentFragment();
    this.tiles.forEach(function(line) {
      var $r = document.createElement('tr');
      line.forEach(function(t) {
        $r.appendChild(t.draw());
      });
      $e.appendChild($r);
    });
    return $e;
  },
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  var $map = document.querySelector('#map');
  var level = Level.new($map.textContent
                        .trim()
                        .split('\n')
                        .map(function(line) { return line.split(''); }));

  var $level = document.querySelector('#level');
  $level.innerHTML = '';
  $level.appendChild(level.draw());
}

function values(obj) {
  var vals = [];
  for (var p in obj) {
    vals.push(obj[p]);
  }
  return vals;
}
