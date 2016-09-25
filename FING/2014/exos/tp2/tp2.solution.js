// # Creating objects in JavaScripts

var c1, c2;

// ## Singleton literal
//
// The easiest way to create an object in JavaScript is to create a
// *singleton*.  The object literal syntax makes this concise.

// **Complete** this definition, and **check** that all the tests
// evaluate to `true`.
var counterSingleton = {
  i: 0,

  inc: function() {
    counterSingleton.i += 1;
    return counterSingleton.i;
  },

  dec: function() {
    counterSingleton.i -= 1;
    return counterSingleton.i;
  },
};

c1 = counterSingleton;
c2 = counterSingleton;

// Since its a singleton, there are no "instances", just aliasing of
// the same object.
c1 === c2; //:

c1.inc() === 1; //:
c1.inc() === 2; //:
c2.inc() === 3; //:
c1.dec() === 2; //:
c1.dec() === 1; //:

// ## Closure with state
//
// The singleton has its uses, but what if we need more than one
// counter?  In this case, we can get by with a *closure*.

// The `counterFactory` function returns an object that contains the
// two methods `inc` and `dec`.  Each of these method refer to the `i`
// that is defined inside `counterFactory`.  **Complete** the
// definition and check the tests.
function counterFactory() {
  var i = 0;

  return {
    inc: function() {
      i += 1;
      return i;
    },

    dec: function() {
      i -= 1;
      return i;
    },
  };
}

c1 = counterFactory();
c2 = counterFactory();

// This time the two objects are different
c1 !== c2; //:

c1.inc() === 1; //:
c1.inc() === 2; //:
c2.inc() === 1; //:
c1.dec() === 1; //:
c1.dec() === 0; //:

// The functions, however, are also different, even though they
// contain the same code.  Each instance has new functions.  Not only
// does this waste memory space, but it prevents us from easily adding
// or changing functions on all the instances at once.
c1.inc !== c2.inc; //:
c1.dec !== c2.dec; //:

// ## Factory and prototype object

// Since the issue with `counterFactory` is duplication, we will
// define the functions `inc` and `dec` outside the factory, in a
// *prototype* object.  Note that now the methods need to refer to `i`
// using the special value `this`, since we do not know the instance
// when defining these methods.  **Complete** the definition, and the
// factory below, then check the tests.
var counterPrototype = {
  inc: function() {
    this.i += 1;
    return this.i;
  },

  dec: function() {
    this.i -= 1;
    return this.i;
  },
};

// The `counterPrototypeFactory` function returns a new object that
// has `counterPrototype` as its prototype.  This is achieved using
// `Object.create`.
function counterPrototypeFactory() {
  var obj = Object.create(counterPrototype);
  obj.i = 0;
  return obj;
}

c1 = counterPrototypeFactory();
c2 = counterPrototypeFactory();

c1 !== c2; //:

c1.inc() === 1; //:
c1.inc() === 2; //:
c2.inc() === 1; //:
c1.dec() === 1; //:
c1.dec() === 0; //:

// This time, the functions are the same.
c1.inc === c2.inc; //:
c1.dec === c2.dec; //:


// ## Constructor function
//
// The previous pattern is not the most common way to define objects
// in JavaScript.  The usual way is to use a *constructor function*.
// But the differences between the two are superficial.

// First we need to define the constructor.  Here we just need to set
// the instance properties.
function CounterConstructor() {
  this.i = 0;
}

// Then, to define the methods, we add properties to the
// `CounterConstructor.prototype` object.  **Complete** this
// definition.
CounterConstructor.prototype.inc = function() {
  this.i += 1;
  return this.i;
};

CounterConstructor.prototype.dec = function() {
  this.i -= 1;
  return this.i;
};

// Lastly, to call the constructor function we need to use the keyword
// `new`.
c1 = new CounterConstructor();
c2 = new CounterConstructor();

c1 !== c2; //:

c1.inc() === 1; //:
c1.inc() === 2; //:
c2.inc() === 1; //:
c1.dec() === 1; //:
c1.dec() === 0; //:

// Functions are still shared.
c1.inc === c2.inc; //:
c1.dec === c2.dec; //:


// ## Literal with constructor
//
// Using a prototype object and a factory or using a constructor
// function and extending its `prototype` object are equivalent.  The
// former is more explicit, while the latter hides the object
// construction and prototype assignation with the `new` keyword.
//
// But they both lack in syntactic cohesion.  The constructor must be
// defined in one place, the prototype in another.  Is there another
// way?

// The `counterLiteral` object integrates its constructor as a
// property named `new`.  This is exactly the same as in the factory
// and prototype object pattern, but with the factory moved as a
// property of the prototype object.  **Complete** this definition.
var counterLiteral = {
  new: function() {
    var obj = Object.create(counterLiteral);
    obj.i = 0;
    return obj;
  },

  inc: function() {
    this.i += 1;
    return this.i;
  },

  dec: function() {
    this.i -= 1;
    return this.i;
  },
};

// `new` is just a standard method of `counterLiteral`.  No need for a
// special keyword.
c1 = counterLiteral.new();
c2 = counterLiteral.new();

c1 !== c2; //:

