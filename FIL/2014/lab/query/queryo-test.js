/* global console */

(function() {

document.addEventListener('DOMContentLoaded', runTests);

function runTests() {
  test(document.querySelector('#test1'), 'p');
  test(document.querySelector('#test2'), '.c1');
  test(document.querySelector('#test3'), '#i1');
  test(document, '#test1 p');
  test(document, '#test2 p.c1');
  test(document, '#test3 p#i1');
  test(document, 'body div p#i1');
  test(document, 'body #test4 .c3 span');
}

function test(element, selector) {
  var qs1 = element.querySelector(selector);
  var qs2 = window.queryo(element, selector);

  if (setEquals(qs1, qs2))
    console.log('%c✓', 'color: green');
  else
    console.error('✗ set differs', qs1, qs2);
}

// Return `true` iff sets `a` and `b` are equal
function setEquals(a, b) {
  if (a == null && b == null) return true;
  if (a == null && b != null) return false;
  if (a != null && b == null) return false;

  if (a.length !== b.length) return false;

  for (var i=0; i < a.length; ++i) {
    for(var j=0; j < b.length; j++) {
      if (a[i] !== b[i])
        return false;
    }
  }

  return true;
}

}());
