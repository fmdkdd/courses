function initLevel(map) {
	var tiles = [];

	for (var y=0, height = map.length; y < height; ++y) {
		for (var x=0, width = map[y].length; x < width; ++x) {
			var mapChar = map[y][x];
			var tile = createTileFromMap(mapChar);
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tiles

var UnknownTile = {
	height: tileHeight,
	width: tileWidth,
	color: 'pink',
	draw: Pacmines.painters.tile,
}

var Wall = {
	height: tileHeight,
	width: tileWidth,
	color: '#00b',
	draw: Pacmines.painters.tile,
};

var Floor = {
	height: tileHeight,
	width: tileWidth,
	color: 'black',
	draw: Pacmines.painters.tile,
};

var Dot = {
	height: 2,
	width: 2,
	color: '#ffb897',
	draw: Pacmines.painters.tile,
};

const mapLegend = {
	'#': Wall,
	' ': Floor,
	'.': Dot,
};

function createTileFromMap(mapChar) {
	if (mapLegend[mapChar])
		return Object.create(mapLegend[mapChar]);
	else
		return Object.create(UnknownTile);
}
