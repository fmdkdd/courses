// Syntax is inherited from Java but without the types

var subject = 'FIL';

function greetSubject(greeting) {
   return greeting + ' ' + subject;
}

['Hello', 'Bonjour', 'こんにちは', '⠓⠑⠇⠇⠕', 'ଶୁଣିବେ']
   .map(greetSubject).join('\n');

// ## Strings
// Not chars, just strings
'hello';

// Double or simple quotes are your preference
"goodbye";

// Use double around when simple are inside
"i'm okay";

// Length of the string via the `length` property
"string".length;

// Characters can be read with brackets []
"012345"[2];

// Concatenation with the `+` operator
'012' + '345';

// Parsing numbers takes two arguments, a number and the base
parseInt('012', 10);

// ## Numbers
// Numbers are always doubles (64-bit IEEE 754)
1 / 2;

// Not suited for big-integer arithmetic
9007199254740992 + 1;

// Scientific, hexadecimal and octal notations
1e6;

0x10;

010;

// Infinities, and NaN
1 / 0;

-1 / 0;

0 / 0;

// ## Operators

// Classic arithmetic operators
1 * 2;

5 % 3;

// Boolean operators
true && false;

true || false;

// Relational operators
2 > 1;

2 <= 2;

// Two operators for equality
// `==` stands for equivalence
0 == 0;

// Implicit coercion
0 == '0';

// Equivalence is not transitive
0 == ' ';

0 == '\n';

' ' == '\n';

// `===` stands for strict equality, is transitive
0 === 0;

0 === '0';

// Prefer `===`

// ## Variables

// Declaration
var a;
a;

// Dynamic typing
a = 42;
a = '*';
a = function() {};

// Declaring without `var` keyword creates a global variable.
// Don't do that
