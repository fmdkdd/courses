// ## Let there be sound
// Ce code dessine un piano uniquement en HTML et CSS.  Les touches
// sont créées dynamiquement en JavaScript, puis tout le style est
// spécifié dans `events.css`.  À quoi ça sert ?  Pour l'instant, pas
// grand chose !  On souhaite justement que le piano puisse émettre
// des sons en utilisant l'[API audio](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html)
// de Webkit.

window.addEventListener('load', function(event) {
	// Le code qui permet d'émettre des sons est déjà écrit: c'est la fonction
	// `playNote` qui s'en charge.
	function playNote(frequency) {
		var osc = audioContext.createOscillator();
		osc.type = 1; // Square wave, retro sound!
		osc.frequency.value = frequency;
		osc.connect(volume);
		osc.noteOn(0);

		// Callback pour arrêter la note.
		return function() {
			osc.disconnect();
		};
	}

	// Ici on énumère les notes qui vont être attribuées aux touches du
	// piano.
	var notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
	var octaves = [3, 4, 5];

	// Puis on crée le piano dans l'élément HTML spécifié.
	var keyboard = Keyboard(document.querySelector('#board'),
									zip(octaves, notes, function(o, n) { return n + o; }),
									keyShortcuts);

	// On voudrait que le clavier émette des événements personnalisés
	// pour signaler qu'une touche du piano est enfoncée ou relâchée.
	// Suivant l'événement, la note est jouée ou cesse de l'être.
	// Mais pour l'instant, le clavier *n'émet pas* ces événements.  Ce
	// sera justement votre rôle.
	keyboard.addEventListener('pianoKeyDown', function(event) {
		var key = event.detail;
		key.stop = playNote(key.frequency);
	});

	keyboard.addEventListener('pianoKeyUp', function(event) {
		var key = event.detail;
		key.stop();
	});

	// Le contexte audio qui nous permet de manipuler des sons et de
	// les jouer en JavaScript.
	var audioContext = new webkitAudioContext();

	// Toutes les notes passent par ce nœud qui contrôle le volume
	// du son en sortie.
	var volume = audioContext.createGainNode();
	volume.connect(audioContext.destination);

	// Ce volume est ensuite contrôlé par un slider dans la page, grâce
	// à l'événement `change`.
	var volumeControl = document.querySelector('#volume');
	function setVolume() {
		volume.gain.value = parseInt(volumeControl.value) / parseInt(volumeControl.max);
	}
	volumeControl.addEventListener('change', setVolume);
	setVolume();
});

