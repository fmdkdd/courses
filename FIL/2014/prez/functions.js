// ## Function syntax
function add(x, y) {
   return x + y;
}

add(1, 2);

// ## Functions can be anonymous
var add = function(x,y) {
  return x + y;
}

add(1, 2);

// ## Functions are first-class values

// Functions can return functions
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

var plus2 = makeAdder(2);
plus2(5);

// Functions can receive functions as arguments
function double(fn) {
  return [fn(), fn()];
}

multiply(function(n) {
 return n * n;
});

// And functions can passed around in variables
function vector(x, y) {
  return [x, y];
}

var v = vector;

v(1, 2);

// ## Function arity does not matter
// Functions can be called with any number of arguments

// If |actual arguments| < |formal arguments|, the remaining formal
// arguments are undefined
add(1);

// If |actual arguments| > |formal arguments|, the extra actual
// arguments are dropped
add(1,2,3);

// Consequence: f(a) and f(a,b) are the same functions

// If you want to know the expected number of arguments
add.length;

// ## Functions form lexical closures
