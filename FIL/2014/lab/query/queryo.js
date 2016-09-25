// Toy implementation of element.querySelector to better understand
// what it does.

// CSSO is a simple CSS limited to the following grammar:
// selector := simple_selector [ ' ' simple_selector ]*
//
// simple_selector := element_name? [ [ '#', '.' ] element_name ]*

(function() {

// Return the first element that matches the CSSO selector in the
// sub-tree of root `element`.
function queryo(element, selectoro) {
  // Elements returned by element.childNodes can be of type text,
  // without a tagName.  We skip those.
  var childs = filter(element.childNodes, function(el) {
      return el.tagName != null;
  });

  // Depth-first search
  var i = 0;
  var m = null;
  while (m == null && i < childs.length) {
    var el = childs[i];
    if (matcho(el, selectoro))
      m = el;
    else
      m = queryo(el, selectoro);
    ++i;
  }

  return m;
}

// Return all elements matching the CSS-like selector in the sub-tree
// of root `element`.
function queryoAll(element, selectoro) {
  // Elements returned by element.childNodes can be of type text,
  // without a tagName.  We skip those.
  var childs = filter(element.childNodes, function(el) {
      return el.tagName != null;
  });
  var matches = [];

  // Depth-first search
  var i = 0;
  while (i < childs.length) {
    var el = childs[i];
    if (matcho(el, selectoro))
      matches.push(el);
    matches = matches.concat(queryoAll(el, selectoro));
    ++i;
  }

  return matches;
}

function matcho(element, selectoro) {
  var simpleSelectors = selectoro.split(/ /);
  var last = simpleSelectors.pop();

  // Last selector should match the element itself
  if (matchSimple(element, last) === false)
    return false;

  // Previous selectors should match parents up the tree
  var current = element.parentNode;

  while (simpleSelectors.length > 0) {
    var s = simpleSelectors.pop();

    while (current != null && matchSimple(current, s) === false)
      current = current.parentNode;
  }

  return current != null;

  //return matchSimple(element, simpleSelectors[simpleSelectors.length - 1]);

  function matchSimple(element, selectoro) {
    var m = true;
    var ns = selectoro.split(/([#.])/);

    var tagName = ns[0];
    var rest = pair(ns.slice(1));

    // Solitary class/id have no tag name
    if (tagName.length > 0) {
      m = element.tagName === tagName.toUpperCase(); // case-insensitive
    }

    m = m && rest.every(function(name) {
      // id selector
      if (name[0] === '#')
        return element.id === name[1]; // case-sensitive

      // class selector
      else if (name[0] === '.')
        return element.classList.contains(name[1]); // case-sensitive
    });

    return m;
  }
}

function parseCsso(csso, success, error) {
  var rules = csso.split('}');

  var ast = [];

  try {
    rules.forEach(function(r) {
      r = r.trim();
      if (r.length === 0)
        return;

      var rs = r.split('{');
      if (rs.length !== 2)
        throw 'CSSo parse error in rule "' + r + '"';

      var selector = rs[0].trim();
      var decls = rs[1].split(';');

      var declarations = {};

      decls.forEach(function(d) {
        d = d.trim();
        if (d.length === 0)
          return;

        var ds = d.split(':');
        if (ds.length !== 2)
          throw 'CSSo parse error in declaration "' + d + '"';

        declarations[ds[0].trim()] = ds[1].trim();
      });

      ast.push({
        selector: selector,
        declarations: declarations,
      });
    });
  } catch (ex) {
    return error(ex);
  }

  return success(ast);
}

// [a, b, c, d, ...] -> [[a,b], [c,d], ...]
function pair(array) {
  var paired = [];
  for(var i = 0; i < array.length; i += 2) {
    paired.push([array[i], array[i+1]]);
  }
  return paired;
}

var filter = Function.prototype.call.bind([].filter);

this.queryo = queryo;
this.queryoAll = queryoAll;
this.parseCsso = parseCsso;
this.matcho = matcho;

}());
