// Version récursive de l'égalité de tableaux et d'objets, pour les tests.
function eq(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    // Compare les tailles et les éléments des tableaux
    if (a.length !== b.length) {
      return false;
    }

    for (let i=0; i < a.length; ++i) {
      if (!eq(a[i], b[i])) {
        return false;
      }
    }

    return true;
  } else if (typeof a === 'object' && typeof b ==='object') {
    // Compare les objets par paire (clef, valeur)
    let a_keys = Object.keys(a);
    let b_keys = Object.keys(b);

    if (a_keys.length !== b_keys.length) {
      return false;
    }

    for (let k of a_keys) {
      if (!eq(a[k], b[k])) {
        return false;
      }
    }

    return true;
  } else {
    // Égalité stricte pour toute autre valeur
    return a === b;
  }
}

eq([1,2], [1,2]) === true; //:
eq([1,[2,3]], [1,[2,3]]) === true; //:
eq({a:1, b:[2,3]}, {b:[2,3], a:1}) === true; //:

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Un simple langage
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// On va créer un langage, et un interpréteur pour ce langage.  Ce langage va
// nous permettre d'illustrer des mécanismes de JavaScript en les implémentant.
// Notre langage utilisera des parenthèses, donc on l'appellera P.

// Voici un exemple de programme dans notre langage :
//
//   (def add (a b)
//     (+ a b))
//
//   (add 1 2)
//
// Ce programme définit une fonction `add` à deux arguments, dont le corps est
// l'addition de ses deux paramètres.  Ensuite on appelle cette fonction sur les
// deux paramètres.  Si on evalue ce programme, on obtiendra donc `3`.

// On va commencer par évaluer des expressions arithmétiques simples.  Puis on
// ajoutera la définition de fonction dans un second temps.

// Afin d'évaluer notre programme, il faut transformer une chaîne de caractères
// en arbre de syntaxe, en suivant la grammaire de notre langage.  La grammaire
// est simple :
//
//   Prog -> Expr*
//   Expr -> Atom | '(' Node* ')'
//   Node -> Atom | Expr
//   Atom -> Ident | Number
//
// L'étoile `*` indique qu'on peut avoir zéro occurrences ou plus de l'élément
// considéré, éventuellement séparées par des espaces (n'importe quel espace).
//
// `Ident` correspond aux identifiants et opérateurs (`add`, `+`, `print`, ...).
// `Number` correspond aux nombres (on pourra considérer les nombres entiers
// uniquement pour commencer).

//~~~~~~~~~~~~
// Tokenizing
//~~~~~~~~~~~~

// La première étape est de transformer une chaîne de caractères en liste de
// tokens.  C'est à dire, passer de :
//
//   "(add 1 2)"
//
// à :
//
//   ["(", "add", "1", "2", ")"]
//
// On utilisera cette liste de tokens dans l'étape suivante pour construire
// l'arbre de syntaxe.

// **Écrivez** la fonction `tokenize`.  Elle prend une chaîne de caractères et
// **retourne une liste de tokens.
//
// Une solution simple est de remarquer que si les parenthèses sont séparées par
// des espaces, il suffit d'utiliser la méthode `String.split` pour récupérer
// tous les éléments.  Pour ajouter des espaces autour des parenthèses, on peut
// utiliser `String.replace`.
function tokenize(str) {

}

eq(tokenize(`1`), ['1']); //:
eq(tokenize(`(+ 1 2)`), ['(', '+', '1', '2', ')']); //:
eq(tokenize(`(+ 1 (+ 1 2) (+ 3 4) 5)`),
   ['(', '+', '1', '(', '+', '1', '2', ')', '(',
    '+', '3', '4', ')', '5', ')']); //:
eq(tokenize(`(+ 1
(+ 1 2) (+ 3 4)
5)`),
   ['(', '+', '1', '(', '+', '1', '2', ')', '(',
    '+', '3', '4', ')', '5', ')']); //:

//~~~~~~~~~~~~~~
// Token stream
//~~~~~~~~~~~~~~

// Dans l'étape de parsing qui suit, il sera utile de conserver la position
// courante dans la liste de tokens.  Pour ce faire, on place la liste et la
// position courante dans un objet.  On appellera cet objet un 'flux' (stream)
// de tokens.

