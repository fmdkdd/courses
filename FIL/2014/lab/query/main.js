/* global console */

(function() {

document.addEventListener('DOMContentLoaded', main);

var htmlo;
var domoOutput;
var renderoOutput;

function main() {
  htmlo = document.getElementById('source');
  domoOutput = document.getElementById('domo-area');
  renderoOutput = document.getElementById('rendero-area');

  htmlo.addEventListener('input', throttle(refresh, 500));
  document.getElementById('render').addEventListener('click', refresh);
  refresh();
}

function refresh() {
  window.parseHtmlo(htmlo.value, function(domo) {
    display(domo);

    clearNode(renderoOutput);
    renderoOutput.appendChild(rendero(domo));
  }, signalError);
}

function signalError(msg) {
  clearNode(renderoOutput);
  renderoOutput.appendChild(document.createTextNode(msg));
}

// Display a DOMO sub-tree as an explorable tree
function display(domo) {
  //console.dir(domo);
}

// Render a DOMO sub-tree using the native DOM
function rendero(domo) {
  // Text node
  if (domo.text != null)
    return document.createTextNode(domo.text);

  // Document node
  else if (domo.tagName == null) {
    var f = document.createDocumentFragment();

    domo.childNodes.forEach(function(n) {
      var c = rendero(n);
      if (c)
        f.appendChild(c);
    });

    return f;
  }

  // Tag
  else {
    var r = tagRenderers[domo.tagName];
    if (r == null)
      r = defaultRenderer;

    return r(domo);
  }
}

var tagRenderers = {
  BLINK: function(domo) {
    var tag = document.createElement('div');

    domo.childNodes.forEach(function(n) {
      var c = rendero(n);
      if (c)
        tag.appendChild(c);
    });

    var period = 500;
    if (domo.attributes.period != null)
      period = parseInt(domo.attributes.period, 10);

    blinker(tag, period);

    return tag;
  },

  CSV: function(domo) {
    var table = document.createElement('table');
    table.classList.add('csv');

    if (domo.childNodes[0].text == null)
      return table;

    var delimiter = domo.attributes.delimiter || ',';

    var rows = domo.childNodes[0].text.split('\n');

    var header = rows.shift().split(delimiter);

    var tr = document.createElement('tr');
    header.forEach(function(n) {
      var th = document.createElement('th');
      th.textContent = n;
      tr.appendChild(th);
    });
    table.appendChild(tr);

    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      var data = r.split(delimiter);
      data.forEach(function(n) {
        var td = document.createElement('td');
        td.textContent = n;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    return table;
  },

  STYLE: function(domo) {
    var csso = domo.childNodes[0].text;

    if (csso == null)
      return null;

    window.parseCsso(csso, applyStyles, signalError);

    function applyStyles(csso) {
      var rooto = domo;
      while (rooto.parentNode != null)
        rooto = rooto.parentNode;

      // Find matching elements for each rule,
      // and save the declarations for the renderer
      csso.forEach(function applyRule(rule) {
        window.queryoAll(rooto, rule.selector)
          .forEach(function(nodo) {
            nodo.style = rule.declarations;
          });
      });
    }

    return null;
  },
};

function applyDeclaration(domo, decls) {
  decls.forEach(function(d) {
    domo.style = cssoStylers[d.property](d.value) ||
      defaultStyler(d.property, d.value);
  });
}

var cssoStylers = {
  'text-decoration': function(tag, value) {
    if (value === 'blink')
      blinker(tag, 500);
  },
};

function defaultStyler(prop) {
  return function(tag, value) {
    tag.style[prop] = value;
  };
}

function defaultRenderer(domo) {
  var tag = document.createElement(domo.tagName);

  domo.childNodes.forEach(function(n) {
    var c = rendero(n);
    if (c)
      tag.appendChild(c);
  });

  if (domo.style) {
    Object.keys(domo.style).forEach(function(prop) {
      var styler = cssoStylers[prop] || defaultStyler(prop);
      styler(tag, domo.style[prop]);
    });
  }

  return tag;
}

function blinker(dom, period) {
  setInterval(function() {
    if (dom.style.visibility === 'visible')
      dom.style.visibility = 'hidden';
    else
      dom.style.visibility = 'visible';
  }, period);
}

function clearNode(n) {
  while (n.firstChild != null)
    n.removeChild(n.firstChild);
}

}());

// Return a function 'f' that will call `fn` only once 'f' has not
// been called for at least `ms` milliseconds.
function throttle(fn, ms) {
  var t;
  return function() {
    if (t) clearTimeout(t);
    t = setTimeout(fn, ms);
  };
}
