// # Object-Oriented programming without objects (2)

// ## Self reference

// Let's add another method to the point object, the method
// 'rightmost' which takes another point as argument and returns the
// point with the higher x coordinate.  What value should we return
// for the current object?
//
// We have no way to refer to the object itself!  The object itself is
// what is returned by the function `point`.  Instead of returning the
// dispatching function directly, we can save it in a variable.  We'll
// name it `self`, but it's exactly like JavaScript's `this`.
function point(x) {
  var methods;

  function self(msg, arg) {
    if (msg in methods)
      return methods[msg](arg);
    else
      return 'Message not understood';
  }

  methods = {
    x: function() { return x; },
    setX: function(v) { x = v; } ,
    equals: function(p) {
      return p('x') === x;
    },
    rightmost: function(p) {
      return p('x') > x ? p : self;
    }
  };

  return self;
}

var p1 = point(1);
var p2 = point(0);
p2('rightmost', p1) === p1; //: true

// If we try to add this self-reference to the `object` function, the
// same modification is needed.  Furthermore, we need to pass the
// `self` reference as an additional variable to method calls (to be
// able to return it).
function object(state, methods) {
  function self(msg, arg) {
    if (msg in methods)
      return methods[msg](self, arg);
    else
      return 'Message not understood';
  }

  for (var prop in state)
    self[prop] = state[prop];

  return self;
}

// Using this function saves us a bit of typing effort.
function mkPoint(x) {
 return object({x: x}, {
   getX: function(self) { return self.x; },
   setX: function(self, v) { self.x = v; },
   equals: function(self, p) {
     return p('getX') === self('getX');
   },
   rightmost: function(self, p) {
     return self('getX') > p('getX') ? self : p;
   },
 });
}

p1 = mkPoint(1);
p2 = mkPoint(0);
p1('getX'); //: 1
p2('rightmost', p1) === p1; //: true

// In `object`, we copy the attributes onto the returned function, exploiting
// the fact that functions can act as dictionaries.  Alternately, we
// could have passed an extra `state` argument to each method when
// calling them.
function object2(state, methods) {
  function self(msg, arg) {
    if (msg in methods)
      return methods[msg](self, state, arg);
    else
      return 'Message not understood';
  }

  return self;
}

function mkPoint2(x) {
 return object2({x: x}, {
   getX: function(self, state) { return state.x; },
   setX: function(self, state, v) { state.x = v; },
   equals: function(self, state, p) {
     return p('getX') === self('getX');
   },
   rightmost: function(self, state, p) {
     return self('getX') > p('getX') ? self : p;
   },
 });
}

p1 = mkPoint2(1);
p2 = mkPoint2(0);
p1('getX'); //: 1
p2('rightmost', p1) === p1; //: true

// ## Forwarding

// Let's say we want to define a two-dimensional point.  Since we
// already have a one-dimensional one, we would like to reuse its
// functionality for the x coordinate.
function mkPoint2d(x,y) {
  return object({
    y: y,
    point1d: mkPoint(x),
  }, {
    getX: function(self) { return self.point1d('getX'); },
    setX: function(self, v) { self.point1d('setX', v); },
    getY: function(self) { return self.y; },
    setY: function(self, v) { self.y = v; },
    equals: function(self, p) {
      return self.point1d('equals', p) && p('getY') === self('getY');
    },
    rightmost: function(self, p) {
      return self.point1d('rightmost', p);
    },
  });
}

p1 = mkPoint2d(1,2);
p2 = mkPoint2d(3,5);
p1('getX'); //: 1
p1('getY'); //: 2
p1('rightmost', p2) === p2; //: true
p1('setX', 3);
p1('setY', 5);
p1('equals', p2); //: true
p2('equals', p1); //: true

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
// object, it let the delegate object try to answer it.
function objectWithDelegate(state, methods, delegate) {
  function self(msg, arg) {
    if (methods[msg])
      return methods[msg](self, arg);
    else
      return delegate(msg, arg);
  }

  for (var prop in state)
    self[prop] = state[prop];

  return self;
}

