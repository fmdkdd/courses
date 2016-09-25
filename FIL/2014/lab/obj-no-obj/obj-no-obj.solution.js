// # Object-Oriented programming without objects

// In this exercise, you will build the principles of
// object-orientation without using a single object.
//
// The purpose of the exercise is two-fold.  First, it shows that
// higher-order functions and lexical closures are expressive enough
// to simulate an object-oriented language.
//
// Secondly, it reveals that object concepts like method call, dynamic
// dispatch, methods table and self reference are really not magical.

// ## Get comfortable with closures

// To start with, let's get comfortable with closures.
//
// We've seen the adder, which takes a first argument and returns
// closure on `x` which takes a second argument `y` and return the sum
// of `x` and `y`.  We use the term "closures" because we say that the
// `add2` *closes* over its argument `x`.
function adder(x) {
  return function(y) {
    return x + y;
  };
}

var add2 = adder(2);
add2(8); // 10

// We can view `x` as part of the *state* of the returned function
// `add2`.  It is even more clear when using *mutable state* in the
// closure, as in the `counter`.
//
// The function `counter` holds an internal value and returns a
// function which increases and returns its internal value when
// called.
function counter() {
  var x = 0;
  return function() {
    x += 1;
    return x;
  };
}

var c = counter();
c(); // 1
c(); // 2

// What if we want to be able to increase or decrease the counter?  We
// can only return one function.  But we can accept a 'message'
// argument that will differentiate the cases of increasing and
// decreasing the counter.
function bidiCounter() {
  var x = 0;
  return function(message) {
    if (message === 'inc') {
      x += 1;
      return x;
    } else if (message === 'dec') {
      x -= 1;
      return x;
    }
  };
}

var c = bidiCounter();
c('inc'); // 1
c('inc'); // 2
c('dec'); // 1

// Alternatively, we could have returned an array of two functions:
// inc and dec.
function bidiCounter2() {
  var x = 0;
  return [function inc() {
    x += 1;
    return x;
  }, function dec() {
    x -= 1;
    return x;
  }];
}

var cmds = bidiCounter2();
var inc = cmds[0];
var dec = cmds[1];
inc(); // 1
inc(); // 2
dec(); // 1

// When we think about it, the `c` function begins to look like an
// object.  It has states, `x`, and it has ways of executing different
// behavior depending on the message given.

// ## Another example: stack

// Let's try another example: a stack 'object'.
//
// A stack must understands 4 messages:
// 1. 'push', which pushes a item on top of the stack
// 2. 'pop', which removes the item at the top of the stack and
//    returns it
// 3. 'peek' which returns the item at the top of the stack (but does
//    not remove it)
// 4. 'size' which returns the number of elements in the stack
function stack() {
  var items = [];

  return function(msg, arg) {
    if (msg === 'push') items.push(arg);
    else if (msg === 'pop') return items.pop();
    else if (msg === 'peek') return items[items.length - 1];
    else if (msg === 'size') return items.length;
    else return 'Message not understood';
  };
}

var s = stack();
s('push', 1);
s('push', 2);
s('push', 3);
s('size'); // 3
s('pop'); // 3
s('peek'); // 2
s('size'); // 2
s('poke'); // Message not understood

// A cleaner way to write this is to define each internal 'method' as
// a property function inside a list of `methods`.  Note that we are
// using a JavaScript object, but only as a dictionary structure.  We
// could have used an array as well, or a Map.
function stack2() {
  var items = [];

  var methods = {
    push: function(item) { items.push(item); },
    pop: function() { return items.pop(); },
    peek: function() { return items[items.length - 1]; },
  };

  return function(msg, arg) {
    if (methods[msg])
      return methods[msg](arg);
    else
      return 'Message not understood';
  };
}

// We use `stack2` exactly like we use `stack`.  The pattern is then
// apparent: inner variables to hold state, a dictionary of methods
// and a returned function that dispatches depending on the requested
// command.

// ## Dynamic dispatch

// Let's build another collection.  This time a queue, a first-in,
// first-out collection.
//
// The `queue` function creates a queue which responds to the
// following messages:
// 1. 'enqueue' takes an argument and adds this element to the end of
//    the queue
// 2. 'dequeue' removes and returns the first element of the queue
// 2. 'size' returns the number of elements in the queue
function queue() {
  var items = [];

  var methods = {
    enqueue: function(item) { items.push(item); },
    dequeue: function() { return items.shift(); } ,
    size: function() { return items.length; },
  };

  return function(msg, arg) {
    if (methods[msg])
      return methods[msg](arg);
    else
      return 'Message not understood';
  };
}

var q = queue();
q('enqueue', 1);
q('enqueue', 2);
q('enqueue', 3);
q('size'); // 3
q('dequeue'); // 1
q('dequeue'); // 2

// Now, we can write a generic function size that retrieves the size
// of the collection.  All that matters is that the object passed as
// an argument to this function understands the message 'size', and
// returns a meaningful value.
function collectionSize(collection) {
  return collection('size');
}

collectionSize(q);
collectionSize(s);

// ## A simple point object

// Another example of abstraction with objects is a 1-dimensional
// point.
//
// The `point` function takes one argument: the initial value for the
// x coordinate of the point, and returns a function that understands
// the following messages:
//
// 1. 'x': returns the value of the x coordinate
// 2. 'setX': takes an argument and sets the x coordinate of the point
//    to the argument value
// 3. 'equals': takes another point as argument, and returns true if
//    and only if both points have the same coordinates
function point(x) {
  var methods = {
    x: function() { return x; },
    setX: function(v) { x = v; } ,
    equals: function(p) {
      return p('x') === x;
    },
  };

  return function(msg, arg) {
    if (methods[msg])
      return methods[msg](arg);
    else
      return 'Message not understood';
  };
}

var p1 = point(0);
var p2 = point(1);
p1('x'); // 0
p1('equals', p2); // false
p1('setX', 1);
p1('equals', p2); // true

// ## Abstracting the object pattern

// All these object definitions are frankly getting a little
// repetitive.  Once we have seen the pattern, the methods objects is
// always defined in the same way, and the returned function is always
// the same.
//
// We can abstract the pattern by creating an `object` function, which
// takes the attributes and the methods of the object to create, and
// return the dispatching function.
function object(state, methods) {
  return function(msg, arg) {
    if (methods[msg])
      return methods[msg](state, arg);
    else
      return 'Message not understood';
  };
}

// Here is how we would use `object` to create the bi-directional
// counter at the beginning of this document.
function mkCounter() {
 return object({
   counter: 0
 }, {
   inc: function(state) {
     state.counter += 1;
     return state.counter;
   },

   dec: function(state) {
     state.counter -= 1;
     return state.counter;
   },
 });
}

var c = mkCounter();
c('inc'); // 1
c('dec'); //
