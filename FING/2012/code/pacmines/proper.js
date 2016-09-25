//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Entry point

document.addEventListener('DOMContentLoaded', function() {
	var game = {};

	// Initialize canvas rendering
	var canvas = document.querySelector('#canvas');
	game.canvasContext = initCanvas(canvas);

	// Initialize level map
	var map = explodeASCIIMap(document.querySelector('#map').textContent);
	game.level = initLevel(map);

	// Initialize sprites
	initSprites(game);

	// Listen to mouse events
	document.addEventListener('click', function(event) {
		processMouseClick(event, game);
	});

	// Listen to keyboard events
	document.addEventListener('keydown', function(event) {
		processKey(event.keyCode, game);
	});

	// Go!
	startGameLoop(function() { gameLoop(game); });
});

function explodeASCIIMap(string) {
	return string
		.trim()
		.split('\n')
		.map(function(string) { return string.split(''); });
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Events

function processMouseClick(event, game) {
	const tileTypes = [WallHorizontal, WallVertical,
							 WallCornerUpLeft, WallCornerUpRight,
							 WallCornerDownRight, WallCornerDownLeft,
							 Floor, Dot, Bonus];

	function cycleTileType(tile) {
		var idx = tileTypes.indexOf(tile.getType());
		tile.changeType(tileTypes[(1 + idx) % tileTypes.length]);
	}

	if (event.button == 0) {	  // Left button
		var canvasXY = {
			x: event.clientX - event.target.offsetLeft,
			y: event.clientY - event.target.offsetTop,
		};
		var tileXY = pickInCanvas(canvasXY.x, canvasXY.y);
		var tile = game.level.getTileByXY(tileXY);
		if (tile)
			cycleTileType(tile);
	}
}

const left = 37;
const right = 39;
const up = 38;
const down = 40;
const movementKeys = [left, right, up, down];
const oppositeDirection = {};
oppositeDirection[left] = right;
oppositeDirection[right] = left;
oppositeDirection[up] = down;
oppositeDirection[down] = up;

function processKey(keyCode, game) {
	if (movementKeys.indexOf(keyCode) > -1)
		game.waka.requestedDirection = keyCode;
}

function pickInCanvas(X, Y) {
	return {
		x: Math.floor(X / 16),
		y: Math.floor(Y / 16),
	};
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Initialization

function initCanvas(canvas) {
	var ctxt = canvas.getContext('2d');
	ctxt.scale(2, 2);
	return ctxt;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Game loop

function gameLoop(game) {
	update(game);
	redraw(game);
}

function startGameLoop(callback) {
	// RequestAnimationFrame polyfill
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	var requestAnimFrame = (function(){
		return window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(callback, element) { return setTimeout(callback, 1000 / 60); }
	}());

	var render = function(time) {
		// Setup next update
		requestAnimFrame(render);

		callback();
	}

	requestAnimFrame(render);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Logic

function neighborTilesWithout(tile, without, level) {
	var neighbors = [
		level.getTileByXY(tile.x, tile.y + 1),
		level.getTileByXY(tile.x, tile.y - 1),
		level.getTileByXY(tile.x + 1, tile.y),
		level.getTileByXY(tile.x - 1, tile.y)
	];

	if (neighbors[0])
		neighbors[0].orientation = down;
	if (neighbors[1])
		neighbors[1].orientation = up;
	if (neighbors[2])
		neighbors[2].orientation = right;
	if (neighbors[3])
		neighbors[3].orientation = left;

	return neighbors.filter(function(n) { return n && n !== without; });
}

function nearestTileToSprite(tiles, sprite) {
	function distance(tile1, tile2) {
		var dx = tile1.x - tile2.x;
		var dy = tile1.y - tile2.y;
		return Math.sqrt(dx*dx + dy*dy);
	}

	var nearest = {
		distance: +Infinity
	};

	tiles.forEach(function(tile) {
		var d = distance(tile, sprite);
		if (d < nearest.distance) {
			nearest.tile = tile;
			nearest.distance = d;
		}
	});

	return nearest.tile;
}

function update(game) {
	moveSprite(game.waka, game);

	game.waka.update();

	// Ghost movement

	var sprite = game.blinky;

	if (!sprite.requestedDirection)
		sprite.requestedDirection = left;

	if (sprite.direction) {
		var directionVector = vectorFromDirection(sprite.direction);
		var tileAhead = game.level.getTileByXY(
			Math.floor((sprite.x + directionVector.x * tileWidth) / tileWidth),
			Math.floor((sprite.y + directionVector.y * tileHeight) / tileHeight));
		var choices = neighborTilesWithout(tileAhead, sprite.tile, game.level);
		choices = choices.filter(sprite.canWalkThrough);

		if (choices.length > 0) {
			var chosenTile = nearestTileToSprite(choices, game.waka);
			if (chosenTile.orientation !== oppositeDirection[sprite.direction]) {
				sprite.requestedDirection = chosenTile.orientation;
			}
		}
	}

	moveSprite(game.blinky, game);

	// Collision detection
	if (game.waka.tile.getType() == Dot) {
		game.waka.tile.changeType(Floor);
	} else if (game.waka.tile.getType() == Bonus) {
		game.waka.tile.changeType(Floor);
		game.waka.effectLength = SuperWaka.effectLength;
		game.waka.changeType(SuperWaka);
		game.blinky.color = 'blue';
	} else if (game.waka.tile == game.blinky.tile) {
		if (game.waka.getType() == SuperWaka)
			game.blinky = createBlinky(game);
		else
			game.waka = createWaka(game);
	}
}

function tryToChangeDirection(sprite, game, direction) {
	var directionVector = vectorFromDirection(direction);
	var orthogonalChange = sprite.directionVector.x + directionVector.x != 0;

	if (sprite.direction == direction) {
		return;
	} else if (orthogonalChange) {
		var spriteTile = game.level.getTileByXY(Math.floor(sprite.x / tileWidth),
															 Math.floor(sprite.y / tileHeight));
		var tileCenter = {x: spriteTile.x * tileWidth + tileWidth/2 + 0.5,
								y: spriteTile.y * tileHeight + tileHeight/2 + 0.5};
		var inCenterOfTile = (sprite.x < tileCenter.x + 1
									 && sprite.x > tileCenter.x -1
									 && sprite.y < tileCenter.y + 1
									 && sprite.y > tileCenter.y - 1);

		if (inCenterOfTile) {
			var tileAhead = game.level.getTileByXY(
				Math.floor((sprite.x + directionVector.x * tileWidth) / tileWidth),
				Math.floor((sprite.y + directionVector.y * tileHeight) / tileHeight),
				game.level);

			if (tileAhead && sprite.canWalkThrough(tileAhead)) {
				sprite.x = tileCenter.x;
				sprite.y = tileCenter.y;
				sprite.direction = direction;
			}
		}
	} else {
		sprite.direction = direction;
	}
}

function moveSprite(sprite, game) {
	if (sprite.requestedDirection) {
		tryToChangeDirection(sprite, game, sprite.requestedDirection);
	}

	sprite.directionVector = vectorFromDirection(sprite.direction);

	// Check if we can walk further
	var lookAhead = {
		x: sprite.direction == right ? tileWidth/2 : tileWidth/2 + 1,
		y: sprite.direction == down ? tileHeight/2 : tileHeight/2 + 1,
	};
	var nextTile = game.level.getTileByXY(
		Math.floor(Math.mod(sprite.x + sprite.directionVector.x * lookAhead.x,
								  game.level.width * tileWidth)
					  / tileWidth),
		Math.floor(Math.mod(sprite.y + sprite.directionVector.y * lookAhead.y,
								  game.level.height * tileHeight)
					  / tileHeight),
		game.level);

	if (!sprite.canWalkThrough(nextTile)) {
		sprite.directionVector = {x:0, y:0};
	}

	if (sprite.directionVector.x || sprite.directionVector.y) {
		// Walk forward now
		sprite.x += sprite.directionVector.x * sprite.speed;
		sprite.y += sprite.directionVector.y * sprite.speed;
		++sprite.steps;

		// Warp around level
		sprite.x = Math.mod(sprite.x, game.level.width * tileWidth);
		sprite.y = Math.mod(sprite.y, game.level.height * tileHeight);
	}

	sprite.tile = game.level.getTileByXY(Math.floor(sprite.x / tileWidth),
													 Math.floor(sprite.y / tileHeight));
}

function vectorFromDirection(direction) {
	switch (direction) {
	case left:
		return {x:-1, y:0};

	case right:
		return {x:+1, y:0};

	case up:
		return {x:0, y:-1};

	case down:
		return {x:0, y:+1};

	default:
		return {x:0, y:0};
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Drawing

function redraw(game) {
	clearCanvas(game.canvasContext);

	drawLevel(game.canvasContext, game.level);
	drawSprites(game.canvasContext, [game.waka, game.blinky]);
}

function clearCanvas(ctxt) {
	ctxt.fillStyle = 'black';
	ctxt.fillRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);
}

function drawLevel(ctxt, level) {
	var draw = function(obj) { obj.draw(ctxt); };
	level.tiles.forEach(draw);
}

function drawSprites(ctxt, sprites) {
	var draw = function(obj) { obj.draw(ctxt); };
	sprites.forEach(draw);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Level

function initLevel(map) {
	var level = {};
	var tiles = [];

	for (var y=0, height = map.length; y < height; ++y) {
		for (var x=0, width = map[y].length; x < width; ++x) {
			var tile = createTileFromMap(map[y][x]);
			tile.x = x;
			tile.y = y;
			tile.level = level;
			tiles.push(tile);
		}
	}

	mixin(level, {
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
	});

	return level;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tiles

function createTileFromMap(mapChar) {
	if (mapLegend[mapChar])
		return Object.create(mapLegend[mapChar]);
	else
		return Object.create(Tile);
}

const tileWidth = tileHeight = 8;

var Tile = {
	height: tileHeight,
	width: tileWidth,
	color: 'pink',
	draw: function(ctxt) {
		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x * this.width,
						  this.y * this.height,
						  this.width,
						  this.height);
	},
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
	draw: function(ctxt) {
		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x * this.width,
						  this.y * this.height + 3.5,
						  this.width,
						  1);
	}
});

var WallVertical = mixin(Object.create(Wall), {
	draw: function(ctxt) {
		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x * this.width + 3.5,
						  this.y * this.height,
						  1,
						  this.height);
	}
});

var drawCorner = function(ctxt, angleStart, x, y) {
	ctxt.beginPath();
	ctxt.arc(this.x * this.width + this.width * x,
				this.y * this.height + this.height * y,
				4, angleStart, angleStart + Math.PI/2);
	ctxt.stroke();
}

var WallCornerUpLeft = mixin(Object.create(Wall), {
	draw: function(ctxt) {
		ctxt.strokeStyle = this.color;
		drawCorner.call(this, ctxt, Math.PI, 1, 1);
	}
});

var WallCornerUpRight = mixin(Object.create(Wall), {
	draw: function(ctxt) {
		ctxt.strokeStyle = this.color;
		drawCorner.call(this, ctxt, Math.PI * 3/2, 0, 1);
	}
});

var WallCornerDownRight = mixin(Object.create(Wall), {
	draw: function(ctxt) {
		ctxt.strokeStyle = this.color;
		drawCorner.call(this, ctxt, 0, 0, 0);
	}
});

var WallCornerDownLeft = mixin(Object.create(Wall), {
	draw: function(ctxt) {
		ctxt.strokeStyle = this.color;
		drawCorner.call(this, ctxt, Math.PI/2, 1, 0);
	}
});

var Floor = mixin(Object.create(Tile), {
	color: 'black'
});

var Door = mixin(Object.create(Tile), {
	color: 'pink',
	draw: function(ctxt) {
		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x * this.width,
						  this.y * this.height + this.height/3,
						  this.width,
						  this.height / 3);
	}
});

var Dot = mixin(Object.create(Tile), {
	color: '#ffb897',
	size: 2,
	draw: function(ctxt) {
		var offset = {
			x: (this.width - this.size) / 2,
			y: (this.height - this.size) / 2,
		}

		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x * this.width + offset.x,
						  this.y * this.height + offset.y,
						  this.size,
						  this.size);
	},
});

var Bonus = mixin(Object.create(Tile), {
	color: '#ffb897',
	radius: 3,
	draw: function(ctxt) {
		var center = {
			x: this.width / 2,
			y: this.height / 2,
		};

		ctxt.fillStyle = this.color;
		ctxt.beginPath();
		ctxt.arc(this.x * this.width + center.x,
					this.y * this.height + center.y,
					this.radius, 0, 2 * Math.PI);
		ctxt.fill();
	},
});

var WakaStart = mixin(Object.create(Floor), {
});

var GhostStart = mixin(Object.create(Floor), {
});


const mapLegend = {
	'#': Wall,
	'/': WallCornerUpLeft,
	'\\': WallCornerUpRight,
	'l': WallCornerDownLeft,
	';': WallCornerDownRight,
	'-': WallHorizontal,
	'|': WallVertical,
	' ': Floor,
	'D': Door,
	'.': Dot,
	'B': Bonus,
	'@': WakaStart,
	'G': GhostStart,
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Sprites

function createWaka(game) {
	var startTile = game.level.findTileByType(WakaStart);

	return mixin(Object.create(Waka), {
		x: startTile.x * tileWidth + tileWidth/2 + 0.5,
		y: startTile.y * tileHeight + tileHeight/2 + 0.5,
	});
}

function createBlinky(game) {
	var ghostStart = game.level.findTileByType(GhostStart);

	return mixin(Object.create(Blinky), {
		x: ghostStart.x * tileWidth + tileWidth/2 + 0.5,
		y: ghostStart.y * tileHeight + tileHeight/2 + 0.5,
	});
}

function initSprites(game) {
	game.waka = createWaka(game);
	game.blinky = createBlinky(game);
}

var Sprite = mixin(Object.create(Tile), {
	directionVector: {x:0, y:0},
	steps: 0,
	update: function() {},
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
	speed: 0.7,

	draw: function(ctxt) {
		var radius = this.width/2;
		var angleVector = vectorFromDirection(this.direction);
		var angle = Math.atan2(angleVector.y, angleVector.x);
		var breadth = Math.PI/4 * (Math.abs(Math.sin(this.steps/5))) + 1e-6;

		ctxt.fillStyle = this.color;
		ctxt.beginPath();
		ctxt.arc(this.x - 0.5, this.y - 0.5, radius, angle-breadth, angle + breadth, true);
		ctxt.lineTo(this.x - 0.5, this.y - 0.5);
		ctxt.fill();
	},
});

var SuperWaka = mixin(Object.create(Waka), {
	speed: 1,
	effectLength: 500,
	height: tileHeight * 1.5,
	width: tileWidth * 1.5,
	update: function() {
		this.effectLength--;
		if (this.effectLength <= 0)
			this.changeType(Waka);
	}
});

var Blinky = mixin(Object.create(Waka), {
	color: 'red',
	speed: 0.75,

	draw: function(ctxt) {
		var radius = this.width/2;
		var step = 2.8;

		ctxt.fillStyle = this.color;
		ctxt.beginPath();
		ctxt.arc(this.x - 0.5, this.y - 0.5, radius, Math.PI, 0);

		var x = this.x + radius;
		var y = this.y + radius;
		ctxt.lineTo(x, y);
		for (var i = 1; i < 4; ++i) {
			ctxt.lineTo(x - step * i, y - step);
			ctxt.lineTo(x - step * (i+1), y);
		}
		ctxt.fill();
	},
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Utils

function mixin(obj) {
	Array.prototype.slice.call(arguments, 1)
		.forEach(function(donor) {
			for (var prop in donor)
				obj[prop] = donor[prop];
		});
	return obj;
}

function setPrototype(obj, proto) {
	obj.__proto__ = proto;
}

Math.mod = function(n, q) {
	if (isNaN(n))
		return n;
	else if (n >= 0)
		return n%q;
	else
		return Math.mod(n+q, q);
}
