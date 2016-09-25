// ## Préliminaires
//
// Certaines lignes de ce fichier contiennent des marqueurs '//:'.  En
// appuyant sur `Ctrl+Entrée`, tous les marqueurs de la page sont
// réévalués, et le résultat de la dernière expression est écrit après
// le marqueur.
//
// Si une partie du code prend trop de temps à s'évaluer, le symbole ⌛
// apparaît à la place du résultat.
//
// Chaque fonction est accompagnée de tests (non exhaustifs) que vous
// exécutez de cette façon.
//
// Pour indenter une ligne ou une région de code automaiquement,
// `Shift+Tab`.
//
// Pour commenter/décommenter une ligne ou région de code: `Ctrl+/`.

// Test rapide, combien vaut cette expression ?
1 * 2.12 + 3 / 4e3 % 5 + '6'; //:

// ## Tour de chauffe

// Le premier mot clé à maîtriser est `var` pour déclarer une
// variable.
var x = 1;
x; //:

// ## Func-fu

// Les variables c'est bien utile, mais les fonctions encore plus !
function square(x) {
  return x * x;
}

square(12) === 144; //:

// **Écrivez** les fonctions suivantes, puis **testez**-les.
//
// * x → x³
// * n → Fibonacci(n)
function cube(x) {

}

cube(3) === 27; //:

function fibo(n) {

}

fibo(0) === 1; //:
fibo(1) === 1; //:
fibo(2) === 2; //:
fibo(3) === 3; //:
fibo(10) === 89; //:

// ## [T,a,b,l,e,a,u,x]

// Voici un tableau vide.
var array = [];

// On peut s'en servir comme une liste, et y ajouter des éléments (par
// la queue).
array.push(1); array; //:
array.push(2); array; //:
array.push(3); array; //:

// ... et en retiree.
array.pop(); array; //:
array.pop(); array; //:

// Son attribut `length` reflète toujours sa longueur.
array.length === 1; //:

// L'égalité entre tableaux se fait par référence en JavaScript.
// **Écrivez** la fonction `eq` qui retourne vrai si et seulement si
// les deux tableaux passés en arguments sont des tableaux identiques.
// On considère que les tableaux contiennent uniquement des nombres
// (pas des tableaux).
function eq(a, b) {

}

eq([], []) === true; //:
eq([1], []) === false; //:
eq([1], [1]) === true; //:
eq([[1,2],3], [[1,2],3]); // Non spécifié //:

// La fonction `accum` prend comme argument une fonction `fun` et un
// entier `n`, et renvoie le tableau `[fun(0), fun(1), ..., fun(n)]`.
// **Écrivez** cette fonction.
function accum(fun, n) {

}

eq(accum(fibo, 10), [1,1,2,3,5,8,13,21,34,55,89]) === true; //:

// La fonction `range` retourne le tableau [start, ..., end-1] où
// `start` et `end` sont des entiers.  Si un seul argument `start` est
// passé à la fonction, alors elle retourne le tableau [0, ...,
// start-1].  **Écrivez-la**.
function range(start, end) {

}

eq(range(0), []) === true; //:
eq(range(5), [0,1,2,3,4]) === true; //:
eq(range(1,5), [1,2,3,4]) === true; //:

// ## {{{O}{{b}}}{j}{{e,t}{s}}}

// Un objet peut être vu comme un tableau associatif, ou *map* en
// anglais; une collection de pairs `(clé, valeur)`.
var heroes = {
  'Tintin': {
    creator: 'Hergé',
    likes: 'Milou',
  },
  'Scrooge McDuck': {
    creator: 'Carl Barks',
    likes: 'Money',
  },
  'Batman': {
    creator: ['Bob Kane', 'Bill Finger'],
    likes: 'Robin',
  },
};

// Les crochets permettent d'accéder à une propriété lorsque son nom
// est contenu dans une variable (exactement comme l'indexation dans
// un tableau).
function getFact(name, fact) {
  return heroes[name][fact];
}

getFact('Batman', 'likes') === 'Robin'; //:

// **Écrivez** la fonction `setFact`.
function setFact(name, fact, newFact) {

}

setFact('Tintin', 'likes', 'Traveling'); //:
heroes.Tintin.likes === 'Traveling'; //:

// **Écrivez** la fonction `allFacts` qui retourne le tableau
// contenant la valeur du fait `fact` pour chaque `hero` dans
// `heroes`.
function allFacts(fact) {

}

eq(allFacts('likes'), ['Milou', 'Money', 'Traveling']) === true; //:

// ## Une calculatrice en notation préfixe

// Une propriété d'un objet peut être un nombre, une chaîne, un
// tableau, un objet, et même une fonction.  Voici un objet de
// fonctions arithmétiques qui prennent toutes en argument une liste
// de nombres (vue comme une pile), et retournent un nombre.
// **Complétez** cet objet avec les fonctions suivantes:
//
// * cube: x → x³
// * fibo: n → Fibonacci(n)
// * minus: x y → x - y
// * times: x y → x * y
var functions = {
  square: function(stack) { return square(stack.pop()); },
  plus: function(stack) { return stack.pop() + stack.pop(); },
};

// La fonction `polish` prend une chaîne qui représente une expression
// arithmétique en notation polonaise (préfixe) et retourne le
// résultat.  Pour ce faire, elle découpe la chaîne suivant les
// espaces pour former un tableau d'arguments, puis appelle `polish1`.
function polish(str) {
  return polish1(str.split(' '), []);
}

// La fonction `polish1` traite les arguments un à un.  Si c'est une
// fonction de l'objet `fonctions`, elle appelle cette fonction sur la
// pile.  Sinon, elle transforme l'argument en nombre (avec
// `parseInt`) et l'ajoute à la pile.
// **Écrivez** cette fonction.  *Conseil* : faites une récursion sur
// le dernier élément de la liste `args`.
function polish1(args, stack) {

}

polish('2') === 2; //:
polish('plus 2 3') === 5; //:
polish('minus 2 3') === -1; //:
polish('plus 2 times 3 6') === 20; //:
polish('cube plus 2 fibo 3') === cube(2 + fibo(3)); //:

// ## Bonus
//
// Quelques questions pour aller plus loin :
//
// * Avez-vous écrit la fonction qui calcule les nombres de Fibonacci
//   récursivement *et* itérativement ?
// * Même question pour les fonctions `eq`, `accum`, et `range`.
// * Utilisez la fonction `range` pour définir `accum`.
// * Écrivez une version de la fonction `eq` qui retourne vrai pour
//   des tableaux de tableaux (égalité profonde).
//
// À noter qu'il n'y a pas d'optimisation de l'appel terminal en
// JavaScript, donc les fonctions récursives sont limitées par la
// taille de la pile.  Pouvez-vous trouver la taille de la pile de
// votre navigateur ?
