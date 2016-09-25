// ## Améliorations

// La fonction `initLevel` demandée au TP 1 parcourt l'argument `map`
// dans une double boucle.
function initLevel(map) {
	var tiles = [];

	for (var y=0, height = map.length; y < height; ++y) {
		for (var x=0, width = map[y].length; x < width; ++x) {
			// Chaque case est créée par un appel à `createTileFromMap`
			// en passant le caractère courant de la carte.
			var tile = createTileFromMap(map[y][x]);
			// Puis on donne ses coordonnées à la case.
			tile.x = x;
			tile.y = y;
			// Et on ajoute la case à celles déjà créées.
			tiles.push(tile);
		}
	}

	// Enfin on retourne l'objet niveau qui contient tous ces éléments.
	return {
		height: height,
		width: width,
		tiles: tiles,
	}
}

// La fonction `extendLevel` est appelée par le code dans
// `pacmines-core.js` pour compléter l'objet `level` après sa
// création.
function extendLevel(level) {
	// Sachant cela, **écrivez** la fonction `getTileByXY` qui renvoie
	// la case de coordonnées `(x,y)`.
	level.getTileByXY = function(x,y) {
		/* ... */
	}

	// Si la fonction `getTileByXY` est incorrecte, ces fonctions de
	// test afficheront une erreur dans la console.
	testEqual(level.getTileByXY(10, 12).x, 10);
	testEqual(level.getTileByXY(10, 12).y, 12);
}

// ## Les cases prototypées

// La fonction `createTileFromMap` prend un caractère et renvoie un
// nouvel objet case correspondant.
function createTileFromMap(mapChar) {
	const mapLegend = {
		'#': Wall,
		' ': Floor,
		'.': Dot,
	};

	// Pour ce faire, on utilise la fonction standard `Object.create`
	// vue en cours.  Cette fonction renvoie un objet vide qui a pour
	// prototype l'objet passé en argument.
	if (mapLegend[mapChar])
		return Object.create(mapLegend[mapChar]);

	// Si le caractère n'est pas dans `mapLegend`, on retourne l'objet
	// case par défaut.
	else
		return Object.create(Tile);
}

// L'objet case par défaut va servir de prototype aux autres types
// de cases plus spécifiques.  On peut donc y fourrer toutes les
// *propriétés communes* à toutes les cases.
var Tile = {
	height: tileHeight,
	width: tileWidth,
	color: 'pink',
	draw: Pacmines.painters.tile,

	// On ajoute également deux fonctions importantes qui vont
	// permettre de connaître et de changer dynamiquement le type d'une
	// case.
	getType: function() {
		return Object.getPrototypeOf(this);
	},

	changeType: function(type) {
		setPrototype(this, type);
	}
};

// Maintenant nous pouvons définir les 3 types de cases, sans *redondance
// d'information*.  **Comparez** avec votre solution initiale.

// Un mur est une case particulière, mais de couleur différente.
var Wall = mixin(Object.create(Tile), {
	color: /* ... */
});

// Le sol est une case discrète, qui a la couleur de fond du canvas.
// **Complétez** la définition en vous basant sur la précédente.
var Floor /* ... */;

// Une pilule se dessine comme une case, mais en plus petit.
var Dot = mixin(Object.create(Tile), {
	color: /* ... */,
	height: /* ... */,
	width: /* ... */,
});

// Pour déclarer ces cases, on utilise la fonction `mixin`.  Cette
// fonction prend deux objets en argument, copie toutes les propriétés
// du second dans le premier, et retourne le premier.  **Écrivez**
// cette fonction.  Si tout est correct jusqu'ici, vous devez voir
// apparaître le niveau de Pacmines à nouveau.
function mixin(obj, donor) {
	/* ... */
}

// ## Un éditeur dynamique de niveau

// En plus d'éliminer la redondance d'information, nous allons pouvoir
// changer dynamiquement le type d'une case juste en changeant son
// prototype.  Quelle utilité ?  Changer les cases du niveau de façon
// dynamique en utilisant juste la souris !

// Tentons de dompter la souris à travers un premier exemple donné par
// la fonction `processMouseMove`.  Cette fonction définira le
// traitement à effectuer lors d'un déplacement du curseur au dessus
// du canvas.  Ici nous voulons simplement mettre en évidence la case
// sous le curseur en l'assignant à la propriété `highlightedTile` de
// l'objet `game`.  Le code dans le fichier `pacmines-core.js` se
// chargera du dessin.
function processMouseMove(event, game) {
	// D'abord, nous avons besoin d'une fonction qui donne la case de
	// la grille située sous le curseur lors d'un clic.  En infographie
	// ce mécanisme s'appelle du *picking*.  La fonction
	// `Pacmines.screenToCanvasXY` prend en argument un événement de
	// type souris et retourne un objet contenant les coordonnées de la
	// case correspondante, de la forme `{x: 1, y: 12}`.
	var tileXY = Pacmines.screenToCanvasXY(event);

	// Puis on se sert de la fonction `getTileByXY` de l'objet `level`.
	// **Complétez** cet appel.
	var tile = game.level.getTileByXY(/* ... */);

	// Enfin, si la case existe, l'attribuer à la propriété adéquate
	// pour la mettre en évidence.
	if (tile)
		game.highlightedTile = tile;
}

// Nous avons vu comment obtenir l'objet qui représente la case sous
// le curseur.  Maintenant, nous voulons changer le type de cette case
// lors d'un clic de souris; c'est le rôle de la fonction
// `processMouseClick`.  Elle prend en entrée un événement souris et
// l'objet `game`.
//
// En vous inspirant du corps de la fonction `processMouseMove`,
// **complétez** cette fonction.  Vous devrez récuperer la case sous
// le curseur puis changer son type en faisant appel aux fonctions
// `getType` et `changeType` de la case.
function processMouseClick(event, game) {
	if (event.button == 0) {	  // Left button
		/* ... */
	}
}

// C'est presque fini !  Il reste à greffer les fonctions sur les
// événements souris.
function addMouseListeners(game) {
	var canvas = game.canvasContext.canvas;

	// C'est la fonction `addEventListener` d'un élément HTML qui le
	// permet.  On lui passe une chaîne décrivant l'événement (parmi
	// les [types
	// valides](https://developer.mozilla.org/en/DOM/DOM_event_reference)),
	// ainsi qu'une fonction qui sera appelée lorsque l'événement se
	// produit.  Cette fonction reçoit l'objet événement en paramètre.
	canvas.addEventListener('mousemove', function(event) {
		processMouseMove(event, game);
	});

	// Au vu de la ligne précédente, **enregistrez** l'événement
	// `'click'` qui appellera la fonction `processMouseClick` avec les
	// paramètres `event` et `game`.
	/* ... */
}

// À présent, testez le fruit de votre travail !  Vous pouvez cliquer
// sur les cases du niveau et les changer à la volée.

// ### Avant de partir ...

// Il n'y a pas de façon standard de modifier le prototype d'un objet
// pour le moment.  La version 6 du standard ECMAScript prévoit d'y
// [remédier](https://people.mozilla.com/~jorendorff/es6-draft.html#sec-B.3.1.1).
// En attendant, certains navigateurs proposent l'attribut spécial
// `__proto__`.
function setPrototype(obj, proto) {
	obj.__proto__ = proto;
}