// La fonction `token_stream` prend une chaîne de caractères, et retourne un
// objet `{tokens, pos}`.  La clef `tokens` correspond à la liste de tokens
// extraits de la chaîne, et `pos` correspond à la position initiale (zéro).
// **Écrivez** cette fonction.
function token_stream(str) {

}

eq(token_stream('(+ 1 2)'),
   {tokens: ['(', '+', '1', '2', ')'], pos: 0}) === true; //:

// La fonction `peek` prend un flux de tokens et retourne le token de la
// position courante.  S'il n'y a plus de tokens, la fonction lance une erreur
// avec `throw`.  **Écrivez-la**.
function peek(tok) {

}

const tk = token_stream('(+ 1 2)');
peek(tk) === '('; //:
tk.pos++;
peek(tk) === '+'; //:

// La fonction `advance` prend un flux de tokens et incrémente sa position.
// **Écrivez-la**.
function advance(tok) {

}

tk.pos = 0;
advance(tk);
tk.pos === 1; //:

// La fonction `expect` prend un flux de tokens et une chaîne de caractères
// `t`.  Si `t` correspond au token courant, elle avance dans le flux et
// retourne vrai.  Sinon, elle lance une exception avec `throw`.
function expect(tok, t) {
  if (peek(tok) === t) {
    advance(tok);
    return true;
  } else {
    throw `Parse error: expected '${t}', got '${peek(tok)}'`;
  }
}

tk.pos = 0;
expect(tk, '(') === true; //:
tk.pos === 1; //:
expect(tk, '+') === true; //:
tk.pos === 2; //:
expect(tk, ')'); //!

//~~~~~~~~~
// Parsing
//~~~~~~~~~

// L'étape suivante est de convertir notre flux de tokens en un arbre de
// syntaxe, qui reflète la structure d'un programme P.

// Une façon simple d'écrire un parser est de suivre la grammaire.  À chaque
// règle correspond une fonction qui prend le flux de tokens en arguments, et
// retourne une sous-partie de l'arbre.  Pour rappel, voici la grammaire du
// langage P:
//
//   Prog -> Expr*
//   Expr -> Atom | '(' Node* ')'
//   Node -> Atom | Expr
//   Atom -> Ident | Number

