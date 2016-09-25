(function(global){
	// Exported object
	var Pacmines = global.Pacmines = {};

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
	// Painter

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

	// Draw!
	drawLevel(game.canvasContext, game.level);
});

const tileWidth = tileHeight = 8;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Drawing

function drawLevel(ctxt, level) {
	Pacmines.clearCanvas(ctxt);

	var draw = function(obj) { obj.draw(ctxt); };
	level.tiles.forEach(draw);
}

function explodeASCIIMap(string) {
	return string
		.trim()
		.split('\n')
		.map(function(string) { return string.split(''); });
}
