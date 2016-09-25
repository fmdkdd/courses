// # Object-Oriented programming without objects

// In this project, you will build the principles of
// object-orientation without using a single object.
//
// The purpose of this is two-fold.  First, it shows that higher-order
// functions and lexical closures are expressive enough to simulate an
// object-oriented language.
//
// Secondly, it reveals that object concepts like method call, dynamic
// dispatch, methods table and self reference are really not magical.
//
// ### Before you begin
//
// To get the full grade, you must:
//
// * Answer all the questions
// * Pass all the tests (every line ending with `//:` should read `true`).
// * Have no linting error.
//
// **Do not change any of the names** of functions or objects defined
// in this file, otherwise the tests will fail.  You are free to use
// any name that make sense to you *inside* the scope of functions.
//
// Use the online editor at http://fmdkdd.github.io/s3c/ to check for
// linting errors.  There should not be any red cross or warning sign
// in the gutter left of the line numbers.
//
// **If your code contains a syntax error, your grade is zero**.
// If you have any linting error, you lose points.  If any of the test
// evaluates to false, you lose points.  If you have an error in your
// code that causes all the tests after that point to fail, you will
// lose many points.
//
// Your code is expected to run on Firefox 34 and above.  If you are
// unsure about the behavior of your code under Firefox, write the
// name and version of the web browser you used as a comment at the
// start of your file.

// ## Get comfortable with closures
//
// To start with, let's review closures.

// We've seen the adder, which takes a first argument and returns a
// closure on `x` which takes a second argument `y` and return the sum
// of `x` and `y`.  We use the term "closures" because we say that the
// `add2` *closes* over its argument `x`.  **Complete** this
// definition.
function adder(x) {

}

var add2 = adder(2);
typeof add2 === 'function'; //:
add2(8) === 10; //:
add2(-2) === 0; //:

// We can view `x` as part of the *state* of the returned function
// `add2`.  It is even more clear when using *mutable state* in the
// closure, as in the `counter`.

// The function `counter` holds an internal value (starting at 0) and
// returns a function which increases and returns its internal value
// when called.  **Complete** its definition.
function counter() {

}

var c1 = counter();
typeof c1 === 'function'; //:
c1() === 1; //:
c1() === 2; //:

var c2 = counter(); //:
typeof c2 === 'function'; //:
c1 !== c2; //:
c2() === 1; //:
c2() === 2; //:

// What if we want to be able to increase or decrease the counter?  We
// can only return one function, but we can accept a 'message'
// argument that will differentiate the cases of increasing and
// decreasing the counter.  **Write** the function.
function bidiCounter() {

}

c1 = bidiCounter();
typeof c1 === 'function'; //:
c1('inc') === 1; //:
c1('inc') === 2; //:
c1('dec') === 1; //:

c2 = bidiCounter();
typeof c2 === 'function'; //:
c1 !== c2; //:
c2('dec') === -1; //:
c2('inc') === 0; //:

// When we think about it, the `c1` function begins to look like an
// object.  It has a state, `x`, and it has ways of executing
// different behavior depending on the message given.

// ## Another example: stack

// Let's try another example: a stack 'object'.
//
// A stack must understand 4 messages:
//
// 1. 'push', which pushes an item on top of the stack;
// 2. 'pop', which removes the item at the top of the stack and
//    returns it;
// 3. 'peek' which returns the item at the top of the stack (but does
//    not remove it);
// 4. 'size' which returns the number of elements in the stack.
//
// In addition, it must return the string "Message not understood"
// when the message argument is not in this list.  **Write** this
// function.
function stack() {

}

var s = stack();
typeof s === 'function'; //:
s('push', 1);
s('push', 2);
s('push', 3);
s('size') === 3; //:
s('pop') === 3; //:
s('peek') === 2; //:
s('size') === 2; //:
s('poke') === "Message not understood"; //:

var s2 = stack();
typeof s2 === 'function'; //:
s !== s2; //:
s2('size') === 0; //:

// ## Dynamic dispatch

// Let's build another collection.  This time a queue, a first-in,
// first-out collection.
//
// The `queue` function creates a queue which responds to the
// following messages:
//
// 1. 'enqueue' takes an argument and adds this element to the end of
//    the queue;
// 2. 'dequeue' removes and returns the first element of the queue;
// 3. 'size' returns the number of elements in the queue.
//
// **Complete** the definition.
function queue() {

}

var q = queue();
typeof q === 'function'; //:
q('enqueue', 1);
q('enqueue', 2);
q('enqueue', 3);
q('size') === 3; //:
q('dequeue') === 1; //:
q('dequeue') === 2; //:
q('q') === "Message not understood"; //:

var q2 = queue();
typeof q2 === 'function'; //:
q !== q2; //:
q2('size') === 0; //:

// Now we can write a generic function size that retrieves the size of
// the collection.  All that matters is that the object passed as an
// argument to this function understands the 'size' message, and
// returns a meaningful value.  **Complete** the definition.
function collectionSize(collection) {

}

