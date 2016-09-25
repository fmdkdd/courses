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
	// Movement

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

	Pacmines.moveSprite = function(sprite, game) {
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

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Canvas

	Pacmines.initCanvas = function(canvas) {
		var ctxt = canvas.getContext('2d');
		ctxt.font = '16px monospace';
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
		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x * this.width,
						  this.y * this.height,
						  this.width,
						  this.height);
	};

	Pacmines.painters.door = function(ctxt) {
		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x * this.width,
						  this.y * this.height + this.height/3,
						  this.width,
						  this.height / 3);
	};

	Pacmines.painters.dot = function(ctxt) {
		var offset = {
			x: (this.width - this.size) / 2,
			y: (this.height - this.size) / 2,
		}

		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x * this.width + offset.x,
						  this.y * this.height + offset.y,
						  this.size,
						  this.size);
	};

	Pacmines.painters.wallHorizontal = function(ctxt) {
		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x * this.width,
						  this.y * this.height + 3.5,
						  this.width,
						  1);
	};

	Pacmines.painters.wallVertical = function(ctxt) {
		ctxt.fillStyle = this.color;
		ctxt.fillRect(this.x * this.width + 3.5,
						  this.y * this.height,
						  1,
						  this.height);
	};

	var drawCorner = function(ctxt, angleStart, x, y) {
		ctxt.beginPath();
		ctxt.arc(this.x * this.width + this.width * x,
					this.y * this.height + this.height * y,
					4, angleStart, angleStart + Math.PI/2);
		ctxt.stroke();
	};

	Pacmines.painters.wallCornerUpLeft = function(ctxt) {
		ctxt.strokeStyle = this.color;
		drawCorner.call(this, ctxt, Math.PI, 1, 1);
	};

	Pacmines.painters.wallCornerUpRight = function(ctxt) {
		ctxt.strokeStyle = this.color;
		drawCorner.call(this, ctxt, Math.PI * 3/2, 0, 1);
	};

	Pacmines.painters.wallCornerDownRight = function(ctxt) {
		ctxt.strokeStyle = this.color;
		drawCorner.call(this, ctxt, 0, 0, 0);
	};

	Pacmines.painters.wallCornerDownLeft = function(ctxt) {
		ctxt.strokeStyle = this.color;
		drawCorner.call(this, ctxt, Math.PI/2, 1, 0);
	};

	Pacmines.painters.waka = function(ctxt) {
		var radius = this.width/2;
		var angleVector = vectorFromDirection(this.direction);
		var angle = Math.atan2(angleVector.y, angleVector.x);
		var breadth = Math.PI/4 * (Math.abs(Math.sin(this.steps/5))) + 1e-6;

		ctxt.fillStyle = this.color;
		ctxt.beginPath();
		ctxt.arc(this.x - 0.5, this.y - 0.5, radius, angle-breadth, angle + breadth, true);
		ctxt.lineTo(this.x - 0.5, this.y - 0.5);
		ctxt.fill();
	};

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Utils

	Pacmines.drawScore = function(ctxt, score) {
		ctxt.fillStyle = 'white';
		ctxt.fillText('Score: ' + score, 10, 280);
	}

	Pacmines.drawHighlightedTile = function(tile, ctxt) {
		ctxt.fillStyle = 'hsla(0, 80%, 80%, 0.5)';
		ctxt.fillRect(tile.x * tile.width + 1,
						  tile.y * tile.height + 1,
						  tile.width - 2,
						  tile.height - 2);
	}

	Pacmines.screenToCanvasXY = function(mouseEvent) {
		function pickInCanvas(X, Y) {
			return {
				x: Math.floor(X / 16),
				y: Math.floor(Y / 16),
			};
		}

		var canvasXY = {
			x: event.clientX - event.target.offsetLeft,
			y: event.clientY - event.target.offsetTop,
		};

		return pickInCanvas(canvasXY.x, canvasXY.y);
	}

}(this));

Math.mod = function(n, q) {
	if (isNaN(n))
		return n;
	else if (n >= 0)
		return n%q;
	else
		return Math.mod(n+q, q);
}
