//~~~~~~~~~~~~~~~~~~~~
// Objects

// Pseudo map of properties
// { name1: value1, name2: value2, ... }
var obj = {
	answer: 42,
	':': function(x) {
		return x*x;
	},
};

// Dot notation
obj.answer == 42;

// Bracketed access
obj[':'](2);

// Can delete properties
delete obj.answer;

obj.answer == undefined;
