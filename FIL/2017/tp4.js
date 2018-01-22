//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Un simple langage (partie 3)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~
// Précédemment
//~~~~~~~~~~~~~~

// Solutions des TP précédents, dont on se servira ici encore.

//~~~~~~~~~
// Parsing
//~~~~~~~~~

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

const ident_regexp = /^[a-zA-Z+-_/*?!]+/;
function parse_ident(tok) {
  const t = peek(tok);

  if (t.match(ident_regexp)) {
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

//~~~~~~~~~~~~~~~~
// Interprétation
//~~~~~~~~~~~~~~~~

let exec_atom = function(e) {
  if (typeof e === 'number') {
    return e;
  } else {
    const v = lookup(e);
    if (v == null) {
      throw `Unknown identifier: ${e}`;
    } else {
      return v;
    }
  }
}

function exec_call(e) {
  const [f, ...args] = e;
  const func = exec_expr(f);
  if (typeof func === 'function') {
    return func(...args);
  } else {
    throw `Not a function: ${func}`;
  }
}

function exec_expr(e) {
  if (Array.isArray(e)) {
    return exec_call(e);
  } else {
    return exec_atom(e);
  }
}

function exec_prog(e) {
  let r;

  for (let n of e) {
    r = exec_expr(n);
  }

  return r;
}

function exec(str) {
  return exec_prog(parse(str));
}

function make_env(obj, parent) {
  const rec = Object.create(null); // objet vide, sans aucune propriété héritée
  if (obj != null) {
    Object.assign(rec, obj);
  }
  return {
    record: rec,
    parent: parent,
  };
}

const global_environment = make_env({
  '+'(...args) { return args.map(exec_expr).reduce((sum, n) => sum + n) },
  '-'(...args) { return args.map(exec_expr).reduce((sum, n) => sum - n) },
  '*'(...args) { return args.map(exec_expr).reduce((sum, n) => sum * n) },
  '/'(...args) { return args.map(exec_expr).reduce((sum, n) => sum / n) },
});

const environment_stack = [global_environment];

function env_write(env, x, v) {
  env.record[x] = v;
}

function env_in(env, x) {
  return x in env.record;
}

function env_read(env, x) {
  return env.record[x];
}

function env_delete(env, x) {
  delete env.record[x];
}

function current_env() {
  return environment_stack[environment_stack.length - 1];
}

let lookup = function(ident) {
  let env = current_env();
  while (env != null) {
    if (env_in(env, ident)) {
      return env_read(env, ident);
    } else {
      env = env.parent;
    }
  }

  return null;
}

//~~~~~~~~~~~~~~~~~~~~~~~
// Fonctions prédéfinies
//~~~~~~~~~~~~~~~~~~~~~~~

// Pour éviter de trop se répéter...
function define(name, val) {
  env_write(global_environment, name, val);
}

define('let', function(name, value = 0) {
  const env = current_env();
  if (env_in(env, name)) {
    throw `Error in let: '${name}' is already defined`;
  } else {
    env_write(env, name, exec_expr(value));
  }
});

define('set', function(name, value) {
  let env = current_env();
  while (env != null) {
    if (env_in(env, name)) {
      env_write(env, name, exec_expr(value));
      return;
    } else {
      env = env.parent;
    }
  }
  throw `Cannot set: '${name}' does not exist`;
});

define('delete', function(name) {
  const env = current_env();
  if (env_in(env, name)) {
    env_delete(env, name);
  } else {
    throw `Cannot delete '${x}': unknown identifier`;
  }
});

define('if', function(cond, then, alt) {
  return exec_expr(cond) ? exec_expr(then) : exec_expr(alt);
});

define('>', function(a, b) {
  return exec_expr(a) > exec_expr(b);
});

define('<', function(a, b) {
  return exec_expr(a) < exec_expr(b);
});

define('>=', function(a, b) {
  return exec_expr(a) >= exec_expr(b);
});

define('<=', function(a, b) {
  return exec_expr(a) <= exec_expr(b);
});

define('=', function(a, b) {
  return exec_expr(a) === exec_expr(b);
});

define('!=', function(a, b) {
  return exec_expr(a) !== exec_expr(b);
});

define('do', function(...body) {
  return exec_prog(body);
});

define('while', function(cond, ...body) {
  while (exec_expr(cond)) {
    exec_prog(body);
  }
});

define('lambda', function(params, ...body) {
  const captured_env = current_env();

  return function(...args) {
    const env = make_env(null, captured_env);
    for (let i=0; i < params.length; ++i) {
      env_write(env, params[i], exec_expr(args[i]));
    }

    environment_stack.push(env);
    try {
      return exec_prog(body);
    } finally {
      environment_stack.pop();
    }
  };
});

define('def', function(name, params, ...body) {
  const f = env_read(global_environment, 'lambda')(params, ...body);
  env_write(current_env(), name, f);
  return f;
});


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Interprétation des objets
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// L'objectif de ce TP est d'implémenter les objets dans notre langage, avec
// lien de prototype et notre équivalent du mot-clé `this`.

//~~~~~~~~
// Objets
//~~~~~~~~

// Les objets en JavaScript sont des tableaux associatifs.  Ils ont un objet
// parent optionnel appelé 'prototype'.  Ça ne vous rappelle rien ?  C'est
// similaire aux environnements que l'on peut créer avec `make_env` qui ont un
// `record` et un `parent`.
//
// On va utiliser ces environnements pour implémenter les objets du langage P.

// **Ajoutez** la fonction prédéfinie `obj` qui construit et retourne un objet.
// Elle prend en argument des paires `(key val)`, où `key` est un identifiant
// (du langage P) qui doit être associé à la valeur `val`.
//
// Utilisez `make_env` pour représenter l'objet, et ajoutez les paires dans le
// champ `record` grâce à `env_write`.
//
// `key` n'est *pas* évalué (comme dans `let` ou `set`) via `exec_expr`, mais
// `val` doit l'être (car ce peut être une expression arbitraire).
//
// Assurez-vous que la chaîne `key` est un identifiant valide en utilisant
// `ident_regexp` utilisée pour les identifiants (cf. plus haut).
//
// (define ajoute une fonction prédéfinie à l'environnement global, voir sa
// définition au dessus)
define('obj', function(...pairs) {

});

exec(`(obj (a 1) (b (+ 1 2)))`); //:
exec(`(obj (1 1))`); //!

//~~~~~~~~~~~
// Prototype
//~~~~~~~~~~~

// **Ajoutez** la fonction prédéfinie `set-proto` qui affecte à l'objet `obj` le
// prototype `proto`.  Dans notre implémentation, le lien de prototype est
// réalisé par la propriété `parent` de `obj` (quy est un environnement).
define('set-proto', function(obj, proto) {

});

// **Ajoutez** la fonction `get-proto` qui retourne le prototype de `obj`.
define('get-proto', function(obj) {

});

exec(`(get-proto (obj))`); //:
exec(`(let o (obj))
(let p (obj (a 1)))
(set-proto o p)
(get-proto o)`); //:

//~~~~~~~~~~~~~~~~~~
// `get.` et `set.`
//~~~~~~~~~~~~~~~~~~

// Il nous faut maintenant ajouter les fonctions `get.` et `set.` qui vont nous
// permettre de naviguer et modifier les valeurs enregistrées dans un objet du
// langage P.
//
// **Écrivez** la fonction `obj_lookup` qui retourne le premier objet dans
// lequel la clé `key` est définie.  La fonction commence par cherche `key` dans
// `obj` (avec `env_in`).  Si `key` n'est pas définie, la fonction continue sa
// recherche sur l'objet `parent` (de façon analogue à `lookup`).  Si `key`
// n'est définie sur aucun des objets visités, la fonction retourne `null`.
function obj_lookup(obj, key) {

}

// **Ajoutez** la fonction prédéfinie `get.` qui utilise `obj_lookup` pour
// retourner la valeur de la clé `key` sur l'objet `obj` (ou un de ses parents).
define('get.', function(key, obj) {

});

exec(`(get. a p)`) === 1; //:
exec(`(get. a o)`) === 1; //:
exec(`(get. b p)`); //!

// **Ajoutez** la fonction prédéfinie `set.` qui affecte (ou modifie) la valeur
// `val` à la clé `key` de l'objet `obj`.
//
// En JavaScript, l'affectation modifie toujours l'objet considéré, et non pas
// un objet parent, même si la clé n'existe que sur un objet parent.  C'est le
// choix 1 vu en TP3.
define('set.', function(key, val, obj) {

});

exec(`(set. a 2 o) (get. a o)`) === 2; //:
exec(`(get. a p)`) === 1; //:

exec(`(delete o) (delete p)`);

//~~~~~~~~~~~~~~~~
// Self-reference
//~~~~~~~~~~~~~~~~

// Avec `get.` et `set.`, on peut définir et utiliser un objet qui contient une
// méthode, et modifie cet objet.

exec(`(let c (obj
               (counter 0)
               (inc (lambda () (set. counter (+ 1 (get. counter c)) c)))))
(get. counter c)`) === 0; //:
exec(`((get. inc c))
(get. counter c)`) === 1; //:

exec(`(delete c)`);

// Mais c'est limité, car il faut connaître le nom de l'objet (`c`) pour pouvoir
// y faire référence dans la méthode `inc`.  Les langages à objets ont tous un
// mot-clé qui permet de faire référence, dans une méthode, à l'objet appelé.
// En JavaScript (aussi en Java et C++), ce mot-clé est `this`.  Nous allons
// honorer cette tradition en utilisant `this` pour se référer à l'objet appelé
// dans notre langage P.

// Pour implémenter ce mot-clé, on va ajouter une propriété `thisValue` à
// l'environnement qui déclenche l'appel.  On modifiera ensuite `exec_atom` pour
// traiter ce mot-clé `this` d'une façon particulière à l'aide de `lookup_this`.

// **Ajoutez** la fonction `call.` qui appelle la méthode `key` dans l'objet
// `obj` avec les arguments `args`.  Avant d'appeler la méthode, `call.` modifie
// l'environnement courant pour ajouter la propriété spéciale `thisValue` qui
// pointe vers l'objet `obj`.  `thisValue` n'est *pas* une valeur du `record` de
// l'environnement courant, mais une propriété du même niveau que `record` et
// `parent`.  (N'utilisez pas exec_write pour l'écrire).
//
// N'oubliez pas de retirer la valeur `thisValue` *après* l'exécution de la
// fonction.
define('call.', function(key, obj, ...args) {

});

// **Complétez** `lookup_this` qui est analogue à `lookup`, mais ne fait que
// regarder la propriété `thisValue` de la chaîne d'environnements.
function lookup_this() {

}

// Il nous faut enfin modifier `exec_atom` pour qu'elle appelle `lookup_this` si
// l'identifant considéré est la chaîne `this`.  Ça nous permet de traiter
// `this` comme un mot-clé spécial, qui a priorité sur un identifiant `this` qui
// serait défini dans le `record` d'un environnement.
exec_atom = function(e) {

}

exec(`
(let mk-counter
  (lambda ()
    (obj
      (counter 0)
      (inc (lambda ()  (set. counter (+ 1 (get. counter this)) this)))
      (set (lambda (x) (set. counter x this))))))
(let c1 (mk-counter))
(get. counter c1)`) === 0; //:
exec(`(call. inc c1)
(get. counter c1)`) === 1; //:
exec(`(call. inc c1)
(get. counter c1)`) === 2; //:
exec(`(call. set c1 (+ 49 1))
(get. counter c1)`) === 50; //:

exec(`((get. inc c1))`); //!

exec(`(let c2 (mk-counter))
(get. counter c2)`) === 0; //:
exec(`(call. inc c2)
(get. counter c2)`) === 1; //:

exec(`(delete mk-counter) (delete c1) (delete c2)`);


//~~~~~~~~~~~~~~~~~
// Bonus: Tableaux
//~~~~~~~~~~~~~~~~~

// On peut assez simplement ajouter des tableaux à notre langage.  On les
// appellera 'vecteurs' dans notre langage P, mais on les implémentera à partir
// des tableaux JavaScript.  Contrairement à JavaScript, où les tableaux sont
// aussi des objets, ce ne sera pas le cas dans notre langage P.

// **Ajoutez** la fonction prédéfinie `vec` qui retourne un nouveau vecteur
// initialisé avec les éléments `elems`.
define('vec', function(...elems) {

});

exec(`(vec)`); //:
exec(`(vec 1 2 3)`); //:
exec(`(vec (+ 1 1) (+ 2 2) (if 0 2 3))`); //:

// **Ajoutez** la fonction `nth` qui retourne l'élément d'indice `idx` dans le
// vecteur `vec`.  Contrairement à JavaScript, si l'indice est plus petit que
// zéro ou plus grand que la taille du vecteur, c'est une erreur.
define('nth', function(idx, vec) {

});

exec(`(nth 0 (vec 1 2 3))`) === 1; //:
exec(`(nth (+ 1 1) (vec 1 2 3))`) === 3; //:
exec(`(nth 5 (vec 1 2 3))`); //!

// **Ajoutez** la fonction `push` qui empile l'élément `elem` à la fin du
// vecteur `vec`.
define('push', function(elem, vec) {

});

exec(`(push 4 (vec 1 2 3))`); //:
exec(`(push 4 1)`); //!

exec(`(let x 0)
(let v (vec))
(while (< x 5)
  (push x v)
  (set x (+ x 1)))
v`); //:

exec(`(delete x) (delete v)`);

// **Ajoutez** la fonction `pop` qui ôte et retourne l'élément à la fin du
// vecteur `vec`.
define('pop', function(vec) {

});

exec(`(pop (vec 1 2 3))`) === 3; //:
exec(`(let v (vec 1 2 3)) (pop v) (pop v)`) === 2; //:
exec(`(pop (vec))`); //!

exec(`(delete v)`)

// **Ajoutez** la fonction `length` qui retourne la longueur du vecteur `vec`.
define('length', function(vec) {

});

exec(`(length (vec))`) === 0; //:
exec(`(length (vec 1 2 3))`) === 3; //:
