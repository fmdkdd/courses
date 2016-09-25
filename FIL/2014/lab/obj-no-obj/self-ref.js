// # Object-Oriented programming without objects (2)

// ## Self reference

// Let's add another method to the point object, the method
// 'rightmost' which takes another point as argument and returns the
// point with the higher x coordinate.  What value should we return
// for the current object?  **Complete** this definition.
function point(x) {
  var methods = {
    x: function() { return x; },
    setX: function(v) { x = v; } ,
    equals: function(p) {
      return p('x') === x;
    },
    rightmost: function(p) {
      return p('x') > x ? p : ???;
    }
  };

  return function(msg, arg) {
    if (methods[msg])
      return methods[msg](arg);
    else
      return 'Message not understood';
  };
}

var p1 = point(1);
var p2 = point(0);
p2('rightmost', p1) === p1; // true
p1('rightmost', p2) === p1; // true

// Can we try to add this self-reference to the `object` function?
// **Modify** this definition to handle self-references.
function object(state, methods) {
  return function(msg, arg) {
    if (methods[msg])
      return methods[msg](state, arg);
    else
      return 'Message not understood';
  };
}

// Using this function saves us a bit of typing effort.
function mkPoint(x) {
 return object({x:x}, {
   x: function(self) { return self.x; },
   setX: function(self, v) { self.x = v; },
   equals: function(self, p) {
     return p('x') === self('x');
   },
   rightmost: function(self, p) {
     return self('x') > p('x') ? self : p;
   },
 });
}

// ## Forwarding

// Let's say we want to define a two-dimensional point.  Since we
// already have a one-dimensional one, we would like to reuse its
// functionality for the x coordinate.  How to write such a point?
// **Complete** the definition by forwarding calls to `x`, `setX` and
// `rightmost` to the `point1d` object that is part of the state.
function mkPoint2d(x,y) {
  return object({
    y: y,
    point1d: mkPoint(x),
  }, {
    x: /* ... */
    setX: /* ... */
    y: /* ... */
    setY: /* ... */
    equals: /* ... */
    rightmost: /* ... */
  });
}

var p1 = mkPoint2d(1,2);
var p2 = mkPoint2d(3,5);
p1('x'); // 1
p1('y'); // 2
p1('rightmost', p2) === p2; // true
p1('setX', 3);
p1('setY', 5);
p1('equals', p2); // true

// We have effectively forwarded the messages we did not want to
// handle on the internal `point1d`.  Though we have to be exhaustive
// in `mkPoint2d`: every message that we want to forward must be
// explicitly specified as such.

// ## Delegation

// What if we could define a handler object for all messages we do not
// wish to capture?  In `point2d`, if a message is unknown, it
// *delegates* the message to `point1d`.
//
// The `objectWithDelegate` function takes an additional argument, the
// `delegate` object, and when the method is not found in the current
// object, it let the delegate object try to answer it.  **Complete**
// this definition.  You should start from the `object` function that
// handles self-reference.
function objectWithDelegate(state, methods, delegate) {
  /* ... */
}

function mkPoint2d(x,y) {
  return objectWithDelegate({y: y}, {
    y: function(self) { return self.y; },
    setY: function(self, v) { self.y = v; },
    equals: function(self, p) {
      return p('x') === self('x') && p('y') === self('y');
    },
  }, mkPoint(x));
}

var p1 = mkPoint2d(1,2);
var p2 = mkPoint2d(5,5);
p1('x'); // 1
p1('y'); // 2
p1('setX', 30);
p1('x'); // 30
p1('rightmost', p2) === p1; // you tell me

// The call to 'rightmost' is interesting.  You have to decide first
// what it should output.  Then you have to find out what it gives
// with your version of `objectWithDelegate`.

// ## Getting back to JavaScript
//
// How does all of this relate to JavaScript objects?  As it turns
// out, JavaScript objects can delegate their property lookup using
// prototypes.  As already stated, `self` is `this`, and JavaScript
// functions can automatically receive `this` as an extra argument.
// There is nothing more to objects and prototypes in JavaScript that
// what we've implemented here.
