// Start this after all content has been loaded
window.addEventListener('load', function() {
	// Create empty game object
	var game = {};

	// Create rendering context
	var canvas = document.querySelector('#canvas');
	game.canvasContext = Pacmines.initCanvas(canvas);

	// Initialize level map
	var rawMap = document.querySelector('#map');
	var map = explodeASCIIMap(rawMap.textContent);
	game.level = initLevel(map);

	// Initialize sprites
	initSprites(game);

	// Listen to mouse events
	// canvas.addEventListener('mousemove', function(event) {
	// 	processMouseMove(event, game);
	// });

	// canvas.addEventListener('click', function(event) {
	// 	processMouseClick(event, game);
	// });

	// Listen to keyboard events
	document.addEventListener('keydown', function(event) {
		processKey(event.keyCode, game);
	});

	// Go!
	Pacmines.startGameLoop(function() { gameLoop(game); });
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Game loop

function gameLoop(game) {
	update(game);
	redraw(game);
}

function update(game) {
	Pacmines.moveSprite(game.waka, game);

	// Collision detection
	if (game.waka.tile.getType() == Dot) {
		game.waka.tile.changeType(Floor);
		game.waka.pillsEaten++;
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Events

function processMouseClick(event, game) {
	const tileTypes = [Wall, Floor, Dot];

	function cycleTileType(tile) {
		var idx = tileTypes.indexOf(tile.getType());
		tile.changeType(tileTypes[(1 + idx) % tileTypes.length]);
	}

	if (event.button == 0) {	  // Left button
		var tileXY = Pacmines.screenToCanvasXY(event);
		var tile = game.level.getTileByXY(tileXY);
		if (tile)
			cycleTileType(tile);
	}
}

function processMouseMove(event, game) {
	var tileXY = Pacmines.screenToCanvasXY(event);
	var tile = game.level.getTileByXY(tileXY);

	if (tile)
		game.highlightedTile = tile;
}

const left = 69;
const right = 79;
const up = 89;
const down = 73;
const movementKeys = [left, right, up, down];

function processKey(keyCode, game) {
	if (movementKeys.indexOf(keyCode) > -1)
		game.waka.requestedDirection = keyCode;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Level

function explodeASCIIMap(string) {
	return string
		.trim()
		.split('\n')
		.map(function(string) { return string.split(''); });
}

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

		getTileByXY: function(x,y) {
			if (arguments.length > 1)
				return this.tiles[y * this.width + x];
			else
				return this.tiles[x.y * this.width + x.x];
		},

		findTile: function(test) {
			var result;

			this.tiles.some(function(tile) {
				if (test(tile)) {
					result = tile;
					return true;
				}
			});

			return result;
		},

		findTileByType: function(type) {
			return this.findTile(function(tile) {
				return tile.getType() == type;
			});
		},
	};
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Drawing

function redraw(game) {
	Pacmines.clearCanvas(game.canvasContext);

	drawLevel(game.canvasContext, game.level);
	drawSprites(game.canvasContext, [game.waka]);

	drawUI(game);
}

function drawLevel(ctxt, level) {
	var draw = function(obj) { obj.draw(ctxt); };
	level.tiles.forEach(draw);
}

function drawSprites(ctxt, sprites) {
	var draw = function(obj) { obj.draw(ctxt); };
	sprites.forEach(draw);
}

function drawUI(game) {
	if (game.highlightedTile)
		Pacmines.drawHighlightedTile(game.highlightedTile, game.canvasContext);

	var score = game.waka.pillsEaten * 10;
	Pacmines.drawScore(game.canvasContext, score);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tiles

const tileWidth = tileHeight = 8;

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
		return this;
	},
};

var Wall = mixin(Object.create(Tile), {
	color: '#00b',
});

var WallHorizontal = mixin(Object.create(Wall), {
	draw: Pacmines.painters.wallHorizontal,
});

var WallVertical = mixin(Object.create(Wall), {
	draw: Pacmines.painters.wallVertical,
});

var WallCornerUpLeft = mixin(Object.create(Wall), {
	draw: Pacmines.painters.wallCornerUpLeft,
});

var WallCornerUpRight = mixin(Object.create(Wall), {
	draw: Pacmines.painters.wallCornerUpRight,
});

var WallCornerDownRight = mixin(Object.create(Wall), {
	draw: Pacmines.painters.wallCornerDownRight,
});

var WallCornerDownLeft = mixin(Object.create(Wall), {
	draw: Pacmines.painters.wallCornerDownLeft,
});

var Floor = mixin(Object.create(Tile), {
	color: 'black'
});

var Door = mixin(Object.create(Tile), {
	color: 'pink',
	draw: Pacmines.painters.door,
});

var Dot = mixin(Object.create(Tile), {
	color: '#ffb897',
	size: 2,
	draw: Pacmines.painters.dot,
});

var WakaStart = mixin(Object.create(Floor), {
});

const mapLegend = {
	'/': WallCornerUpLeft,
	'\\': WallCornerUpRight,
	'l': WallCornerDownLeft,
	';': WallCornerDownRight,
	'-': WallHorizontal,
	'|': WallVertical,
	' ': Floor,
	'D': Door,
	'.': Dot,
	'@': WakaStart,
};

function createTileFromMap(mapChar) {
	if (mapLegend[mapChar])
		return Object.create(mapLegend[mapChar]);
	else
		return Object.create(Tile);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Sprites

function createWaka(game) {
	var startTile = game.level.findTileByType(WakaStart);

	return mixin(Object.create(Waka), {
		x: startTile.x * tileWidth + tileWidth/2 + 0.5,
		y: startTile.y * tileHeight + tileHeight/2 + 0.5,
	});
}

function initSprites(game) {
	game.waka = createWaka(game);
}

var Sprite = mixin(Object.create(Tile), {
	directionVector: {x:0, y:0},
	steps: 0,

	canWalkThrough: function(tile) {
		var type = tile.getType();
		return type != Wall
			&& type != WallHorizontal
			&& type != WallVertical
			&& type != WallCornerUpLeft
			&& type != WallCornerUpRight
			&& type != WallCornerDownRight
			&& type != WallCornerDownLeft
			&& type != Door;
	},
});

var Waka = mixin(Object.create(Sprite), {
	height: tileHeight * 1.3,
	width: tileWidth * 1.3,
	color: 'yellow',
	speed: 1,
	pillsEaten: 0,
	draw: Pacmines.painters.waka,
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
