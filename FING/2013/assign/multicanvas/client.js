// Le socket qui permettra de communiquer avec le serveur.
var socket = null;

// Dernière position visitée par le curseur, contient deux attributs x
// et y. Exemple: {x: 120, y: 23}
var lastPoint = null;

// Le canvas HTML et son contexte 2D.
var canvas = null;
var ctxt = null;

// Teinte du client local.
var myHue = null;

function init() {

	canvas = $('canvas');
	ctxt = canvas[0].getContext('2d');

	// Le canvas remplit entièrement la fenêtre.
	$(window).resize(function() {
		canvas.attr('width', window.innerWidth);
		canvas.attr('height', window.innerHeight);

		setupContext();
	}).resize();

	// Attribution des callbacks événementiels.
	canvas.bind('mousedown', startDrawing);
	canvas.bind('mouseup', stopDrawing);

	// Notre teinte choise aléatoirement.
	myHue = randomHue();

	// Initialisation du socket.
	//socket = io.connect();

	/**
	 * Un utilisateur dessine un segment.
	 *
	 * - Dessiner le segment sur le canvas local.
	 */
	// socket.on('user draws', function(data) {
	// 	console.log(data);
	// 	drawSegment(data.p1, data.p2, data.hue);
	// });
}

function startDrawing(event) {

	canvas.bind('mousemove', doDrawing);

	// Enregistre la position de la souris.
	lastPoint = {x: event.pageX, y: event.pageY};
}

function stopDrawing(event) {

	canvas.unbind('mousemove');
}

function doDrawing(event) {

	// Enregistre la position actuelle de la souris.
	var currentPoint = {x: event.pageX, y: event.pageY};

	// Dessine le segment entre la position actuelle et la précédente.
	drawSegment(lastPoint, currentPoint, myHue);

	// Envoie les coordonnées du nouveau segment aux autres clients.
	// var data = {
	// 	hue: myHue,
	// 	p1: lastPoint,
	// 	p2: currentPoint
	// };

	// socket.emit('user draws', data);

	lastPoint = currentPoint;
}

/**
 * Dessine un segment reliant la position 'p1' à la position 'p2'
 * de teinte 'hue'.
 *
 * - p1: point de départ (objet contenant les attributs x et y),
 * - p2: point d'arrivée (idem),
 * - hue: teinte du segment.
 */
function drawSegment(p1, p2, hue) {

	// Change la couleur de tracé du canvas.
	ctxt.strokeStyle = hueToHSL(hue);

	// trace un segment entre les deux positions.
	ctxt.beginPath();
	ctxt.moveTo(p1.x, p1.y);
	ctxt.lineTo(p2.x, p2.y);
	ctxt.stroke();
}

/**
 * Paramétrage du contexte 2D du canvas.
 *
 * - Épaisseur du tracé à 10,
 * - Extrémités de lignes rondes,
 *
 * (Cherchez les nom des attributs sur http://simon.html5.org/dump/html5-canvas-cheat-sheet.html)
 */
function setupContext() {

	ctxt.lineWidth = 10;
	ctxt.lineCap = 'round';
}

/**
 * Retourne une teinte choisie aléatoirement (0 <= h < 360).
 */
function randomHue() {

	return Math.floor(Math.random() * 360);
}

/**
 * Retourne la couleur CSS spécifiée par la teinte dans le modèle HSL.
 */
function hueToHSL(hue) {

	return 'hsl(' + hue + ', 60%, 50%)';
}

$(function() {

	init();
});