c1.inc() === 1; //:
c1.inc() === 2; //:
c2.inc() === 1; //:
c1.dec() === 1; //:
c1.dec() === 0; //:

// Functions are still shared.
c1.inc === c2.inc; //:
c1.dec === c2.dec; //:


// # The reset counter
//
// Now we wish to extend the counter with a reset functionality.  Of
// course we not want to modify the counter objects themselves, since
// we also wish to create plain counter alongside reset counters.  We
// would like reset counters to *inherit* the `inc` and `dec` methods
// from counter objects.

var r1, r2;

// ## Singleton literal

// Extending a singleton object is easily done by assigning a parent
// object as the value of the special `__proto__` property.
// **Complete** this definition.
var resetCounterSingleton = {
  __proto__: counterSingleton,

  resetCount: 0,

  reset: function() {
    this.i = 0;
    this.resetCount += 1;
  },
};

r1 = resetCounterSingleton;

// This checks that even though `inc` and `dec` are not defined on the
// object `r1` itself, we can still reach them via the prototype
// chain.
r1.hasOwnProperty('inc') === false; //:
r1.hasOwnProperty('dec') === false; //:
'inc' in r1; //:
'dec' in r1; //:

r1.resetCount === 0; //:
r1.inc() === 2; //:
r1.inc() === 3; //:
r1.i === 3; //:
r1.reset();
r1.i === 0;
r1.resetCount === 1; //:


// ## Factory and prototype object
//
// Of course, if we want more than one instance of reset counter, we
// cannot settle with a singleton.

// The first way to do that is to use the factory and prototype object
// again.  Here, the prototype object will inherit from
// `counterPrototype`.
var resetCounterPrototype = {
  __proto__: counterPrototype,

  reset: function() {
    this.i = 0;
    this.resetCount += 1;
  },
};

function resetCounterPrototypeFactory() {
  var obj = Object.create(resetCounterPrototype);
  obj.i = 0;
  obj.resetCount = 0;
  return obj;
}

r1 = resetCounterPrototypeFactory();
r2 = resetCounterPrototypeFactory();

// The `inc` and `dec` methods are inherited.
r1.hasOwnProperty('inc') === false; //:
r1.hasOwnProperty('dec') === false; //:
'inc' in r1; //:
'dec' in r1; //:

r1.resetCount === 0; //:
r1.inc() === 1; //:
r1.inc() === 2; //:
r1.i === 2; //:
r1.reset();
r1.i === 0;
r1.resetCount === 1; //:

// The two instances are distinct and do not share state.
r1 !== r2; //:
r2.i === 0; //:
r2.resetCount === 0; //:


// ## Function constructor

// Same as before, but with the additional prototype link.
// **Complete** these definitions.
function ResetCounterConstructor() {
  this.i = 0;
  this.resetCount = 0;
}

ResetCounterConstructor.prototype = Object.create(CounterConstructor.prototype);
ResetCounterConstructor.prototype.constructor = ResetCounterConstructor;
ResetCounterConstructor.prototype.reset = function() {
  this.i = 0;
  this.resetCount += 1;
};

r1 = new ResetCounterConstructor();
r2 = new ResetCounterConstructor();

r1.hasOwnProperty('inc') === false; //:
r1.hasOwnProperty('dec') === false; //:
'inc' in r1; //:
'dec' in r1; //:

r1.resetCount === 0; //:
r1.inc() === 1; //:
r1.inc() === 2; //:
r1.i === 2; //:
r1.reset();
r1.i === 0;
r1.resetCount === 1; //:

r1 !== r2; //:
r2.i === 0; //:
r2.resetCount === 0; //:

// ## Literal with constructor

// The last pattern is, once again, the literal object with a
// constructor.  **Complete** this definition and check the tests.
var resetCounterLiteral = {
  __proto__: counterLiteral,

  new: function() {
    var obj = Object.create(this);
    obj.i = 0;
    obj.resetCount = 0;
    return obj;
  },

  reset: function() {
    this.i = 0;
    this.resetCount += 1;
  },
};

r1 = resetCounterLiteral.new();
r2 = resetCounterLiteral.new();

r1.hasOwnProperty('inc') === false; //:
r1.hasOwnProperty('dec') === false; //:
'inc' in r1; //:
'dec' in r1; //:

r1.resetCount === 0; //:
r1.inc() === 1; //:
r1.inc() === 2; //:
r1.i === 2; //:
r1.reset();
r1.i === 0;
r1.resetCount === 1; //:

r1 !== r2; //:
r2.i === 0; //:
r2.resetCount === 0; //:

// Finally, with this last pattern, we can add methods on objects, and
// use `new` to create objects that share these methods.  You might
// have to alter `resetCounterLiteral` to make the following tests
// work.
r1.set = function(i) { this.i = i; };
var r3 = r1.new();
r1.hasOwnProperty('set'); //:
'set' in r1; //:
r3.hasOwnProperty('set') === false; //:
'set' in r3; //:

// Only objects created from `r1` have the `set` method.
'set' in r2 === false; //:

// ## Bonus
//
// We could have used the closure pattern as well to define a reset
// counter and still use delegation.  Can you write it?
