document.addEventListener('DOMContentLoaded', function() {
	var game = {};

	// Initialize canvas rendering
	var canvas = document.querySelector('#canvas');
	game.canvasContext = initCanvas(canvas);

	// Initialize level map
	var map = explodeASCIIMap(document.querySelector('#map').textContent);
	game.level = initLevel(map);

	// Listen to keyboard events
	document.addEventListener('keydown', function(event) {
		processKey(game, event.keyCode);
	});

	// Initialize logic
	initGame(game);

	launchGameLoop(game);
});

function initCanvas(canvas) {
	var ctxt = canvas.getContext('2d');
	ctxt.font = tileHeight + 'px Arcade';

	ctxt.mozImageSmoothingEnabled = false;

	ctxt.scale(2, 2);

	return ctxt;
}

function launchGameLoop(game) {
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

	var frameCount = 0;

	var render = function(time) {
		// Setup next update
		requestAnimFrame(render);

		update(game);

		drawLevel(game.canvasContext, game.level, frameCount);
		drawSprites(game.canvasContext, game.sprites, frameCount);
		drawUI(game.canvasContext, game, frameCount);

		++frameCount;
	}

	requestAnimFrame(render);
}

const leftArrow = 37;
const rightArrow = 39;
const upArrow = 38;
const downArrow = 40;

function initGame(game) {
	var startTile = findTileByType('start', game.level);

	game.waka = {
		x: startTile.x + tileWidth/2,
		y: startTile.y + tileHeight/2,
		tile: startTile,
		width: 11,
		height: 11,
		direction: [0, 0],
		color: colors.waka,
		draw: painters.waka,
		pillsEaten: 0,
		steps: 0
	};

	var ghostStart = findTileByType('ghostStart', game.level);
	game.blinky = {
		x: ghostStart.x + tileWidth/2,
		y: ghostStart.y + tileHeight/2,
		tile: ghostStart,
		width: 11,
		height: 11,
		direction: [0, 0],
		color: colors.blinky,
		draw: painters.ghost,
		steps: 0
	};

	game.sprites = [game.waka, game.blinky];
}

function neighborTilesWithout(tile, without, level) {
	var neighbors = [
		findTileByXY(tile.x, tile.y + tileHeight, level),
		findTileByXY(tile.x, tile.y - tileHeight, level),
		findTileByXY(tile.x + tileHeight, tile.y, level),
		findTileByXY(tile.x - tileHeight, tile.y, level)
	];

	if (neighbors[0])
		neighbors[0].orientation = downArrow;
	if (neighbors[1])
		neighbors[1].orientation = upArrow;
	if (neighbors[2])
		neighbors[2].orientation = rightArrow;
	if (neighbors[3])
		neighbors[3].orientation = leftArrow;

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
	// Waka
	moveSprite(game.waka, game);

	// Ghosts

	// 1. Go straight until an intersection
	// 2. At intersection, choose the direction that minimizes distance
	//    with Waka.

	var sprite = game.blinky;

	if (!sprite.requestedForward)
		sprite.requestedForward = leftArrow;

	if (sprite.forward) {
		var direction = vectorFromDirection(sprite.forward);

		var tileAhead = findTileByXY(sprite.x + direction[1] * tileWidth,
											  sprite.y + direction[0] * tileHeight, game.level);
		var choices = neighborTilesWithout(tileAhead, sprite.tile, game.level);
		choices = choices.filter(isTileWalkable);

		if (choices.length > 0) {
			var chosenTile = nearestTileToSprite(choices, game.waka);
			if (chosenTile.orientation !== oppositeDirection[sprite.forward]) {
				sprite.requestedForward = chosenTile.orientation;
			}
		}
	}

	moveSprite(game.blinky, game);

	// Collision detection
	var waka = game.waka;
	var currentTile = findTileUnderSprite(waka, game.level);

	if (currentTile.type === 'dot') {
		currentTile.type = 'floor';
		currentTile.color = colors.floor;
		delete currentTile.painter;

		game.waka.pillsEaten++;
	}
}

const movementKeys = [leftArrow, rightArrow, upArrow, downArrow];
const oppositeDirection = {};
oppositeDirection[leftArrow] = rightArrow;
oppositeDirection[rightArrow] = leftArrow;
oppositeDirection[upArrow] = downArrow;
oppositeDirection[downArrow] = upArrow;

