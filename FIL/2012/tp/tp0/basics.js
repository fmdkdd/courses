// ## Préliminaires
//
// Vous pouvez effectuer tous les exercices de ce TP dans la console
// interactive de votre navigateur.  Pour la faire apparaître sous
// Chrome, le raccourci est `Ctrl+Maj+j`, ou bien Menu -> Outils ->
// Console JavaScript.
//
// Dans cette console vous pouvez taper du code JavaScript et
// l'envoyer à l'interpréteur (touche `Entrée`) qui vous affiche la
// valeur de retour de votre expression.
//
// Pour écrire une expression sur plusieurs lignes, utilisez
// `Maj+Entrée`.

// Test rapide, combien vaut cette expression ?
1 * 2.12 + 3 / 4e3 % 5 + '6';

// ## Tour de chauffe

// Le premier mot clé à maîtriser est `var` pour déclarer une
// variable.
var x = 1;

// **Déclarez** plusieurs variables dans la console, et assignez-leur
// les valeurs qui vous chantent.  Des nombres, des chaînes de
// caractères, d'autres variables ...
// Vous pouvez aussi les déclarer puis changer leur valeur dans un
// second temps.

// ## Func-fu

// Les variables c'est bien utile, mais les fonctions encore plus !
function square(x) {
	return x*x;
}

square(12);

// **Écrivez** les fonctions suivantes, puis **testez**-les.
//
// * x → x³
// * n → Fib(n)

// Encore plus utile qu'une fonction : une fonction d'ordre supérieur.
// **Complétez** la définition de la fonction `compose` qui implémente
// `f ∘ g` (on suppose que `g` prend un seul argument).
function compose(f, g) {

}

compose(square, fibo)(8) == square(fibo(8));

// ## [T,a,b,l,e,a,u,x]

// Voici un tableau vide.
var array = [];

// On peut s'en servir comme une liste, et y ajouter des éléments (par
// la queue).
array.push(1);
array.push(2);
array.push(3);

// ... et en retirer.
array.pop();
array.pop();

// Son attribut `length` reflète toujours sa longueur.
array.length == 1;

// La fonction `accum` prend comme argument une fonction `fun` et un
// entier `n`, et renvoie le tableau `[fun(0), fun(1), ..., fun(n)]`.
// **Écrivez** cette fonction.
function accum(fun, n) {

}

accum(compose(square, fibo), 10);

// ## {{{O}{{b}}}{j}{{e,t}{s}}}

// Lorsqu'un tableau ne suffit plus à modéliser vos besoin, il y a
// l'objet.  Un objet associe des identifiants à des valeurs.  Les
// valeurs peuvent être des nombres, chaînes, variables, tableaux,
// mais aussi des fonctions, et bien sûr des objets.
var truth = {
	Ce: 'premier',
	cours: {de: 'JavaScript'},
	est: ['vraiment', 'trop'],
	une: function(wait_for_it) {
		return wait_for_it;
	},
	puissance: 9000
};

flatten(truth).join(' ');

// Un objet peut être vu comme un tableau associatif, ou *map* en
// anglais; une collection de pairs `(clé, valeur)`.
var heroes = {
	'Tintin': {
		creator: 'Hergé',
		likes: 'Milou'
	},
	'Scrooge McDuck': {
		creator: 'Carl Barks',
		likes: 'Money'
	},
	'Batman': {
		creator: ['Bob Kane', 'Bill Finger'],
		likes: 'Robin'
	}
};

// Une fonction peut référencer l'objet sur lequel elle est appelée
// avec le mot-clé `this`.
function getFact(name, fact) {
	return this[name][fact];
}

heroes.getFact = getFact;
heroes.getFact('Batman', 'likes') == 'Robin';

// **Écrivez** la fonction `setFact`, ajoutez-la à l'objet
// `heroes` et testez-la.
function setFact(name, fact, newFact) {

}

// Les objets recèlent encore plus de surprises qui seront dévoilées au
// prochain cours.

// ## Bonus

// Félicitations !  Vous êtes arrivés au bout de ce premier TP.
// Quelques questions à creuser avant de partir :
//
// * Avez-vous écrit la fonction qui calcule les nombres de Fibonacci
//   récursivement *et* itérativement ?
// * Même question pour la fonction `accum`.

// Vous pouvez aussi tenter de décortiquer la fonction `flatten`.
function flatten(obj) {
	if (Array.isArray(obj)) {
		return obj;
	} else if (typeof obj == 'function') {
		return obj('tuerie');
	} else if (typeof obj == 'object') {
		var flat = [];

		for (var prop in obj) {
			flat.push(prop);
			flat = flat.concat(flatten(obj[prop]));
		}

		return flat;
	} else {
		return obj;
	}
}
