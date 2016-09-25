//~~~~~~~~~~~~~~~~~~~~
// Arrays

// Brackets
var array = [1,2,3,4];

// Arrays are heterogeneous
var mixed = [1,'2','trois',[4]];

// Access with brackets, zero-indexed
array[0] == 1;

// Not necessarily an integer
array['3'] == 4;

// Length attribute
array.length == 4;

// Array size is dynamic
array[12] = '21';
array;

// Arrays are objects!
array['nananana'] = 'batman';
array.nananana;

// `in` works
'nananana' in array;
0 in array;

// Array iteration (all properties)
for (var index in array)
	array[index] *= 2;

array;

// Array iteration (integer indices)
for (var i=0, l=array.length; i < l; ++i)
	array[i] = i;

array;

// `delete` is tricky
delete array[0];

array[0] == undefined;

// Array does not collapse
array.length == 4;
