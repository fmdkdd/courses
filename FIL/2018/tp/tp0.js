//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Préliminaires
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Certaines lignes de ce fichier contiennent des marqueurs '//:'.  En appuyant
// sur `Ctrl+Entrée`, tous les marqueurs de la page sont réévalués, et le
// résultat de la dernière expression est écrit après le marqueur.
//
// Si une partie du code prend trop de temps à s'évaluer, le symbole ⌛ apparaît
// à la place du résultat.
//
// Chaque fonction est accompagnée de tests (non exhaustifs) que vous exécutez
// de cette façon.
//
// `Shift+Tab` permet d'indenter une ligne ou une région de code
// automatiquement.
//
// `Ctrl+/` permet de commenter/décommenter une ligne ou la sélection de code.

// Test rapide, que vaut cette expression ?  (Évaluez le marqueur)
1 * 2.12 + 3 / 4e3 % 5 + 6; //:


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Valeurs primitives
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// JavaScript n'a qu'un seul type de nombres, les nombres flottants (64 bits):

1/2; //:

// La représentation grande, mais limitée:
Number.MAX_SAFE_INTEGER; //:
Number.MAX_SAFE_INTEGER + 1; //:
Number.MAX_SAFE_INTEGER + 2; //:

// Les chaînes de caractères s'écrivent entre apostrophes simples `'` ou doubles
// `"`.  Il n'y a pas de type "caractère".
"a"; //:
'a'; //:
'a' === "a"; //:

// L'opérateur de comparaison a deux versions, une non-stricte `==` (et `!=`),
// qui convertit les opérandes:
1 == 1; //:
"abc" == "abc"; //:
12 == "12"; //:
12 == "  12 "; //:
1 == true; //:

// Les conversions de l'opérateur `==` ont parfois des propriétés surpenantes:
'0' == 0; //:
 0 == ''; //:
'0' == ''; //:

// L'opérateur de comparaison stricte `===` (et `!==`) ne fait aucune
// conversion:
1 === true; //:
12 === "12"; //:
12 === "  12 "; //:
"12" === "12" //:
'0' === 0; //:

//~~~~~~~~~~~~~~~~~
// `==` ou `===` ?
//~~~~~~~~~~~~~~~~~
//
// Préférez la version stricte `===`, qui est la moins surprenante.  Une
// exception peut cependant être faite pour la comparaison à `null` ou
// `undefined`.
//
// JavaScript a deux valeurs différentes qui indiquent l'absence de valeur.  La
// comparaison stricte permet de distinguer les deux:
null != undefined; //:
null !== undefined; //:

// Il est courant de tester si une valeur est non définie en utilisant la
// comparaison non-stricte à `null`:
var foo;
foo == null //:


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Variables
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~
// `var`
//~~~~~~~
//
// Le premier mot-clef à maîtriser est `var` pour déclarer une variable.
var x = 1;
x; //:

// Notez que toutes les variables déclarées par `var` existent dans toute leur
// portée, y compris *avant* qu'elle ne soient définies:
y; //:
var y = 2;
y; //:

// Comparez avec une variable `z` qui n'est définie nul part:
z; //!

//~~~~~~~~~~~~~
// `let` (ES6)
//~~~~~~~~~~~~~
//
// ES6 ajoute le mot-clef `let`, avec lequel accéder à une variable avant sa
// définition est une erreur:
xx; //!
let xx = 1;

// `let` interdit aussi la redéclaration d'une variable:
// let xx = 2;  // Décommentée, cette ligne est une erreur de syntaxe

//~~~~~~~~~~~~~~~~~~
// `var` ou `let` ?
//~~~~~~~~~~~~~~~~~~
//
// Préférez `let` car son comportement engendre moins de surprises, mais pour
// être compatible avec les plus anciens navigateurs, utilisez un compilateur de
// ES6 vers ES5 (comme BabelJS).