// La fonction `parse_ident` teste si le token courant est un identifiant (à
// l'aide d'une regexp).  Si c'est le cas, elle avance le flux et retourne
// l'identifiant (une chaîne).  Sinon, elle lance une erreur.
function parse_ident(tok) {
  const t = peek(tok);

  if (t.match(/^[a-zA-Z+-/*?!]+/)) {
    advance(tok);
    return t;
  } else {
    throw `Parse error: invalid identifier '${t}'`;
  }
}

parse_ident(token_stream(`abc 1 2 3`)) === 'abc'; //:
parse_ident(token_stream(`1 2 3`)); //!

// La fonction `parse_number` est similaire à `parse_ident`.  La regexp change,
// et si le token représente un nombre, la fonction retourne ce nombre (en
// utilisant `parseInt`).  **Écrivez-la**.
function parse_number(tok) {

}

parse_number(token_stream(`12093`)) === 12093; //:
parse_number(token_stream(`abc 123`)); //!

// La fonction `parse_atom` suit la règle de la grammaire:
//   Atom -> Ident | Number
//
// Un 'Atom' est soit un identifiant, soit un nombre.  Pour savoir quelle
// fonction appeler (`parse_ident` ou `parse_number`), on peut utiliser `peek`
// pour savoir si le prochain token commence par un nombre.  Si c'est le cas, on
// appelle `parse_number`, sinon c'est `parse_ident`.
function parse_atom(tok) {
  const t = peek(tok);

  if (t.match(/^[0-9]/)) {
    return parse_number(tok);
  } else {
    return parse_ident(tok);
  }
}

parse_atom(token_stream(`12093`)) === 12093; //:
parse_atom(token_stream(`abc`)) === 'abc'; //:

// La fonction `parse_node` est similaire à `parse_atom`.  Ici encore, on peut
// déterminer quelle fonction appeler en regardant le premier caractère du
// prochain token.  **Écrivez-la**.
//
//   Node -> Atom | Expr
function parse_node(tok) {

}

eq(parse_node(token_stream(`(+ 12 a)`)), ['+', 12, 'a']) === true; //:
parse_node(token_stream(`abc`)) === 'abc'; //:

// La fonction `parse_expr` suit le même principe.  La différence ici est que,
// pour `Node*`, il faut utiliser une boucle pour accumuler les résultats des
// appels successifs à `parse_node`, tant que le prochain token n'est pas `)`.
//
//   Expr -> Atom | '(' Node* ')'
function parse_expr(tok) {
  if (peek(tok) === '(') {
    expect(tok, '(');

    const nodes = [];
    while (peek(tok) !== ')') {
      nodes.push(parse_node(tok));
    }

    expect(tok, ')');

    return nodes;
  } else {
    return parse_atom(tok);
  }
}

eq(parse_expr(token_stream(`(+ 12 a)`)), ['+', 12, 'a']) === true; //:
parse_expr(token_stream(`abc`)) === 'abc'; //:

// **Écrivez** la fonction `parse_prog`, en suivant la règle de grammaire:
//
//   Prog -> Expr*
function parse_prog(tok) {

}

eq(parse_prog(token_stream(`(+ 12 a) 1`)), [['+', 12, 'a'], 1]) === true; //:
eq(parse_prog(token_stream(`abc`)), ['abc']) === true; //:

// Enfin, **écrivez** la fonction `parse`.  Elle prend une chaîne de caractères
// correspondant à un programme P, et retourne l'arbre de syntaxe de ce
// programme.
function parse(str) {

}

parse(`(+ 1 2)`); //:
parse(`(+ 1 (+ 22 (- 33 44)) (* 4 5) 6)`); //:
parse(`(add (a b) (+ a b))`); //:
parse(`(`); //!
parse(`1`); //:
parse(`(+ 1 2)
(+ 1 (+ 1 2) (+ 3 4) 5)`);
//:
parse(`
(def add (a b)
  (+ a b))

(add 1 2)`); //:

//~~~~~~~~~~~~~~
// Interpreting
//~~~~~~~~~~~~~~

// Maintenant que l'on a un arbre qui représente notre programme, on peut
// l'interpréter pour en tirer une valeur.

// Pour le programme P suivant:
//
//   (+ 1 (+ 2 3))
//
// on obtient l'arbre (sous forme de tableau):
//
//   ['+', 1, ['+', 2, 3]]
//
// Si on le représente en forme d'arbre:
//
//  ['+'  1  .]
//           |
//     ['+'  2  3]
//
// Pour interpréter l'arbre, et donc le programme P, on doit interpréter
// récursivement chaque expression.  Il y a trois types de valeurs différentes
// dans l'arbre:
//
// 1. Des nombres (1, 22, 459123, ...)
// 2. Des identifiants ('+', 'add', 'def', '-', ...)
// 3. Des tableaux qui contiennent des nombres, des identifiants, ou des
//    tableaux (['+', 1, ['+', 2, 3]], ...)
//
// L'interprétation d'un nombre est simplement sa valeur:
//
//   exec(1) = 1
//
// Pour un identifiant, on retourne la valeur de cet identifiant dans
// l'environnement.
//
//   exec('+') = function + () {...}
//
// Une expression comme `['+' 2 3]` correspond à un appel de la fonction `+` sur
// les arguments `2` et `3`.  Pour l'intepréter, on va chercher la fonction `+`,
// et on l'applique aux arguments (le reste de l'expression).
//
//   exec(['+', 2, 3]) = exec('+')(exec(2), exec(3)) = +(2, 3) = 5
//
// Pour l'expression initiale:
//
//   exec(['+', 1, ['+', 2, 3]]) = exec('+')(exec(1), exec(['+', 2, 3]))
//                               = +(1, 5)
//                               = 6
//
// Le schéma général est:
//
//   exec([f, a, b, ...]) = exec(f)(exec(a), exec(b), ...)

// L'objet `environment` contient les fonctions prédéfinies dans notre langage.
// Ici, on a ajouté la définition de '+', qui parcoure tous les arguments, les
// interprète un à un, et les ajoute.  **Ajoutez** les définitions des fonctions
// `-`, `*`, et `/` à cet objet.
const environment = {
  '+'(...args) { return args.map(exec_expr).reduce((sum, n) => sum + n) },
}

// La fonction `exec_atom` interprète un atome (identifiant ou nombre).  Pour un
// nombre, on retourne sa valeur.  Pour un identifiant, on le cherche dans
// l'environnement et le retourne.  S'il n'existe pas dans l'environnement, on
// lance une erreur.
function exec_atom(e) {
  if (typeof e === 'number') {
    return e;
  } else {
    if (e in environment) {
      return environment[e];
    } else {
      throw `Unknown identifier: ${e}`;
    }
  }
}

// La fonction `exec_call` interprète un appel de fonction, c'est à dire un
// tableau dont le premier élément est une fonction, et les autres éléments sont
// les arguments de cette fonction.  **Écrivez** cette fonction.  Il faut
// d'abord récupérer la fonction correspondant au premier élément (avec
// `exec_expr`).  Si c'est une fonction (typeof === 'function'), on peut
// l'appeler.  Sinon, c'est une erreur.
function exec_call(e) {

}

exec_call(['+', 1, 2]) === 3; //:
exec_call(['-', 2, 1]) === 1; //:
exec_call(['*', 2, 5]) === 10; //:
exec_call(['+', ['+', 2, 5], 3]) === 10; //:

// La fonction `exec_expr` interprète soit un atome (avec `exec_atom`), soit une
// expression (avec `exec_call`).
function exec_expr(e) {
  if (Array.isArray(e)) {
    return exec_call(e);
  } else {
    return exec_atom(e);
  }
}

exec_expr(['+', 1, 2, 3]) === 6; //:
exec_expr(3) === 3; //:

// La fonction `exec_prog` interprète un arbre complet, c'est-à-dire une liste
// d'expressions, en appelant `exec_expr` sur chaque expression.  La valeur de
// retour de `exec_prog` est la valeur de retour de la dernière expression.
// **Écrivez** cette fonction.
function exec_prog(e) {

}

exec_prog([1]) === 1; //:
exec_prog([1, 2]) === 2; //:
exec_prog([['+', 1, 2, 3]]) === 6; //:
exec_prog([['+', 1, ['+', 2, 3, 4], 5]]) === 15; //:

// Enfin, la fonction `exec` prend une chaîne de caractères qui représente un
// programme P, le parse, et l'interprète.  **Écrivez-la**.
function exec(str) {

}

exec(`1`) === 1; //:
exec(`(+ 1 2 3)`) === 6; //:
exec(`(+ 1 (+ 2 3 4) 5)`) === 15; //:
exec(`(+ 1 (+ 2 3 4) 5)
(* 5 6)`) === 30; //:

//~~~~~~~~~~~~~~~~~~~~~~
// Fonctions (partie 1)
//~~~~~~~~~~~~~~~~~~~~~~

// Pour définir des fonctions dans notre langage, on ajoute une fonction
// prédéfinie `def` dans l'environnement:
//
//   (def NAME PARAMS BODY)
//
// Cette fonction prend trois paramètres: le nom de la fonction à définir, les
// noms des paramètres, et le corps de la fonction.
//
// `def` ajoute à `environment` cette nouvelle fonction (avec son nom).  Quand
// cette fonction sera appelée elle devra interpréter le corps de la fonction,
// en passant les arguments dans l'environnement.  Par exemple, après
// interprétation du programme suivant:
//
//   (def inc (x)
//     (+ x 1))
//
// L'environnement est augmenté par la fonction `inc`, qui aura le comportement
// suivant:
//
//   environment.inc = function(x) {
//     environment['x'] = x;
//     return exec_prog(['+', 'x', 1]);
//   }
//
// **Écrivez** la fonction `def`.
environment.def = function(name, params, ...body) {

}

exec(`(def inc (x)
(+ x 1))

(inc 2)`) === 3; //:

exec(`(def add (a b)
(+ a b))

(add 10 20)`) === 30; //:

// Notons que modifier l'environnement ainsi est problématique.  Après exécution
// des deux programmes précédents, l'environnement contient encore les valeurs
// de `x`, `a` et `b`:
environment.x; //:
environment.a; //:
environment.b; //:

// Dans le prochain TP on remédiera à ce problème.