collectionSize(s) === 2; //:
collectionSize(q) === 1; //:
collectionSize(stack()) === 0; //:
collectionSize(queue()) === 0; //:

// ## A simple point object

// Another example of abstraction with objects is a 1-dimensional
// point.
//
// The `point` function takes one argument: the initial value for the
// x coordinate of the point, and returns a function that understands
// the following messages:
//
// 1. 'getX': returns the value of the x coordinate;
// 2. 'setX': takes an argument and sets the x coordinate of the point
//    to the argument value;
// 3. 'equals': takes another point as argument, and returns true if
//    and only if both points have the same coordinates.
//
// **Complete** the definition.
function point(x) {

}

var p1 = point(0);
typeof p1 === 'function'; //:
var p2 = point(1);
typeof p2 === 'function'; //:
p1 !== p2; //:
p1('getX') === 0; //:
p2('getX') === 1; //:
p1('equals', p2) === false; //:
p2('equals', p1) === false; //:
p1('setX', 1);
p1('equals', p2); //:
p1() === "Message not understood"; //:

// ## Self reference

// Let's add another method to the point object, the method
// 'rightmost' which takes another point as argument and returns the
// point with the higher x coordinate.  What value should we return
// for the current object?
//
// We have no way to refer to the object itself inside its methods!
// The object itself is what is returned by the function `point`.
//
// **Complete** this definition.
function point2(x) {

}

p1 = point2(1);
typeof p1 === 'function'; //:
p2 = point2(0);
typeof p2 === 'function'; //:
p1 !== p2; //:
p1('rightmost', p2) === p1; //:
p2('rightmost', p1) === p1; //:
p1('equals', p2) === false; //:
p2('equals', p1) === false; //:
p2('setX', 2);
p1('rightmost', p2) === p2; //:
p2('rightmost', p1) === p2; //:
p1() === "Message not understood"; //:

// ## Abstracting the object pattern

// All these object definitions are frankly getting a little
// repetitive.  Once we have seen the pattern, the methods objects is
// always defined in the same way, and the returned function is always
// the same.

// We can abstract the pattern by creating an `object` function, which
// takes the methods of the object to create, and return the
// dispatching function.  **Write** this function.  An example of its
// use follows.
function object(methods) {

}

// Here is how we use `object` to create the bi-directional counter at
// the beginning of this document.  Note that we are using a
// JavaScript object, but only as a dictionary structure.  We could
// have used an array of tuples as well, or a Map.  The literal object
// syntax is just more convenient.
function makeCounter() {
  var i = 0;

 return object({
   inc: function() {
     i += 1;
     return i;
   },

   dec: function() {
     i -= 1;
     return i;
   },
 });
}

c1 = makeCounter();
typeof c1 === 'function'; //:
c1('inc') === 1; //:
c1('inc') === 2; //:
c1('dec') === 1; //:
c1() === "Message not understood"; //:

c2 = makeCounter();
typeof c2 === 'function'; //:
c1 !== c2; //:
c2('dec') === -1; //:
c2('inc') === 0; //:
c2('ee') === "Message not understood"; //:

// ## Self-reference, again

// If we want to define a `point2` object with `object`, we need to to
// pass the object itself to the methods in the dispatcher.  Let's
// call this variant `objectWithSelf`.  **Complete** its definition.
// Look at an example of its use in `makePoint` below.
function objectWithSelf(methods) {

}

// This defines a `point2` object with `objectWithSelf`.  Note how the
// methods receive the object itself as first argument: we can call
// methods on `self`.
function makePoint(x) {
  return objectWithSelf({
    getX: function() {
      return x;
    },

    setX: function(self, v) {
      x = v;
    },

    equals: function(self, p) {
      return p('getX') === self('getX');
    },

    rightmost: function(self, p) {
      return self('getX') > p('getX') ? self : p;
    },
  });
}

p1 = makePoint(1);
typeof p1 === 'function'; //:
p2 = makePoint(0);
typeof p2 === 'function'; //:
p1 !== p2; //:
p1('rightmost', p2) === p1; //:
p2('rightmost', p1) === p1; //:
p2('setX', 2);
p1('rightmost', p2) === p2; //:
p2('rightmost', p1) === p2; //:
p1() === "Message not understood"; //:

// ## Forwarding

// Let's say we want to define a two-dimensional point.  Since we
// already have a one-dimensional one, we would like to reuse its
// functionality for the x coordinate.  We can define this object
// using `objectWithSelf` and `makePoint`.  We'll leave the
// `rightmost` method for later, as it will prove problematic.
function makePoint2d(x,y) {
  var point1d = makePoint(x);

  return objectWithSelf({
    getX: function() {
      return point1d('getX');
    },

    setX: function(self, v) {
      point1d('setX', v);
    },

    getY: function() {
      return y;
    },

    setY: function(self, v) {
      y = v;
    },

    equals: function(self, p) {
      return point1d('equals', p) && p('getY') === self('getY');
    },
  });
}