function processKey(game, keyCode) {
	if (movementKeys.indexOf(keyCode) > -1)
		game.waka.requestedForward = keyCode;
}

function vectorFromDirection(direction) {
	switch (direction) {
	case leftArrow:
		return [0, -1];

	case rightArrow:
		return [0, +1];

	case upArrow:
		return [-1, 0];

	case downArrow:
		return [+1, 0];

	default:
		return [0, 0];
	}
}

function tryToChangeDirection(sprite, game, forward) {
	// Three cases:
	// 1. Same direction input -> ignore
	// 2. Reverse direction input -> reverse direction
	// 3. Orthogonal direction input -> only on corners, in the first
	//    half of the current tile.

	var nextDirection = vectorFromDirection(forward);
	var orthogonal = sprite.direction[0] + nextDirection[0] !== 0;

	if (sprite.forward === forward) {
		return;
	} else if (orthogonal) {
		var spriteTile = findTileUnderSprite(sprite, game.level);
		var tileMidX = sprite.tile.x + tileWidth/2;
		var tileMidY = sprite.tile.y + tileHeight/2;
		var inFirstHalfOfTile = (sprite.forward === leftArrow && sprite.x >= tileMidX)
			|| (sprite.forward === rightArrow && sprite.x <= tileMidX)
			|| (sprite.forward === upArrow && sprite.y >= tileMidY)
			|| (sprite.forward === downArrow && sprite.y <= tileMidY);

		if (inFirstHalfOfTile) {
			var tileAhead = findTileByXY(sprite.x + nextDirection[1] * tileWidth,
												  sprite.y + nextDirection[0] * tileHeight, game.level);

			if (tileAhead && isTileWalkable(tileAhead)) {
				sprite.direction[0] += nextDirection[0];
				sprite.direction[1] += nextDirection[1];
				sprite.forward = forward;
			}
		}
	} else {
		sprite.direction = nextDirection;
		sprite.forward = forward;
	}
}

function moveSprite(sprite, game) {
	sprite.tile = findTileUnderSprite(sprite, game.level);

	if (sprite.requestedForward) {
		tryToChangeDirection(sprite, game, sprite.requestedForward);

		if (sprite.requestedForward === sprite.forward)
			sprite.requestedForward = null;
	}

	var direction = vectorFromDirection(sprite.forward);

	if (sprite.forward === leftArrow || sprite.forward === rightArrow) {
		if (sprite.y === sprite.tile.y + tileHeight/2){
			sprite.direction[0] = 0;
		}
	} else {
		if (sprite.x === sprite.tile.x + tileWidth/2){
			sprite.direction[1] = 0;
		}
	}

	var xLookAhead = sprite.forward === rightArrow ? tileWidth/2 : tileWidth/2 + 1;
	var yLookAhead = sprite.forward === downArrow ? tileHeight/2 : tileHeight/2 + 1;
	nextTile = findTileByXY(sprite.x + direction[1] * xLookAhead,
									sprite.y + direction[0] * yLookAhead, game.level);
	if (!nextTile || !isTileWalkable(nextTile)) {
		sprite.direction = [0, 0];
	}

	if (sprite.direction[0] || sprite.direction[1]) {
		// Walk forward now
		sprite.y += sprite.direction[0];
		sprite.x += sprite.direction[1];
		++sprite.steps;
	}
}

function isTileWalkable(tile) {
	return tile.type !== 'wall';
}

function findTile(test, level) {
	var result;

	level.tiles.some(function(tile) {
		if (test(tile)) {
			result = tile;
			return true;
		}
	});

	return result;
}

function findTileUnderSprite(sprite, level) {
	return findTileByXY(sprite.x, sprite.y, level);
}

function findTileByNeighborAndDirection(neighbor, direction, level) {
	return findTileByXY(neighbor.x + direction[1],
							  neighbor.y + direction[0],
							  level);
}

function findTileByXY(x, y, level) {
	x = tileWidth * Math.div(x, tileWidth);
	y = tileHeight * Math.div(y, tileHeight);
	return findTile(function(tile) {
		return tile.x === x && tile.y === y;
	}, level);
}

function findTileByType(type, level) {
	return findTile(function(tile) {
		return tile.type == type;
	}, level);
}

