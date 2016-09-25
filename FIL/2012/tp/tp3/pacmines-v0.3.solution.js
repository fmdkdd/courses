// ## Waka waka waka waka
// Il ne reste plus que le héros !  En l'occurrence, le célèbre rond
// jaune qui mange des pilules : PacMines, ou Waka pour les intimes.

// Il nous faut une fonction qui donne la case sur laquelle Waka va
// commencer (la case avec le caractère spécial `@`).  Ici, plutôt que
// de modifier `initLevel` pour repérer cette case à la création, on
// préfère ajouter une fonction à l'objet `level` pour retrouver cette
// case après coup.
function extendLevel(level) {
	level.getTileByXY = function(x,y) {
		return this.tiles[y * this.width + x];
	};

	// La fonction `findTileByType` prend en argument un type de case
	// (`Tile`, `Wall`, `Dot`, ...) et retourne le résultat d'un appel
	// à `findTile` avec une fonction anonyme qui teste si le type
	// d'une case correspond au type demandé.  Le résultat est donc la
	// première case qui a le type demandé.
	level.findTileByType = function(type) {
		return this.findTile(function(tile) {
			return tile.getType() == type;
		});
	};

	// La fonction `findTile` prend donc en argument une fonction qui
	// va être appelée sur chaque case du niveau.  La première case du
	// niveau pour laquelle `test` retourne `true` est renvoyée.
	// **Écrivez** `findTile`.  Si elle est écrite correctement, vous
	// devez pouvoir déplacer Waka avec les flêches du clavier.
	level.findTile = function(test) {
		var result;

		this.tiles.some(function(tile) {
			if (test(tile)) {
				result = tile;
				return true;
			}
		});

		return result;
	};

}

// La fonction qui renvoie la case spéciale qui contient `@` s'écrit
// alors tout simplement.
function getWakaStartTile(level) {
	return level.findTileByType(WakaStart);
}

// ## Tiles

// Pas de surprises ici, l'objet case prototype reste le même.
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

// On définit cependant des murs plus esthétiques (verticaux,
// horizontaux, coins ...).  Jettez un œil à la carte dans
// `index.html` pour voir ce qui a changé.  On utilise des caractères
// différents pour les types de murs différents.
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

var Dot = mixin(Object.create(Tile), {
	color: '#ffb897',
	size: 2,
	draw: Pacmines.painters.dot,
});

// On ne dessine pas la case de départ de façon particulière, et on ne
// met pas de pilule dessus non plus.
var WakaStart = mixin(Object.create(Floor), {
});

// La légende de la carte s'est enrichie de quelques symboles pour les
// murs, et de la case de départ.
var mapLegend = {
	'/': WallCornerUpLeft,
	'\\': WallCornerUpRight,
	'l': WallCornerDownLeft,
	';': WallCornerDownRight,
	'-': WallHorizontal,
	'|': WallVertical,
	' ': Floor,
	'.': Dot,
	'@': WakaStart,
};

function createTileFromMap(mapChar) {
	if (mapLegend[mapChar])
		return Object.create(mapLegend[mapChar]);
	else
		return Object.create(Tile);
}

// ## Sprites

// Un sprite est un tile qui bouge !  Il a donc un vecteur de
// direction et un nombre de pas effectués.
var Sprite = mixin(Object.create(Tile), {
	directionVector: {x:0, y:0},
	steps: 0,

	// Comme il bouge, le sprite définit quelles cases sont
	// traversables.  La fonction `canWalkThrough` prend une case en
	// argument et retourne `true` seulement si un sprite peut la
	// traverser.  **Remplissez** cette fonction, si vous voulez que
	// Waka agisse selon les règles.  Astuce : les murs sont
	// infranchissables, mais il y a plusieurs types de murs différents
	// dans cette version.
	canWalkThrough: function(tile) {
		var type = tile.getType();
		return !isWall(type);
	},
});

function isWall(tileType) {
	return tileType == Wall
		|| tileType == WallHorizontal
		|| tileType == WallVertical
		|| tileType == WallCornerUpLeft
		|| tileType == WallCornerUpRight
		|| tileType == WallCornerDownRight
		|| tileType == WallCornerDownLeft;
}


// Waka est un sprite particulier, avec les propriétés nécessaires à
// son déplacement, son dessin, et au comptage de son score.
var Waka = mixin(Object.create(Sprite), {
	height: tileHeight * 1.3,
	width: tileWidth * 1.3,
	color: 'yellow',
	speed: 1,
	pillsEaten: 0,
	draw: Pacmines.painters.waka,
});

// ## Événements de déplacement

// C'est ici qu'on teste si Waka est sur une case pilule.  Si c'est le
// cas, la pilule disparaît et le nombre de pilules avalées par Waka
// augmente.
document.addEventListener('wakaMoved', function(event) {
	var waka = event.detail.waka;
	if (waka.tile.getType() == Dot) {
		waka.tile.changeType(Floor);
		waka.pillsEaten++;
	}
});

// Calcul du score à partir du nombre de pilules avalées.
function computeScore(waka) {
	return waka.pillsEaten * 10;
}

// ## Bonus

// Avant de finir, tentons de rajouter des pilules bonus.  Plus
// grosses que les pilules normales, elles confèrent à Waka des super
// pouvoirs et un bonus de score.  **Implémentez** ce nouveau type de
// case, et le comportement associé.

// Première étape: créer le nouvel objet `Bonus` à partir de la pilule
// classique.
var Bonus = mixin(Object.create(Dot), {
	size: 6,
});

// L'ajouter à la légende.
mapLegend['B'] = Bonus;

// On rajoute un prototype à Waka qui représente sa forme normale.
var NormalWaka = mixin(Object.create(Sprite), {
	height: tileHeight * 1.3,
	width: tileWidth * 1.3,
	color: 'yellow',
	speed: 1,
	draw: Pacmines.painters.waka,
});

// La forme `SuperWaka` définit les différences esthétiques que subit
// Waka après avoir ingurgité un bonus.
var SuperWaka = mixin(Object.create(NormalWaka), {
	height: tileHeight * 1.5,
	width: tileWidth * 1.5,
	color: 'red',

	// Pour que l'effet soit temporaire, on rajoute un compteur qui
	// sera decrémenté à chaque pas.
	initTimeout: function() {
		this.timeoutSteps = 200;
	},

	// Quand ce compteur atteint zéro, Waka reprend sa forme normale.
	checkTimeout: function() {
		--this.timeoutSteps;
		if (this.timeoutSteps <= 0)
			this.changeType(NormalWaka);
	},
});

// Waka hérite donc du prototype `NormalWaka`, la forme normale.  Il a
// deux propriétés qui lui sont propres: le nombre de pilules et de
// bonus avalés.
var Waka = mixin(Object.create(NormalWaka), {
	pillsEaten: 0,
	bonusEaten: 0,
});

// On ajoute un nouveau test lorsque Waka a bougé pour tester si la
// case est un bonus.
document.addEventListener('wakaMoved', function(event) {
	var waka = event.detail.waka;
	if (waka.tile.getType() == Bonus) {
		waka.tile.changeType(Floor);
		waka.bonusEaten++;
		waka.changeType(SuperWaka);
		waka.initTimeout();
	}

	// Il faut prendre garde à décrémenter le compteur.
	if (waka.getType() == SuperWaka)
		waka.checkTimeout();
});

// Enfin, on n'oublie pas d'altérer la fonction de calcul du score
// pour prendre en compte les bonus.
function computeScore(waka) {
	return waka.pillsEaten * 10 + waka.bonusEaten * 50;
}