// **Check** that all these tests return `true`, otherwise you made a
// mistake in `objectWithSelf`.
p1 = makePoint2d(1,2);
typeof p1 === 'function'; //:
p2 = makePoint2d(3,5);
typeof p2 === 'function'; //:
p1 !== p2; //:
p1('getX') === 1; //:
p1('getY') === 2; //:
p2('getX') === 3; //:
p2('getY') === 5; //:
p1('equals', p2) === false; //:
p1('setX', 3);
p1('setY', 5);
p1('equals', p2); //:
p2('equals', p1); //:
p1('equals', p1); //:
p2('equals', p2); //:

// We have effectively forwarded the messages we did not want to
// handle on the internal `point1d`.  Though we have to be exhaustive
// in `makePoint2d`: every message that we want to forward must be
// explicitly specified as such.

// ## Delegation

// What if we could define a handler object for all messages we do not
// wish to capture?  That would save us from explicitly forwarding all
// messages.

// The `objectWithDelegate` function takes an additional argument, the
// `delegate` object, and when the method is not found in the current
// object, it lets the delegate object try to answer it.  **Write**
// this function.  You should also add the delegate in a property
// named `delegate` to the returned function, in order for `equals` to
// work in the example below.
function objectWithDelegate(methods, delegate) {

}

// Here is how we use it.  Note the additional argument to
// `objectWithDelegate`.  Also note the `self.delegate` in `equals` to
// refer to the delegate object from inside the methods.
function makePoint2dDelegated(x, y) {
  return objectWithDelegate({
    getY: function() {
      return y;
    },

    setY: function(self, v) {
      y = v;
    },

    equals: function(self, p) {
      return self.delegate('equals', p) && p('getY') === self('getY');
    },
  }, makePoint(x));
}

p1 = makePoint2dDelegated(1,2);
typeof p1 === 'function'; //:
p2 = makePoint2dDelegated(3,5);
typeof p2 === 'function'; //:
p1 !== p2; //:
p1('getX') === 1; //:
p1('getY') === 2; //:
p2('getX') === 3; //:
p2('getY') === 5; //:
p1('equals', p2) === false; //:
p2('equals', p1) === false; //:
p1('setX', 3);
p1('setY', 5);
p1('equals', p2); //:
p2('equals', p1); //:
p1('equals', p1); //:
p2('equals', p2); //:

// ## Fixing the self

// Why does the call to 'rightmost' fail?  To make things worse, note
// that inverting the points gives a different answer, even though
// 'rightmost' is obviously a symmetric operation.
p1 = makePoint2dDelegated(1,2);
p2 = makePoint2dDelegated(3,5);
p2('rightmost', p1) === p2 === false; //:
p1('rightmost', p2) === p2 === true; //:

// Well, it has to do with the binding of the `self` variable.  Recall
// that `rightmost` returns `self`, but since `rightmost` is called
// from a 1-dimensional point, `self` in this refers to the
// 1-dimensional point object.  In the current case, we expect `self`
// to refer to the *receiver* of the 'rightmost' message, not the
// object that actually responded to it.

// To fix this issue, we need to pass to each method the reference of
// the actual receiver.  But where does this receiver value come from?
// It is provided by the original caller of the method, so it must be
// passed as an argument to the dispatcher.  **Write** the functions
// `objectWithSelf2` and `objectWithDelegate2` that correctly handles
// the issue with `rightmost`.  Check that they work with the example
// below.
function objectWithSelf2(methods) {

}

function objectWithDelegate2(methods, delegate) {

}

// To check that it works, we can just create a point objects that
// delegates everything to a 1-dimensional point.  We must first
// define a new version of `makePoint` that handles the additional
// `receiver`argument.  Note the additional arguments when calling a
// method on `self` and `p` in `rightmost`.
function makePointWithReceiver(x) {
  return objectWithSelf2({
    getX: function() { return x; },
    setX: function(self, v) { x = v; },
    rightmost: function(self, p) { return self(self, 'getX') > p(p, 'getX') ? self : p; },
  });
}

function makePointDelegated(x) {
  return objectWithDelegate2({}, makePointWithReceiver(x));
}

p1 = makePointDelegated(1);
p2 = makePointDelegated(3);
p1(p1, 'setX', 2);
p1(p1, 'getX') === 2; //:
p1(p1, '') === "Message not understood"; //:

// Again, the receiver is the first argument when calling methods now.
p2(p2, 'rightmost', p1) === p2; //:
p1(p1, 'rightmost', p2) === p2; //:

// ## Getting back to JavaScript
//
// How does all of this relate to JavaScript objects?  The `self`
// reference we used is called `this` in JavaScript, and `this` is an
// hidden argument to functions (contrast this to methods in Python,
// which receive an extra `self` argument).  The 'delegate' link we
// defined is just the prototype link of JavaScript objects.  The
// passing of the receiver object to the delegated method is exactly
// the same mechanism.  There is nothing more to objects and
// prototypes in JavaScript than what we've implemented here.
