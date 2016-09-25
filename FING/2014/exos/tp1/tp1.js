function square(x) { return x * x; }
function cube(x) { return x * x * x; }

// ## Fonctions d'ordre supérieur

// Encore plus utile qu'une fonction : une fonction d'ordre supérieur.
// **Complétez** la définition de la fonction `compose` qui implémente
// `f ∘ g` (on suppose que `g` attend un seul argument).
function compose(f, g) {

}

compose(square, cube)(8) === square(cube(8)); //: "TypeError: undefined is not a function"

// La fonction `add` retourne la somme de ses deux arguments.
function add(x,y) {
  return x + y;
}

add(2,3) === 5; //: "TypeError: undefined is not a function"

// La currification est un classique de la programmation
// fonctionnelle.  **Écrivez** sa version currifiée qui prend un seul
// argument, puis retourne une fonction qui attend le second argument
// et retourne la somme.
function addCurry(x) {

}

addCurry(2)(3) === 5; //: "TypeError: undefined is not a function"

// **Écrivez** la fonction curry2 qui transforme une fonction de deux
// arguments en une fonction d'un argument qui attend le second avant
// de s'exécuter.
//
// ((a,b) → c) → (a → b → c)
function curry2(f) {

}

curry2(add)(2)(3) === 5; //: "TypeError: undefined is not a function"

// La fonction inverse est `uncurry2`.  **Écrivez-la**.
//
// (a → b → c) → ((a,b) → c)
function uncurry2(f) {

}

uncurry2(curry2(add))(2,3) === 5; //: "TypeError: undefined is not a function"
uncurry2(addCurry)(2,3) === 5; //: "TypeError: undefined is not a function"

// **Écrivez** la fonction `once` qui retourne une fonction qui
// exécute `f` la première fois qu'elle est appelée, puis ne fait rien
// les appels suivants.
function once(f) {

}

var x, g;
x = 0;
g = once(function() { x += 1; });
g();
x === 1; //: "TypeError: undefined is not a function"
g();
x === 1; //: "TypeError: undefined is not a function"

// **Écrivez** la fonction `after` retourne une fonction qui éxécute
// la fonction `f` après `n` appels.
function after(f, n) {

}

x = 0;
g = after(function() { x += 1; }, 2);
g();
x === 0; //: "TypeError: undefined is not a function"
g();
x === 1; //: "TypeError: undefined is not a function"

// **Écrivez** la fonction `memoize`.  Elle retourne une fonction qui
// sauvegarde le résultat de `f` pour chaque argument passé.
function memoize(f) {

}

// La version récursive naïve de `fibo` a une complexité
// exponentielle.
var fibo = memoize(function(n) {
  return n < 2 ? 1 : fibo(n - 1) + fibo(n - 2);
});

fibo(40) === 165580141; //: "TypeError: undefined is not a function"

// ## Collections

// Il est courant de vouloir itérer sur des collections (objets ou
// tableaux).  Écrire des `for` ou des `while` devient rapidement
// fastidieux.  Les fonctions de cet exercice allègeront nos
// souffrances.

// La fonction `map` applique son argument `fn` à tous les éléments
// d'un tableau.  **Écrivez-la**.  **Essayez** de passer une chaîne de
// caractères au lieu d'un tableau.  Que se passe-t-il ?
function map(fn, col) {

}

map(function(n) { return n + n; }, [1,2,3]); // [2,4,6]; //: "TypeError: undefined is not a function"
map(function(n) { return n + n; }, '123'); // ?? //: "TypeError: undefined is not a function"

// La fonction `filter` filter les éléments d'un tableau suivant un
// prédicat (une fonction qui retourne un booléen).  **Écrivez** cette
// fonction.  **Testez-la** avec un tableau, puis une chaîne.
function filter(pred, col) {

}

filter(function(n) { return n % 2 === 0; }, [1,2,3]); // [2] //: "TypeError: undefined is not a function"

// La fonction `find` renvoie le premier élément du tableau qui
// satisfait le prédicat.  Si aucun élément ne satisfait le prédicat,
// la fonction renvoie `undefined`.  **Écrivez-la**.
function find(pred, col) {

}

find(function(n) { return n > 2 === 0; }, [1,2,3,4]); // [3,4] //: "TypeError: undefined is not a function"

// **Écrivez** la fonction `pluck` qui récupère la valeur de la
// propriété `prop` pour tous les éléments d'un tableau.
function pluck(prop, col) {

}

var books = [
  { title: 'Functional JavaScript', author: 'Michael Fogus' },
  { title: 'Effective JavaScript', author: 'David Herman' },
];

pluck('author', books); // ['Michael Fogus', 'David Herman'] //: "TypeError: undefined is not a function"
pluck('length', ['123', '4567']); // [3, 4] //: "TypeError: undefined is not a function"

// ## Bonus
//
// Les fonctions `compose`, `curry2`, `uncurry2`, `once`, `after` et
// `memoize` peuvent être généralisées pour accepter des fonctions à
// un nombre quelconque d'arguments.  Pour ce faire, il faut utiliser
// la variable spéciale `arguments` : c'est la liste des arguments
// passés à la fonction.

// Voici un exemple pour la fonction `compose` où `g` accepte un
// nombre quelconque d'arguments.
function compose_multi_args(f, g) {
  return function() {
    return f(g.apply(this, arguments));
  };
}

compose_multi_args(square, add)(2,6) === 64; //: "TypeError: undefined is not a function"

// Faites de même pour `curry2`, `uncurry2`, `once`, `after` et
// `memoize`.  Écrivez les tests, et vérifiez la cohérence des
// résultats.