function initLevel(map) {
	var level = {};

	var tiles = level.tiles = [];
	for (var y=0, height = map.length; y < height; ++y) {
		for (var x=0, width = map[y].length; x < width; ++x) {
			var tileType = mapLegend[map[y][x]];

			var t = tile();
			t.type = tileType,
			t.x = x * tileWidth,
			t.y = y * tileHeight,
			t.color = colors[tileType] || t.color,
			t.draw = painters[tileType] || t.draw,

			tiles.push(t);
		}
	}

	// Background image
	level.backgroundImg = new Image();
	level.backgroundImg.src = 'img/bg.png';

	return level;
}

function drawLevel(ctxt, level, frameCount) {
	ctxt.fillStyle = 'black';
	ctxt.fillRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);

	ctxt.drawImage(level.backgroundImg, 0, 0);

	var draw = function(obj) { obj.draw(ctxt, frameCount); };

	level.tiles.forEach(draw);
}

function drawSprites(ctxt, sprites, frameCount) {
	var draw = function(obj) { obj.draw(ctxt, frameCount); };

	sprites.forEach(draw);
}

function drawUI(ctxt, game, frameCount) {
	var score = game.waka.pillsEaten * 10;

	ctxt.fillStyle = 'white';
	ctxt.fillText('Score: ' + score, 10, tileHeight*2);
}

const tileWidth = tileHeight = 8;

const tileOffset = 24;

function tile() {
	return {
		width: tileWidth,
		height: tileHeight,
		color: 'pink',
		draw: function(ctxt) {
		 	ctxt.fillStyle = this.color;
			ctxt.fillRect(this.x, this.y + tileOffset, this.width, this.height);
		},
	};
}

const mapLegend = {
	'#': 'wall',
	' ': 'floor',
	'.': 'dot',
	'B': 'bonus',
	'@': 'start',
	'G': 'ghostStart',
	'D': 'door',
};

const colors = {
	floor: '#000'
	, wall: '#00b'
	, dot: '#ffb897'
	, bonus: '#ffb897'
	, start: '#000'
	, ghostStart: '#000'
	, waka: 'yellow'
	, blinky: 'red'
	, door: '#ffb897'
};

const painters = {
	dot: function(ctxt) {
		var dotSize = 2;
		var startX = (this.width - dotSize) / 2;
		var startY = (this.height - dotSize) / 2;

		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x + startX, this.y + startY + tileOffset, dotSize, dotSize);
	}
	,
	bonus: function(ctxt) {
		var radius = 3;
		var offset = this.width / 2;

		ctxt.fillStyle = this.color;
		ctxt.beginPath();
		ctxt.arc(this.x + offset, this.y + offset + tileOffset, radius, 0, Math.PI*2);
		ctxt.fill();
	}
	,
	door: function(ctxt) {
		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x, this.y + tileOffset + this.height/2, this.width, this.height/2);
	}
	,
	wall: function(ctxt) {}
	,
	// floor: function(ctxt) {}
	// ,
	ghost: function(ctxt) {
		var radius = this.width/2;
		var angleVector = vectorFromDirection(this.forward);
		var angle = Math.atan2(angleVector[0], angleVector[1]);
		var breadth = Math.PI/4 * (Math.abs(Math.sin(this.steps/5))) + 1e-6;

		ctxt.fillStyle = this.color;
		ctxt.beginPath();
		ctxt.arc(this.x, this.y + tileOffset, radius, angle-breadth, angle+breadth, true);
		ctxt.lineTo(this.x, this.y + tileOffset);
		ctxt.fill();
	}
	,
	waka: function(ctxt, frameCount) {
		var radius = this.width/2;
		var angleVector = vectorFromDirection(this.forward);
		var angle = Math.atan2(angleVector[0], angleVector[1]);
		var breadth = Math.PI/4 * (Math.abs(Math.sin(this.steps/5))) + 1e-6;

		ctxt.fillStyle = this.color;
		ctxt.beginPath();
		ctxt.arc(this.x, this.y + tileOffset, radius, angle-breadth, angle+breadth, true);
		ctxt.lineTo(this.x, this.y + tileOffset);
		ctxt.fill();
	}
};

function explodeASCIIMap(string) {
	return string
		.trim()
		.split('\n')
		.map(function(string) { return string.split(''); });
}

Math.div = function(n, q) {
	return Math.floor(n / q);
};
