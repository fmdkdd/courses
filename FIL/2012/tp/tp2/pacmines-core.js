(function(global){
	// Exported object
	var Pacmines = global.Pacmines = {};

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Logic

	Pacmines.startGameLoop = function(callback) {
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
	};

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Canvas

	Pacmines.initCanvas = function(canvas) {
		var ctxt = canvas.getContext('2d');
		ctxt.scale(2, 2);
		return ctxt;
	};

	Pacmines.clearCanvas = function(ctxt) {
		ctxt.fillStyle = 'black';
		ctxt.fillRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);
	};

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Painters

	Pacmines.painters = {};

	Pacmines.painters.tile = function(ctxt) {
		var offset = {
			x: (tileWidth - this.width) / 2,
			y: (tileHeight - this.height) / 2,
		}

		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x * tileWidth + offset.x,
						  this.y * tileHeight + offset.y,
						  this.width,
						  this.height);
	};

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Utils

	Pacmines.drawHighlightedTile = function(tile, ctxt) {
		// Draw a translucent square slightly smaller than a tile.
		ctxt.fillStyle = 'hsla(40, 100%, 60%, 0.7)';
		ctxt.fillRect(tile.x * tileWidth + 1,
						  tile.y * tileHeight + 1,
						  tileWidth - 2,
						  tileHeight - 2);
	}

	Pacmines.screenToCanvasXY = function(mouseEvent) {
		function pickInCanvas(X, Y) {
			return {
				x: Math.floor(X / (2 * tileWidth)), // 2 for scaling factor
				y: Math.floor(Y / (2 * tileHeight)), // ^
			};
		}

		var canvasXY = {
			x: mouseEvent.clientX - mouseEvent.target.offsetLeft,
			y: mouseEvent.clientY - mouseEvent.target.offsetTop,
		};

		return pickInCanvas(canvasXY.x, canvasXY.y);
	}

}(this));

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
	extendLevel(game.level);

	// Listen to mouse events
	addMouseListeners(game);

	// Go!
	Pacmines.startGameLoop(function() { gameLoop(game); });
});

const tileWidth = tileHeight = 8;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Game loop

function gameLoop(game) {
	redraw(game);
}

function explodeASCIIMap(string) {
	return string
		.trim()
		.split('\n')
		.map(function(string) { return string.split(''); });
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Drawing

function redraw(game) {
	Pacmines.clearCanvas(game.canvasContext);

	drawLevel(game.canvasContext, game.level);

	drawUI(game);
}

function drawLevel(ctxt, level) {
	var draw = function(obj) { obj.draw(ctxt); };
	level.tiles.forEach(draw);
}

function drawUI(game) {
	if (game.highlightedTile)
		Pacmines.drawHighlightedTile(game.highlightedTile, game.canvasContext);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Level

function explodeASCIIMap(string) {
	return string
		.trim()
		.split('\n')
		.map(function(string) { return string.split(''); });
}

function testEqual(a, b) {
	if (a != b)
		throw "Failed testEqual: expected " + b + ", got " + a + " instead";
}
