// ## Préliminaires
//
// Vous pouvez effectuer tous les exercices de ce TP dans la console
// interactive de votre navigateur.
//
// Dans cette console vous pouvez taper du code JavaScript et
// l'envoyer à l'interpréteur (touche `Entrée`) qui vous affiche la
// valeur de retour de votre expression.
//
// Pour écrire une expression sur plusieurs lignes, utilisez
// `Shift+Entrée`.

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
function cube(x) {

}

function fibo(n) {

}

// Encore plus utile qu'une fonction : une fonction d'ordre supérieur.
// **Complétez** la définition de la fonction `compose` qui implémente
// `f ∘ g` (on suppose que `g` prend un seul argument).
function compose(f, g) {

}

compose(square, fibo)(8) === square(fibo(8));

// La currification est un classique de la programmation
// fonctionnelle.  **Écrivez** la fonction curry2 qui transforme une
// fonction de deux arguments en une fonction d'un argument qui attend
// le second avant de s'exécuter.
//
// (a x b -> c) -> (a -> b -> c)
function curry2(f) {

}

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
// est contenu dans une variable.
function getFact(name, fact) {
  return heroes[name][fact];
}

getFact('Batman', 'likes') === 'Robin';

// **Écrivez** la fonction `setFact`.
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
