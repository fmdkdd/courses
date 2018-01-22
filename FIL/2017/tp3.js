//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Un simple langage (partie 2)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~
// Précédemment
//~~~~~~~~~~~~~~

// Dans le TP précédent, on a écrit les fonctions pour parser le langage P.  On
// en aura encore besoin ici.

function tokenize(str) {
  return str
    .replace(/[()]/g, ' $& ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(s => s.length > 0);
}

function token_stream(str) {
  return {
    tokens: tokenize(str),
    pos: 0,
  };
}

function peek(tok) {
  if (tok.pos < tok.tokens.length) {
    return tok.tokens[tok.pos];
  } else {
    throw 'Unexpected end of input';
  }
}

function advance(tok) {
  tok.pos++;
}

function expect(tok, t) {
  if (peek(tok) === t) {
    advance(tok);
    return true;
  } else {
    throw `Parse error: expected '${t}', got '${peek(tok)}'`;
  }
}

function parse_ident(tok) {
  const t = peek(tok);

  if (t.match(/^[a-zA-Z+-_/*?!]+/)) {
    advance(tok);
    return t;
  } else {
    throw `Parse error: invalid identifier '${t}'`;
  }
}

function parse_number(tok) {
  const t = peek(tok);

  if (t.match(/^[0-9]+/)) {
    advance(tok);
    return parseInt(t);
  } else {
    throw `Parse error: invalid number '${t}'`;
  }
}

function parse_atom(tok) {
  const t = peek(tok);

  if (t.match(/^[0-9]/)) {
    return parse_number(tok);
  } else {
    return parse_ident(tok);
  }
}

function parse_node(tok) {
  const t = peek(tok);

  if (t === '(') {
    return parse_expr(tok);
  } else {
    return parse_atom(tok);
  }
}

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

function parse_prog(tok) {
  const exprs = [];

  while (tok.pos < tok.tokens.length) {
    exprs.push(parse_expr(tok));
  }

  return exprs;
}

function parse(str) {
  return parse_prog(token_stream(str));
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

//~~~~~~~~~~~~~~~~
// Interprétation
//~~~~~~~~~~~~~~~~

// On définit ces fonctions avec `let` pour pouvoir les redéfinir plus tard dans
// le fichier.

let exec_atom = function(e) {
  if (typeof e === 'number') {
    return e;
  } else {
    if (e in global_environment) {
      return global_environment[e];
    } else {
      throw `Unknown identifier: ${e}`;
    }
  }
}

let exec_call = function(e) {
  const [f, ...args] = e;
  const func = exec_expr(f);
  if (typeof func === 'function') {
    return func(...args);
  } else {
    throw `Not a function: ${func}`;
  }
}

let exec_expr = function(e) {
  if (Array.isArray(e)) {
    return exec_call(e);
  } else {
    return exec_atom(e);
  }
}

let exec_prog = function(e) {
  let r;

  for (let n of e) {
    r = exec_expr(n);
  }

  return r;
}

let exec = function(str) {
  return exec_prog(parse(str));
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Interprétation des fermetures
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Une pile d'environnements
//~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Dans le TP précédent, on a considéré que l'environnement était global.
// Toutes les fonctions utilisaient le même environnement, et l'appel d'une
// fonction utilisait l'environnement global pour passer ses paramètres.
//
// En JavaScript, chaque appel de fonction crée un environnement qui est ajouté
// à la pile d'appels.  On va implémenter le même mécanisme dans notre langage
// P.

// Plutôt qu'un environnement global, on aura une /pile/ d'environnements.  Le
// premier élément de cette pile sera l'environnement global, qui contient les
// fonctions prédéfinies.

// On représente un environnement par un objet qui contient deux propriétés :
// `record` contient les paires de variables et valeurs, et `parent` est un lien
// vers l'environnement parent utilisé pour la recherche d'identifiants.

// **Écrivez** la fonction `make_env` qui crée et retourne un nouvel
// environnement.  L'argument `obj` est un objet éventuellement vide, qui sert
// de valeurs initiales à mettre dans le champ `record` du nouvel environnement.
// L'argument `parent` est l'environnement parent éventuel.
function make_env(obj, parent) {

}

const global_environment = make_env({
  '+'(...args) { return args.map(exec_expr).reduce((sum, n) => sum + n) },
  '-'(...args) { return args.map(exec_expr).reduce((sum, n) => sum - n) },
  '*'(...args) { return args.map(exec_expr).reduce((sum, n) => sum * n) },
  '/'(...args) { return args.map(exec_expr).reduce((sum, n) => sum / n) },
});

const environment_stack = [global_environment];

// Chaque appel de fonction ajoutera ensuite son propre environnement à cette
// pile.

// Pour intéragir avec cette pile, on va définir des fonctions pour lire,
// écrire, et interroger un environnement.

// **Écrivez** la fonction `env_write` qui assigne `v` à `x` dans
// l'environnement `env`.
function env_write(env, x, v) {

}

// **Écrivez** la fonction `env_in` qui retourne vrai ssi `x` est dans `env`.
function env_in(env, x) {

}

// **Écrivez** `env_read` qui retourne la valeur de `x` dans l'environnement
// `env`.
function env_read(env, x) {

}

// **Écrivez** `env_delete` qui supprime la variable `x` dans l'environnement
// **`env`.
function env_delete(env, x) {

}

// Il sera utile de faire référence à l'environnement courant (celui du sommet
// de la pile), afin de le consulter ou le modifier.  **Écrivez** la fonction
// `current_env` qui le retourne.
function current_env() {

}

current_env() === global_environment; //:


// Il nous faut alors une fonction `lookup` qui va chercher un identifiant dans
// cette pile d'environnement.  `lookup` commence par l'environnement courant.
// Si l'identifant n'existe pas dans cet environnement, `lookup` continue sur
// l'environnement parent.  S'il n'y a plus d'environnements à chercher (le
// parent est null), `lookup` retourne `null`.
//
// **Écrivez** cette fonction.
function lookup(ident) {

}

// Il faut aussi modifier `exec_atom` pour utiliser la fonction `lookup`.
exec_atom = function(e) {
  if (typeof e === 'number') {
    return e;
  } else {
    const v = lookup(e);  // Recherche de l'identifiant dans l'environnement
    if (v == null) {
      throw `Unknown identifier: ${e}`;
    } else {
      return v;
    }
  }
}

// Après ça, on peut vérifier que l'interprétation utilise bien la pile
// d'environnements:

exec(`+`); //:
exec(`x`); //!
environment_stack.push(make_env({'x': 1}, global_environment));
exec(`x`) === 1; //:
environment_stack.pop();
exec(`x`); //!


//~~~~~~~~~~~~~~~
// `let` et `set
//~~~~~~~~~~~~~~~

// On va ajouter au langage P deux fonction prédéfinie `let` et `set`.  La
// première va ajouter une variable dans l'environnement courant (en lui donnant
// une valeur par défaut de 0).  La seconde permet de modifier la valeur d'une
// variable.  Exemples:
//
//   Instruction           Environnement courant
//   -------------------------------------------
//   (let x)               {..., x: 0}
//   (set x 1)             {..., x: 1}
//
// `let` accepte aussi un second argument optionel, qui est la valeur initiale
// de la variable.
//
//   Instruction           Environnement courant
//   -------------------------------------------
//   (let x 42)            {..., x: 42}

// **Ajoutez** `let` en tant que fonction prédéfinie à l'environnement global.
env_write(global_environment, 'let', function(name, value = 0) {

});

// Pour `set`, c'est un peu plus compliqué.  Si la variable existe dans
// l'environnement courant, on peut la modifier.  Mais que se passe-t-il si la
// valeur existe par sur l'environnement, mais l'environnement parent ?
//
//   Instruction          Environnement courant
//   ------------------------------------------
//   (set x 1)            {..., parent: {..., x: 0}}
//
// On a deux choix : soit on effectue toujours l'affectation dans
// l'environnement courant, soit on modifie la variable dans l'environnement où
// on l'a trouvée:
//
//   Choix 1: {..., x: 1, parent: {..., x: 0}}
//   Choix 2: {..., parent: {..., x: 1}}
//
// En JavaScript, c'est le second choix qui est fait.  C'est ce qui sera le plus
// utile pour les fermetures par la suite.
//
// **Ajoutez** `set` en tant que fonction prédéfinie en suivant le choix 2.  Il
// faut donc trouver l'environnement qui possède `name`, et s'il existe changer
// la valeur de `name` cet environnement.
env_write(global_environment, 'set', function(name, value) {

});

exec(`(let x)
x`) === 0; //:

exec(`(let y 2)
y`) === 2; //:

exec(`(let z)
(set z 36)
z`) === 36; //:

environment_stack.push(make_env(null, global_environment));
exec(`(set z (+ z 1))
z`) === 37; //:
environment_stack.pop();

// Que se passe-t-il si on définit deux fois la même variable avec `let` ?  Que
// se passe-t-il si on appelle `set` sur une variable qui n'existe pas dans
// l'environnement ?
//
// **Modifiez**, si nécessaire, vos définitions de `let` et `set` pour qu'elles
// lancent des erreurs avec `throw` pour les cas problématiques.

exec(`(let x1) (let x1)`); //!
exec(`(set y0)`); //!

// Tant qu'on y est, on peut aussi ajouter une fonction prédéfinie `delete` qui
// supprime la variable donnée de l'environnement courant.  Contrairement à
// JavaScript, supprimer une variable qui n'existe pas lancera une erreur dans
// notre langage.
//
// **Ajoutez** la fonction prédéfinie `delete` à l'environnement global.
env_write(global_environment, 'delete', function(name) {

});

exec(`(delete x)
(delete y)
(delete z)
(delete x1)`); //:

exec(`(delete x)`); //!

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Conditionnelles et boucles
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Afin de pouvoir écrire des programmes un peu plus intéressants, on va ajouter
// `if` et `while` à notre langage.

// **Ajoutez** la fonction prédéfinie `if`.  Elle prend trois arguments: la
// condition `cond`, l'expression `then` exécutée si la condition est vraie, et
// l'expression `alt` exécutée si la condition est fausse.
//
// On considère que `0` est faux, et que tout autre nombre est vrai.
env_write(global_environment, 'if', function(cond, then, alt) {

});

exec(`(if 1 2 3)`) === 2; //:
exec(`(if 0 2 3)`) === 3; //:
exec(`(if (+ 0 1) (- 1 0) 3)`) === 1; //:
exec(`(if (+ 0 0) 2 (+ 1 0))`) === 1; //:

// **Ajoutez** les fonctions prédéfinies `>`, `<`, `=`, `!=`, `>=`, `<=`, qui
// comparent leurs deux arguments et retournent vrai ou faux, selon l'opérateur
// correspondant en JavaScript (`=` et `!=` correspondent à l'égalité/inégalité stricte).
env_write(global_environment, '>', function(a, b) {
  return exec_expr(a) > exec_expr(b);
});

exec(`(if (= 1 1) 2 3)`) === 2; //:
exec(`(if (= 1 2) 2 3)`) === 3; //:
exec(`(if (!= 1 1) 2 3)`) === 3; //:
exec(`(if (!= 1 2) 2 3)`) === 2; //:
exec(`(if (< 1 1) 2 3)`) === 3; //:
exec(`(if (< 1 2) 2 3)`) === 2; //:
exec(`(if (<= 0 1) 2 3)`) === 2; //:
exec(`(if (<= 1 0) 2 3)`) === 3; //:
exec(`(if (> 1 1) 2 3)`) === 3; //:
exec(`(if (> 2 1) 2 3)`) === 2; //:
exec(`(if (>= 2 1) 2 3)`) === 2; //:
exec(`(if (>= 2 3) 2 3)`) === 3; //:

// Si l'on veut avoir plusieurs instructions dans un `then` ou `else`, il nous
// faut ajouter une nouvelle instruction qui exécute toutes les instructions
// qu'elle contient, et retourne la valeur de la dernière.

// **Ajoutez** la fonction prédéfinie `do` en utilisant `exec_prog`.
env_write(global_environment, 'do', function(...body) {

});

exec(`
(do
 (let x)
 (set x 1)
 x)`) === 1; //:

exec(`(if 1
        (do (set x 2) x)
        0)`) === 2; //:

exec(`(delete x)`);

// **Ajoutez** la fonction prédéfinie `while`.  Elle prend la condition `cond`
// de la boucle, et le corps `body` à exécuter tant que la condition est vraie.
env_write(global_environment, 'while', function(cond, ...body) {

});

exec(`
(let x 5)
(let y 0)
(while (> x 0)
  (set x (- x 1))
  (set y (+ y 1)))
x`) === 0; //:

exec(`y`) === 5; //:

exec(`(delete x) (delete y)`);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Fonctions utilisant la pile d'environnement
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// En JavaScript, à chaque appel d'une fonction, l'interpréteur crée un
// environnement qui associe les paramètres de la fonction aux valeurs passées.
// Cet environnement est ajouté à la pile d'environnements pour la durée de
// l'exécution de la fonction.  Lorsque la fonction a fini de s'exécuter,
// l'environnement est ôté de la pile.  L'environnement parent de
// l'environnement d'exécution de la fonction est l'environnement courant.
//
// **Complétez** la définition de `def`.
//
// On place la fonction nouvellement définie dans l'environnement courant.  Pour
// une fonction définie à l'intérieur d'une autre, ça signifie que la fonction
// interne n'aura de portée qu'à l'intérieur de la fonction.
//
// `def` retourne la fonction nouvellement définie, ce qui permet de l'affecter
// à une variable, et de l'appeler ultérieurement.
//
// N'oubliez pas d'évaluer récursivement les arguments passés à l'aide
// d'`exec_expr`.
env_write(global_environment, 'def', function(name, params, ...body) {

});

exec(`(def inc (x) (+ x 1))
(inc 1)`) === 2; //:

exec(`(inc (+ 1 1))`) === 3; //:

exec(`(delete inc)`);

// Cette fois, l'environnement n'est pas pollué après l'exécution de la
// fonction.
exec(`x`); //!

// Il ne reste que l'environnement global sur la pile:
environment_stack.length === 1; //:

// On peut placer une fonction dans une variable
exec(`(let f (def inc (x) (+ x 3)))
(f 10)`) === 13; //:

exec(`(delete f) (delete inc)`);

// On peut appeler une fonction retournée par une autre
exec(`(def f () (def g (x) (+ x x)))
((f) 10)`) === 20; //:

exec(`(delete f)`);

// Pas la peine de supprimer `g`, car elle est n'est définie que dans
// l'environnement crée par l'appel de `f`.

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Fonctions anonymes (lambda)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Pour éviter d'avoir à trouver des noms à donner aux fonctions retournées
// ainsi, on va ajouter une fonction prédéfinie `lambda`.  `lambda`, comme
// `def`, définit une fonction et la retourne, mais elle n'enregistre pas la
// fonction dans l'environnement courant.
//
// **Ajoutez** la fonction prédéfinie `lambda`.
env_write(global_environment, 'lambda', function(params, ...body) {

});

exec(`((lambda (x) (* x x)) 10)`) === 100; //:
exec(`(def f () (lambda (x) (* x x)))
((f) 10)`) === 100; //:

exec(`((f) (+ 5 5))`) === 100; //:

exec(`(delete f)`);

// **Redéfinissez** `def` à partir de `lambda`.  Ça nous évitera de la
// duplication de code pour la suite.
env_write(global_environment, 'def', function(name, params, ...body) {

});

exec(`(def f () (lambda (x) (* x x)))
((f) 10)`) === 100; //:

exec(`(delete f)`);


//~~~~~~~~~~~~~~~~~~
// Portée dynamique
//~~~~~~~~~~~~~~~~~~

// Un problème intéressant se pose lorsqu'une fonction comporte des variables
// libres.
//
//   (def f () (+ x 1))
//
// Ici, la fonction `f` fait référence à `x`, mais de quel `x` s'agit-il ?
//
// Que se passe-t-il actuellement dans notre interpréteur ?

exec(`(def f () (+ x 1))
(f)`); //!

// Si aucun des environnements de la pile ne contient de `x`, c'est une erreur.

// Si `x` existe, en revanche...

exec(`(let x 10)
(f)`) === 11; //:

exec(`(set x 0)
(f)`) === 1; //:

exec(`(delete x)`);

// Le fait que la variable libre `x` soit résolue en cherchant dans la pile
// d'environnement s'appelle la portée dynamique.  La valeur de `x` est
// dynamique : elle dépend du contexte d'exécution.  En particulier, si `f` est
// appelée dans une fonction qui définit `x` :

exec(`(f)`); //!

exec(`(def call-f (x) (f))
(call-f 10)`) === 11; //:

exec(`(delete f) (delete call-f)`);

//~~~~~~~~~~~~~~~~~
// Portée statique
//~~~~~~~~~~~~~~~~~

// Les variables libres en JavaScript ne suivent pas la portée dynamique, mais
// la portée statique (ou lexicale).  En JavaScript, une fonction capture
// l'environnement dans lequel elle est définie (/closes over its environment/,
// hence we call it /a closure/).

// Pour faire ce changement dans le langage P, il nous faut modifier simplement
// l'environnement parent dans `lambda`.  Précédemment, l'environnement parent
// était l'environnement courant.  Pour implémenter la portée statique, il faut
// que l'environnement parent soit capturé au moment de l'appel de `lambda`.

// **Modifiez** `lambda` pour qu'elle capture l'environnement courant au moment
// de la définition de la fonction anonyme.
env_write(global_environment, 'lambda', function(params, ...body) {

});

// Cette fois, `f` capture l'environnement global à sa définition.  Si `x`
// n'existe pas, c'est toujours une erreur:
exec(`(def f () (+ x 1))
(f)`); //!

// Si on rajoute `x` dans l'environnement global, `f` y a accès:
exec(`(let x 10)
(f)`) === 11; //:

// Mais cette fois, une fonction qui appelle `f` et définit `x` n'influe pas sur
// le résultat de `f`:
exec(`(def call-f (x) (f))
(call-f 100)`) === 11; //:

exec(`(delete x) (delete f) (delete call-f)`);

// Et on peut maintenant définir des fermetures:
exec(`
(def make-counter ()
  (let n 0)
  (lambda ()
    (set n (+ n 1))
      n))

(let c (make-counter))
(c)`) === 1; //:

exec(`(c)`) === 2; //:
exec(`(c)`) === 3; //:

exec(`(delete make-counter) (delete c)`);

// **Écrivez** les fonctions `addCurry` et `once` du TP 1, mais cette fois dans
// le langage P plutôt qu'en JavaScript.

exec(`((addCurry 2) 3)`) === 5; //:
exec(`(delete addCurry)`);

exec(`
(let x 0)
(let g (once (lambda () (set x (+ x 1)))))
(g)
x`) === 1; //:

exec(`(g) x`) === 1; //:

exec(`(delete x) (delete g)`);