// ## Le clavier
(function(window, undefined) {

	// Un clavier reçoit l'élément dans lequel il s'incruste, les notes
	// que doivent jouer les touches, et d'éventuels raccourcis
	// claviers qui permettront de transformer le clavier de
	// l'ordinateur en synthé.
	function createKeyboard(parent, notes, keyCodes) {
		// `{}` remplace `keyCodes` si l'argument n'est pas spécifié
		// lors de l'appel.  L'opérateur `||` utilisé de cette façon
		// permet donc de définir des arguments optionnels.
		keyCodes = keyCodes || {};

		notes.forEach(function(note) {
			parent.appendChild(createKey(note, keyCodes[note]));
		});

		return parent;
	}

	// La fonction de création d'une touche du piano prend en arguments
	// la note qu'elle doit jouer, et un tableau de `keyCode` qui
	// permettent d'identifier les touches du clavier de l'ordinateur.
	// Si une de ces touches est enfoncée, le piano est censé jouer la
	// note correspondante.
	function createKey(note, keyCodes) {
		var keyCodes = ensureArray(keyCodes);
		var keyColor = note.length === 3 ? 'blackKey' : 'whiteKey';
		var frequency = frequencyFromNote(note);

		var div = document.createElement('div');
		div.className = keyColor;

		// L'objet qui sera passé dans les événements envoyés par la
		// touche pour signaler qu'elle est enfoncée ou relâchée.
		var key = {
			note: note,
			frequency: frequency,
			color: keyColor,
		};

		registerEvents(div, key, keyCodes);

		return div;
	}

	// ## Objectifs
	// C'est ici que vous intervenez.  La fonction `registerEvents` se
	// charge de capturer les événements souris et clavier, puis
	// détermine, en fonction de ces événements, si la touche doit être
	// enfoncée ou bien relâchée.  Pour ce faire, elle utilise la
	// fonction `dispatchEvent` qui envoie un événement personnalisé
	// dans le DOM.
	function registerEvents(noteElem, key, keyCodes) {
		// Deux types d'événements sont attendus: `pianoKeyDown` et
		// `pianoKeyUp`.  Suivant l'événement voulu, il faut appeler
		// cette fonction avec la chaîne de caractères correspondante.
		function dispatchEvent(eventType) {
			noteElem.dispatchEvent(new CustomEvent(eventType, {
				detail: key,
				bubbles: true,
			}));
		}

		// Voici un exemple.  Lorsque l'événement `keydown` est
		// déclenché dans la fenêtre (une touche du clavier est
		// enfoncée, mais pas encore relevée), si la touche du clavier
		// (`event.which`) fait partie du tableau `keyCodes`, alors
		// envoyer l'événement `pianoKeyDown` pour signaler que la note
		// doit être jouée.  En vous inspirant de cet exemple,
		// **ajoutez** les autres événements.  En particulier, on veut
		// pouvoir:
		//
		// * Jouer les notes sur le clavier de l'ordinateur (événements
		// `keydown` et `keyup`).
		// * Jouer les notes en cliquant sur les touches du piano avec
		// la souris (`mousedown` et `mouseup`).  Mais aussi, si la
		// souris est déjà enfoncée, on doit pouvoir jouer d'autres
		// notes sans relâcher le bouton (`mouseover` et `mouseout`).
		// * Visualiser les notes jouées.  La feuille de style prévoit
		// une couleur spéciale pour les touches dont une des classes
		// HTML est `down` (en train d'être jouée).
		window.addEventListener('keydown', function(event) {
			if (keyCodes.indexOf(event.which) > -1)
				dispatchEvent('pianoKeyDown');
		});

		/* ... */

	}

	// Obtention de la fréquence correspondant à une note, pour pouvoir
	// la jouer !  La formule est de
	// [Wikipédia](https://en.wikipedia.org/wiki/Piano_key_frequencies).
	function frequencyFromNote(note) {
		var scale = ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'];
		var octave;

		if (note.length === 3) {
         octave = note.charAt(2);
      } else {
         octave = note.charAt(1);
      }

		var keyNumber = scale.indexOf(note.slice(0, -1));

		if (keyNumber < 3) {
         keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
      } else {
         keyNumber = keyNumber + ((octave - 1) * 12) + 1;
      }

      return 440 * Math.pow(2, (keyNumber- 49) / 12);
	}

	// Export de la fonction dans le contexte global, pour d'autres
	// scripts.
	window.Keyboard = createKeyboard;

}(window));

// Raccourcis Azerty pour les virtuoses.
var keyShortcuts = {
	'C4': 81,
	'C♯4': 90,
	'D4': 83,
	'D♯4': 69,
	'E4': 68,
	'F4': 70,
	'F♯4': 84,
	'G4': 71,
	'G♯4': 89,
	'A4': 72,
	'A♯4': 85,
	'B4': 74,

	'C5': 75,
	'C♯5': 79,
	'D5': 76,
	'D♯5': 80,
	'E5': 77,
	'F5': 222,
	'F♯5': 52,
};

// ## Utilitaires

// `[a] -> [b] -> [combine(a, b)]`
function zip(a, b, combine) {
	return flatten(a.map(function(x) {
		return b.map(function(y) {
			return combine(x, y);
		});
	}));
}

// `[[a], [b], ...] -> [a, b, ...]`
function flatten(a) {
	return a.reduce(function(a,b) {
		return a.concat(b);
	});
}

// `[a] -> [a]` et `a -> [a]`
function ensureArray(n) {
	if (!Array.isArray(n))
		return [n];
	return n;
}
