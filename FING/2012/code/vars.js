//~~~~~~~~~~~~~~~~~~~~
// Variables

// Vars start undefined
var a;

a == undefined;

// Dynamic type -- can contain anything
a = 42;
a = '*';
a = function () {};

// No `var` keyword -> global variable
global = 2;

// Can declare global in function scope
function fun() {
	// __DO NOT DO THIS__
	for (i = 0; i < 2; ++i)
		;
}

fun();

i == 2;

// Always use var to declare a variable
function fun() {
	for (var j = 0; j < 2; ++j)
		;
}

fun();

j; // ReferenceError: j is not defined


//~~~~~~~~~~~~~~~~~~~~
// Constants

const zero = 0;
zero = 2;
zero == 0;


//~~~~~~~~~~~~~~~~~~~~
// Scope

// Scope 1: global scope
var t = 1;

// Scope 2: function scope
function fun() {
	console.log('t ==', t);
	var t = 2;
	console.log('t ==', t);
}

console.log('t ==', t);
fun();
console.log('t ==', t);

// That's it.  No block scope
{
	var t = 3;
	console.log('t ==', t);
}
console.log('t ==', t);

for (var t = 12; false;)
	;
console.log('t ==', t);