function mkPoint2dDelegated(x,y) {
  return objectWithDelegate({y: y}, {
    getY: function(self) { return self.y; },
    setY: function(self, v) { self.y = v; },
    equals: function(self, p) {
      return p('getX') === self('getX') && p('getY') === self('getY');
    },
  }, mkPoint(x));
}

p1 = mkPoint2dDelegated(1,2);
p2 = mkPoint2dDelegated(5,5);
p1('getX'); //: 1
p1('getY'); //: 2
p1('setX', 30);
p1('getX'); //: 30
p1('rightmost', p2) === p1; //: false

// Why does the call to 'rightmost' fail?  To make things worse, note
// that inverting the points gives a different answer, even though
// 'rightmost' is obviously symmetric.
p2('rightmost', p1) === p1; //: true

// Well, it has to do with the binding of the `self` variable.  Recall
// that `rightmost` returns `self`, but `self` in this case refers to
// the one-dimensional point.  But we expect `self` to refer to the
// receiver of the 'rightmost' message, not the object that actually
// responds to it.
//
// We can illustrate the issue another way.
function mkProduct() {
  return object({}, {
    units: function() { return 1; },
    unitPrice: function() { return 2; },
    totalPrice: function(self) { return self('unitPrice') * self('units'); },
  });
}

var p = mkProduct();
p('totalPrice'); //: 2

function mkFruit() {
  return objectWithDelegate({}, {
    units: function() { return 20; },
  }, mkProduct());
}

var f = mkFruit();
f('totalPrice'); // expect 20 * 2, but get //: 2

// This is the exact same issue: the `self` reference inside
// `totalPrice` is static: it always reference the object in which the
// method has been defined.  But we need `self` to be *late-bound*,
// that is, we need it to reference the receiver of the method.
//
// So, we need to pass to the method the reference of the actual
// receiver.  But where does this receiver value come from?  It is
// provided by the original caller of the method, so it must be passed
// as an argument to the dispatcher.
function objectWithSelf(state, methods) {
  function self(receiver, msg, arg) {
    if (msg in methods)
      return methods[msg](receiver, arg);
    else
      return 'Message not understood';
  }

  for (var prop in state)
    self[prop] = state[prop];

  return self;
}

// The same modification is needed in `objectWithDelegate`.  In
// addition, we need to pass the receiver to the delegate.  (Bonus
// question: both functions are quite similar, can we generalize
// them?)
function objectWithSelfAndDelegate(state, methods, delegate) {
  function self(receiver, msg, arg) {
    if (msg in methods)
      return methods[msg](receiver, arg);
    else
      return delegate(receiver, msg, arg);
  }

  for (var prop in state)
    self[prop] = state[prop];

  return self;
}

// We have to redefine `mkProduct` and `mkFruit` with the new
// definitions of `object` and `objectWithDelegate`.
function mkProductWithSelf() {
  return objectWithSelf({}, {
    units: function() { return 1; },
    unitPrice: function() { return 2; },
    totalPrice: function(self) {
      return self(self, 'unitPrice') * self(self, 'units');
    },
  });
}

function mkFruitWithSelf() {
  return objectWithSelfAndDelegate({}, {
    units: function() { return 20; },
  }, mkProductWithSelf());
}

f = mkFruitWithSelf();
f(f, 'totalPrice'); //: 40

// Let's pause for a moment and think of how we need to call the
// methods on our objects now, since we have just changed the
// dispatching function.  We need to pass the receiver of the call as
// the first argument, as this is necessary for delegation.  But when
// the receiver is the object itself, it looks weird.
p = mkProductWithSelf();
p(p, 'units'); //: 1

// We can 'hide' this repetition by using a facade function to call
// methods on objects.
function call(receiver, msg, arg) {
  return receiver(receiver, msg, arg);
}

// Now it looks more regular.
call(p, 'units'); //: 1

// ## Getting back to JavaScript
//
// How does all of this relate to JavaScript objects?  As it turns
// out, JavaScript objects can delegate their property lookup using
// prototypes.  As already stated, `self` is `this`, and JavaScript
// functions can automatically receive `this` as an extra argument.
// There is nothing more to objects and prototypes in JavaScript that
// what we've implemented here.
