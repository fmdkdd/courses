//~~~~~~~~~~~~~~~~~~~~
// Equality

// Straightfoward
0 == 0;
'String' == 'String';

// Type coercion!
0 == "0";

// Not transitive ...
0 == " ", 0 == "\n", " " != "\n";

// Zero is zero
+0 == -0;

// Distinguish with MATH POWER
1/+0 == +Infinity;
1/-0 == -Infinity;

// All this emptiness
null == undefined;
undefined === void Infinity;

// Only 1 is true
true == 1;
true != 2;

// But 2 is 'truthy'
2 ? true : false;

// Objects to primitive value
var obj = { valueOf: function() { return 2; }};
2 == obj;

// Strict equality

// No suprises
0 === 0;
0 !== "0";
0 !== " ";

// Like String.equals() in Java
'String' === 'String';

// Shallow equality for objects and arrays (by reference)
var obj1 = {};
var obj2 = {};
obj1 != obj2;

[1,2,3] != [1,2,3];


//~~~~~~~~~~~~~~~~~~~~
// Arithmetic operators
+ - * / %

// Boolan operators
&& || !

// Relational operators
> >= < <=

// Bitwise operators
>>	>>> << ~ | & ^;

// Assignment
= += -= *= /= /= %= <<= >>= >>>= &= ^= |=

//~~~~~~~~~~~~~~~~~~~~
// Numbers

// Decimal, octal, hexa
16 == 020 && 16 == 0x10;

// Floating point
1e6;

// Large range ...
Number.MAX_VALUE == 1.7976931348623157e+308;
Number.MIN_VALUE == 5e-324;

// but restricted precision
9007199254740992 + 1 == 9007199254740992;