//~~~~~~~~~~~~~~~
// `const` (ES6)
//~~~~~~~~~~~~~~~
//
// ES6 ajoute le mot-clef `const`, qui a les mêmes règles que `let`, et ajoute
// la contrainte que la valeur de la variable ne peut plus être affectée:

const n = 1;
n; //:
n = 2; //!

// Notez que la valeur de la variable n'est pas *immutable* pour autant.
// L'affectation à la variable est interdite, mais la valeur peut changer si
// c'est un tableau ou un objet:
const tab = [];
tab; //:
tab.push(1); tab; //:

//~~~~~~~~~~~~~~~~~~~~
// `const` ou `let` ?
//~~~~~~~~~~~~~~~~~~~~
//
// Utilisez `const` si vous n'avez pas l'intention d'affecter une valeur
// différente à une variable.


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Func-fu
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Les fonctions se déclarent avec le mot-clef `function`:
function id(x) {
  return x;
}

id(1); //:
id("bla"); //:
id(id); //:

// Les arguments sont passés par copie (pour les types primitifs), ou par
// référence (pour les objets, tableaux, string, ...):
function grow(a) {
  if (typeof a === 'number') {
    a += 1;
    return a;
  } else if (Array.isArray(a)) {
    a.push(1);
    return a;
  }
}

const a = 1; a; //:
grow(a); //:
a; //:

const tab0 = [2,3]; tab0; //:
grow(tab0); //:
tab0; //:

// **Complétez** la fonction `square` qui renvoie le carré du nombre passé en
// argument:
function square(x) {

}

square(0) === 0; //:
square(1) === 1; //:
square(2) === 4; //:
square(12) === 144; //:

// **Écrivez** les fonctions suivantes, puis **testez**-les.
//
// * x → x³
// * n → Fibonacci(n)
function cube(x) {

}

cube(0) === 0; //:
cube(1) === 1; //:
cube(2) === 8; //:
cube(3) === 27; //:

function fibo(n) {

}

fibo(0) === 1; //:
fibo(1) === 1; //:
fibo(2) === 2; //:
fibo(3) === 3; //:
fibo(10) === 89; //:

// Bonus: **écrivez** la fonction `Fibonacci` récursivement si vous avez utilisé
// une boucle (et vice-versa).

//~~~~~~~~~~~~
// Paramètres
//~~~~~~~~~~~~
//
// Une fonction en JavaScript peut être appelée avec n'importe quel nombre
// d'arguments, quel que soit leur nombre déclaré à la définition de la
// fonction.
//
// Les paramètres omis auront pour valeur `undefined`:
function deux(a, b) {
  return [a, b];
}

deux(1, 2) //:
deux(1); //:
deux(); //:
deux()[0]; //:

// Depuis ES6, il est possible de donner des valeurs par défauts aux paramètres:
function deux2(a = 0, b = "bleh") {
  return [a,b];
}

deux2(1, 2); //:
deux2(1); //:
deux2(); //:


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// [T,a,b,l,e,a,u,x]
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Voici un tableau vide.
const array = [];

// Les tableaux en JavaScript sont dynamiques.  On peut y ajouter des éléments
// (`push` ajoute en queue, `unshift` ajoute en tête):
array.push(1); array; //:
array.push(2); array; //:
array.push(3); array; //:

// ... et en retirer.
array.pop(); array; //:
array.pop(); array; //:

// Son attribut `length` reflète toujours sa longueur.
array.length; //:
array.push(5);
array.length; //:

// L'attribut `length` est modifiable.  C'est une façon courante de vider un
// tableau:
array.length = 0;
array; //:

// L'accès à un élément se fait à l'aide des crochets `[]`:
const array2 = [1,2,3,4];
array2[0]; //:
array2[3]; //:

// Notez qu'accéder à un indice en dehors du tableau n'est pas une erreur et
// renvoie `undefined`:
array2[40]; //:
array2[-1]; //:

// Les tableaux sont hétérogènes: ils peuvent contenir tous types d'éléments:
[1,"deux", [3], [[4]]]; //:

// L'opérateur `===` (et `==`) compare les tableaux par référence:
[1,2] === [1,2] //:

// **Écrivez** la fonction `eq` qui retourne vrai si et seulement si les deux
// tableaux passés en arguments sont des tableaux identiques.  On considère que
// les tableaux contiennent uniquement des nombres (ou des valeurs comparables
// avec `===`).
function eq(a, b) {

}

eq([], []) === true; //:
eq([1], []) === false; //:
eq([1], [1]) === true; //:
eq([1,2], [1,2]) === true; //:
eq([1,2], [2,1]) === false; //:

// La fonction `range` retourne le tableau [start, ..., end-1] où `start` et
// `end` sont des entiers.  Si un seul argument `start` est passé à la fonction,
// alors elle retourne le tableau [0, ..., start-1].  **Écrivez-la**.
function range(start, end) {

}

eq(range(0), []) === true; //:
eq(range(5), [0,1,2,3,4]) === true; //:
eq(range(1,5), [1,2,3,4]) === true; //:

// La fonction `accum` prend comme argument une fonction `fun` et un entier `n`,
// et renvoie le tableau `[fun(0), fun(1), ..., fun(n-1)]`.  **Écrivez** cette
// fonction.
function accum(fun, n) {

}

eq(accum(square, 5), [0,1,4,9,16]) === true; //:
eq(accum(fibo, 10), [1,1,2,3,5,8,13,21,34,55]) === true; //:
accum(n => range(n), 4); //:

// Bonus: **écrivez** la fonction `accum` à l'aide de `range` et `map` si vous
// avez utilisé une boucle (et vice-versa).  Idem pour `eq` et `range`.

// Super bonus: **écrivez** une version de la fonction `eq` qui fonctionne pour
// des tableaux de tableaux (égalité profonde).


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// {{{O}{{b}}}{j}{{e,t}{s}}}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Un objet peut être vu comme un tableau associatif (*map* en anglais), ou une
// collection de paires`(clef, valeur)`.
const obj = {a: 1, b: 34, f: 3};

// Le point `.` permet d'accéder à la valeur d'une case en donnant son nom:
obj.a; //:
obj.b; //:

// Les crochets permettent d'accéder à la valeur de la case dont le nom est le
// *résultat* de l'expression entre crochets:
obj['a']; //:
obj['' + 'a'] //:
const un_a = 'a';
obj[un_a]; //:

// Les cases d'un objet peuvent être modifiées:
obj.a; //:
obj.a = 2; obj.a; //:
obj.a += obj.f; obj.a; //:

// Accéder à une case inexistante retourne `undefined`:
obj.tutu; //:
obj['']; //:

// Les objets sont dynamiques.  On peut ajouter des cases:
obj.c; //:
obj.c = 5;
obj.c; //:

// ... et en supprimer:
obj.a //:
delete obj.a;
obj.a //:

// Les objets, comme les tableaux, sont hétérogènes.  Ils peuvent contenir
// n'importe quel type de valeur:
const obj2 = {a: 12, str: "deux", tab: [1,2]};
obj2; //:

// La fonction `Object.keys` permet de lister les clefs d'un objet:
Object.keys(obj); //:
Object.keys(obj2); //:

// La fonction `Object.entries` retourne les paires `(clef, valeur)`:
Object.entries(obj); //:

// On peut utiliser le `for..of` pour itérer sur ces paires:
for (let [k,v] of Object.entries(obj)) {
  k //+
  v //+
}

// **Écrivez** une fonction qui retourne le nombre de cases d'un objet passé en
// **argument.
function nb_cases(obj) {

}

nb_cases({}) === 0; //:
nb_cases(obj) === 3; //:
nb_cases(obj2) === 3; //:

// **Écrivez** la fonction `copie` qui recopie toutes les propriétés de l'objet
// `b` dans l'objet `a`, et retourne `a`.  Si une propriété du même nom existe
// dans `a`, elle est écrasée.
function copie(a, b) {

}

copie({}, {a:2, b:3}); //:
copie({a: 5}, {a:2, b:3}); //:


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Une calculatrice en notation préfixe
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Une case d'un objet peut contenir une fonction.
let obj_fun = {
  double: function(a) { return a + a; }
};

obj_fun.double(2); //:

// Depuis ES6, on peut écrire plus simplement:
obj_fun = {
  double(a) { return a + a; }
};

obj_fun.double(2); //:

// Un objet qui contient plusieurs fonctions est une façon pratique
// d'implémenter un interpréteur:
const instructions = {
  add(a, n) { return a + n; },
  sub(a, n) { return a - n; },
  set(a, n) { return n; },
};

function exec(instrs) {
  let value = 0;

  for (let i of instrs.split('\n')) {
    const [name, arg] = i.split(' ');
    const n = parseInt(arg);
    value = instructions[name](value, n);
  }

  return value;
}

exec(`set 10`); //:
exec(`add 42`); //:
exec(`set 0
add 5
add 7
add 8
add 24
sub 89`); //:

// La fonction `polish` prend une chaîne qui représente une expression
// arithmétique en notation polonaise inverse (suffixe) et retourne son
// résultat.
//
// Une expression arithmétique est constituée d'opérations et de nombres:
//
//   3 5 plus 2 plus      (notation polonaise suffixe)
//   (3 + 5) + 2          (notation infixe)
//
// Une façon d'implémenter cette fonction est d'utiliser une pile (un tableau
// avec les opérations `push` et `pop`).  On parcoure l'expression de gauche à
// droite.  Lorsqu'on rencontre un nombre on le met au sommet de la pile.
// Lorsqu'on rencontre une opération, on l'éxécute.  Lorsqu'on arrive en bout de
// chaîne, on retourne la valeur au sommet de la pile.
//
//   3 5 plus 2 plus     pile: [3]
//   ^
//
//   3 5 plus 2 plus     pile: [3,5]
//     ^
//
//   3 5 plus 2 plus     pile: [8]
//       ^
//
//   3 5 plus 2 plus     pile: [8,2]
//            ^
//
//   3 5 plus 2 plus     pile: [10]
//              ^
//
//   3 5 plus 2 plus     pile: [10]  résultat = 10
//                   ^
//
// On peut implémenter les fonctions dans un objet à la façon de l'objet
// `instructions` ci-dessus.  Chaque fonction prendra en argument la pile, et
// pourra ôter des éléments de la pile et/ou en ajouter.
//
// La fonction `polish` doit supporter les opérations suivantes:
//
// * plus: x y → x + y
// * minus: x y → x - y
// * times: x y → x * y
// * div: x y → x / y
// * square: x → x²
// * cube: x → x³
// * fibo: n → Fibonacci(n)
//
// **Écrivez** la fonction `polish`.
function polish(str) {

}

polish("2") === 2; //:
polish("2 3 plus") === 5; //:
polish('2 3 minus') === -1; //:
polish("5 2 3 minus plus") === 4; //:
polish('3 6 times 2 plus') === 20; //:
polish('8 2 div square') === 16; //:
polish('3 fibo 2 plus cube') === cube(2 + fibo(3)); //:


//~~~~~~~~~~~~~~~~~~~~~~
// Pour aller plus loin
//~~~~~~~~~~~~~~~~~~~~~~
//
// Il n'y a pas d'optimisation de l'appel terminal en JavaScript, donc les
// fonctions récursives sont toujours limitées par la taille de la pile de la
// machine virtuelle.  Pouvez-vous déterminer la taille de la pile de votre
// navigateur ?
