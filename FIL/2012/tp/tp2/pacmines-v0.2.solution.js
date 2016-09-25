//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Level

function initLevel(map) {
	var tiles = [];

	for (var y=0, height = map.length; y < height; ++y) {
		for (var x=0, width = map[y].length; x < width; ++x) {
			var tile = createTileFromMap(map[y][x]);
			tile.x = x;
			tile.y = y;
			tiles.push(tile);
		}
	}

	return {
		height: height,
		width: width,
		tiles: tiles,
	};
}

function extendLevel(level) {
	level.getTileByXY = function(x,y) {
		return this.tiles[y * this.width + x];
	};
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tiles

function createTileFromMap(mapChar) {
	const mapLegend = {
		'#': Wall,
		' ': Floor,
		'.': Dot,
	};

	if (mapLegend[mapChar])
		return Object.create(mapLegend[mapChar]);
	else
		return Object.create(Tile);
}

var Tile = {
	height: tileHeight,
	width: tileWidth,
	color: 'pink',
	draw: Pacmines.painters.tile,

	getType: function() {
		return Object.getPrototypeOf(this);
	},

	changeType: function(type) {
		setPrototype(this, type);
	},
};

var Wall = mixin(Object.create(Tile), {
	color: '#00b'
});

var Floor = mixin(Object.create(Tile), {
	color: 'black'
});

var Dot = mixin(Object.create(Tile), {
	color: '#ffb897',
	height: 2,
	width: 2
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Utils

function mixin(obj, donor) {
	for (var prop in donor)
		obj[prop] = donor[prop];
	return obj;
}

function setPrototype(obj, proto) {
	obj.__proto__ = proto;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Events

function addMouseListeners(game) {
	var canvas = game.canvasContext.canvas;

	canvas.addEventListener('mousemove', function(event) {
		processMouseMove(event, game);
	});

	canvas.addEventListener('click', function(event) {
		processMouseClick(event, game);
	});
}

function processMouseClick(event, game) {
	const tileTypes = [Wall, Floor, Dot];

	function cycleTileType(tile) {
		var idx = tileTypes.indexOf(tile.getType());
		var newIdx = (1 + idx) % tileTypes.length;
		tile.changeType(tileTypes[newIdx]);
	}

	if (event.button == 0) {	  // Left button
		var tileXY = Pacmines.screenToCanvasXY(event);
		var tile = game.level.getTileByXY(tileXY.x, tileXY.y);
		if (tile)
			cycleTileType(tile);
	}
}

function processMouseMove(event, game) {
	var tileXY = Pacmines.screenToCanvasXY(event);
	var tile = game.level.getTileByXY(tileXY.x, tileXY.y);

	if (tile)
		game.highlightedTile = tile;
}
