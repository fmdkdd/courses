// Creating objects in JavaScript

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Singleton literal
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// The easiest way to create an object in JavaScript is to create a *singleton*.
// The object literal syntax makes this concise.

// **Complete** this definition, and **check** that all the tests evaluate to
// `true`.
let counterSingleton = {
  i: 0,

  inc: function() {
    counterSingleton.i += 1;
    return counterSingleton.i;
  },

  dec: function() {

  },
};

let c1 = counterSingleton;
let c2 = counterSingleton;

// Since its a singleton, there are no "instances".  c1 and c2 are just aliases
// of the same object.
c1 === c2; //:

c1.inc() === 1; //:
c1.inc() === 2; //:
c2.inc() === 3; //:
c1.dec() === 2; //:
c1.dec() === 1; //:

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Closure with state
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// The singleton has its uses, but usually when we think of objects, we think of
// instances.  what if we need more than one counter?  In this case, we can get
// by with a *closure*.

// The `counterFactory` function returns an object that contains the two methods
// `inc` and `dec`.  Each of these method refer to the `i` that is defined
// inside `counterFactory`.  **Complete** the definition and check the tests.
function counterFactory() {
  let i = 0;

  return {

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

// The functions `inc` and `dec`, however, are also different, even though they
// contain the same code.  Each instance of counter has its own version of `inc`
// and `dec`.  Not only does this waste memory, it prevents us from easily
// redefining these functions at runtime for all instances.
c1.inc !== c2.inc; //:
c1.dec !== c2.dec; //:

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Factory and prototype object
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Since the issue with `counterFactory` is duplication, we will define the
// functions `inc` and `dec` outside the factory, in a *prototype* object.  Note
// that the methods need to refer to `i` using the special value `this`, whereas
// previously we were /closing over/ the local `i`.  The keyword `this` is
// necessary to refer to the receiver, which is unknown at the time we are
// defining these methods.  **Complete** the definition, and the factory below,
// then check the tests.
let counterPrototype = {
  inc: function() {
    this.i += 1;
    return this.i;
  },
};

// The `counterPrototypeFactory` function returns a new object that has
// `counterPrototype` as its prototype.  This is achieved using `Object.create`.
// This function is essentially a constructor.
function counterPrototypeFactory() {

}

c1 = counterPrototypeFactory();
c2 = counterPrototypeFactory();

// We have two separate instances.
c1 !== c2; //:

c1.inc() === 1; //:
c1.inc() === 2; //:
c2.inc() === 1; //:
c1.dec() === 1; //:
c1.dec() === 0; //:

// But this time, their methods are the same.
c1.inc === c2.inc; //:
c1.dec === c2.dec; //:

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Constructor function
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// The previous pattern is not the most common way to define objects in
// JavaScript.  The usual way (prior to ES6) is to use a *constructor function*.
// But the differences between the two are superficial.

// First we need to define the constructor.  Here we just need to set
// the instance properties.
function CounterConstructor() {
  this.i = 0;
}

// Then, to define the methods, we add properties to the
// `CounterConstructor.prototype` object.  **Complete** this definition.
CounterConstructor.prototype.inc = function() {

};

CounterConstructor.prototype.dec = function() {

};

// Lastly, to call the constructor function we need to use the keyword `new`.
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

// Using a prototype object and a factory or using a constructor function and
// extending its `prototype` object are equivalent.  The former is more
// explicit, while the latter hides the object construction and prototype
// assignation with the `new` keyword.

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Classes (ES6)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// The standard way to build classes in ECMAScript 6 is to use the `class`
// keyword.  The difference is again syntactical: the `class` keyword is mostly
// syntactic sugar on top of the constructor function + prototype object
// pattern.

// **Complete** the constructor, the `inc` method and add the `dec` method.
class CounterClass {
  constructor() {

  }

  inc() {

  }
}

c1 = new CounterClass();
c2 = new CounterClass();

// Results are the same as above
c1 !== c2; //:
c1.inc() === 1; //:
c1.inc() === 2; //:
c2.inc() === 1; //:
c1.dec() === 1; //:
c1.dec() === 0; //:
c1.inc === c2.inc; //:
c1.dec === c2.dec; //:

// Using `class` makes the intention clearer, especially to programmers used to
// class-based language.  But make no mistake: it does not turn JavaScript into
// a class-based language.  It's all prototypes behind the scenes:

typeof CounterClass === 'function'; //:
'inc' in CounterClass.prototype; //:
'dec' in CounterClass.prototype; //:

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// `class` or constructor + prototype object?
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// If you have ES6 support, you should use the `class` keyword to define classes
// since, outside of a few corner cases, you are expressing the exact same thing
// with a clearer syntax.

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Literal with constructor
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Just to show that JavaScript is flexible, we will consider one final object
// construction pattern.  This one is syntactically close to the `class` one,
// but the constructor is not treated specially.

// The `counterLiteral` object integrates its constructor as a property named
// `new`.  This is the same as in the factory and prototype object pattern, but
// with the factory moved as a method of the prototype object.  **Complete**
// this definition.
let counterLiteral = {

};

// `new` is just a method of `counterLiteral`.  No need for a special keyword.
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The reset counter
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Now we wish to extend the counter with a reset functionality.  Of course we
// not want to modify the counter objects themselves, since we also wish to
// create plain counter alongside reset counters.  We would like reset counters
// to *inherit* the `inc` and `dec` methods from counter objects.
//
// We'll see how the different patterns above handle inheritance.

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Singleton literal
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Extending a singleton object is easily done by assigning a parent object as
// the value of the special `__proto__` property.  **Complete** this definition.
let resetCounterSingleton = {

};

let r1 = resetCounterSingleton;

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Factory and prototype object
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Of course, if we want more than one instance of reset counter, we cannot
// settle with a singleton.

// The first way to do that is to use the factory and prototype object again.
// Here, the prototype object will inherit from `counterPrototype`.
let resetCounterPrototype = {

};

function resetCounterPrototypeFactory() {

}

r1 = resetCounterPrototypeFactory();
let r2 = resetCounterPrototypeFactory();

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Function constructor
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Same as before, but with the additional prototype link.  **Complete** these
// definitions.
function ResetCounterConstructor() {

}

ResetCounterConstructor.prototype = Object.create(CounterConstructor.prototype);
ResetCounterConstructor.prototype.constructor = ResetCounterConstructor;

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Class (ES6)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// With a `class`, we can inherit conveniently using the `extends` keyword.
// This is yet another advantage of using the `class` keyword other the
// constructor function pattern above.

// **Complete** this definition using `extends`.
class ResetCounterClass {

}

r1 = new ResetCounterClass();
r2 = new ResetCounterClass();

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Literal with constructor
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// The last pattern is, once again, the literal object with a constructor.
// **Complete** this definition and check the tests.
let resetCounterLiteral = {

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

// The last pattern has one interesting twist: We can add methods on objects,
// and use `new` to create objects that share these methods.  You might have to
// alter `resetCounterLiteral.new` to make the following tests work.
r1.set = function(i) { this.i = i; };
let r3 = r1.new();
r1.hasOwnProperty('set'); //:
'set' in r1; //:
r3.hasOwnProperty('set') === false; //:
'set' in r3; //:

// Note that only objects created from `r1.new` have the `set` method:
'set' in r2 === false; //:

// So, `r1` is an instance of the `resetCounterLiteral` prototype, but `r3` is
// an instance of the `r1` prototype.  Note that we didn't need to create a
// class for `r1` in order to derive an instance from it.  That is the main
// characteristic of prototype-based languages.  In class-based languages, by
// you need to create classes before creating instances.  In prototype-based
// languages, you can derive from other instances.

//~~~~~~~~
// Bonus
//~~~~~~~~
//
// We could have used the closure pattern as well to define a reset counter and
// still use delegation.  Can you write it?
