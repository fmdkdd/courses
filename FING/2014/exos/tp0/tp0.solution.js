// ## Préliminaires
//
// Certaines lignes de ce fichier contiennent des marqueurs '//: undefined
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
1 * 2.12 + 3 / 4e3 % 5 + '6'; //: "2.120756"

// ## Tour de chauffe

// Le premier mot clé à maîtriser est `var` pour déclarer une
// variable.
var x = 1;
x; //: 1

// ## Func-fu

// Les variables c'est bien utile, mais les fonctions encore plus !
function square(x) {
  return x * x;
}

square(12) === 144; //: true

// **Écrivez** les fonctions suivantes, puis **testez**-les.
//
// * x → x³
// * n → Fibonacci(n)
function cube(x) {
  return x * x * x;
}

cube(3) === 27; //: true

function fibo(n) {
  if (n < 2) return 1;
  return fibo(n - 1) + fibo(n - 2);
}

fibo(0) === 1; //: true
fibo(1) === 1; //: true
fibo(2) === 2; //: true
fibo(3) === 3; //: true
fibo(10) === 89; //: true

// ## [T,a,b,l,e,a,u,x]

// Voici un tableau vide.
var array = [];

// On peut s'en servir comme une liste, et y ajouter des éléments (par
// la queue).
array.push(1); array; //: [1]
array.push(2); array; //: [1,2]
array.push(3); array; //: [1,2,3]

// ... et en retirer.
array.pop(); array; //: [1,2]
array.pop(); array; //: [1]

// Son attribut `length` reflète toujours sa longueur.
array.length === 1; //: true

// L'égalité entre tableaux se fait par référence en JavaScript.
// **Écrivez** la fonction `eq` qui retourne vrai si et seulement si
// les deux tableaux passés en arguments sont des tableaux identiques.
// On considère que les tableaux contiennent uniquement des nombres
// (pas des tableaux).
function eq(a, b) {
  for (var i = 0; i < a.length; ++a)
    if (a[i] !== b[i])
      return false;
  return true;
}

eq([], []) === true; //: true
eq([1], []) === false; //: true
eq([1], [1]) === true; //: true
eq([[1,2],3], [[1,2],3]); // Non spécifié //: false

// La fonction `accum` prend comme argument une fonction `fun` et un
// entier `n`, et renvoie le tableau `[fun(0), fun(1), ..., fun(n)]`.
// **Écrivez** cette fonction.
function accum(fun, n) {
  var result = [];
  for (var i = 0; i <= n; ++i)
    result.push(fun(i));
  return result;
}

eq(accum(fibo, 10), [1,1,2,3,5,8,13,21,34,55,89]) === true; //: true

// La fonction `range` retourne le tableau [start, ..., end-1] où
// `start` et `end` sont des entiers.  Si un seul argument `start` est
// passé à la fonction, alors elle retourne le tableau [0, ...,
// start-1].  **Écrivez-la**.
function range(start, end) {
  if (end == null) {
    end = start;
    start = 0;
  }

  if (end <= start) return [];
  else return range(start, end - 1).concat(end - 1);
}

eq(range(0), []) === true; //: true
eq(range(5), [0,1,2,3,4]) === true; //: true
eq(range(1,5), [1,2,3,4]) === true; //: true

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

getFact('Batman', 'likes') === 'Robin'; //: true

// **Écrivez** la fonction `setFact`.
function setFact(name, fact, newFact) {
  heroes[name][fact] = newFact;
}

setFact('Tintin', 'likes', 'Traveling'); //: undefined
heroes.Tintin.likes === 'Traveling'; //: true

// **Écrivez** la fonction `allFacts` qui retourne le tableau
// contenant la valeur du fait `fact` pour chaque `hero` dans
// `heroes`.
function allFacts(fact) {
  var facts = [];

  for (var name in heroes)
    facts.push(getFact(name, fact));

  return facts;
}

eq(allFacts('likes'), ['Traveling', 'Money', 'Robin']) === true; //: true

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
  cube: function(stack) { return cube(stack.pop()); },
  fibo: function(stack) { return fibo(stack.pop()); },
  plus: function(stack) { return stack.pop() + stack.pop(); },
  minus: function(stack) { return stack.pop() - stack.pop(); },
  times: function(stack) { return stack.pop() * stack.pop(); },
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
  if (args.length === 0) return stack.pop();

  var a = args.pop();

  if (a in functions) {
    stack.push(functions[a](stack));
    return polish1(args, stack);
  } else {
    stack.push(parseInt(a, 10));
    return polish1(args, stack);
  }
}

polish('2') === 2; //: true
polish('plus 2 3') === 5; //: true
polish('minus 2 3') === -1; //: true
polish('plus 2 times 3 6') === 20; //: true
polish('cube plus 2 fibo 3') === cube(2 + fibo(3)); //: true

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
