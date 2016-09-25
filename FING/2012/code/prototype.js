// New constructor

function square() {
	this.x *= this.x;
}

var Stuff = function() {
	this.x = 11;
	return this;
};

Stuff.prototype.square = square;

var s = new Stuff();

s.square();
console.log(s.x); 				  // 121

// Object.create
var stuffy = {
	x: 11,
	square: square,
};

stuffy.square();
console.log(stuffy.x);

var s2 = Object.create(stuffy);

s2.x = 111;
s2.square();
console.log(stuffy.x, s2.x);

s2.square = function() {
	this.x /= 2;
}

s2.square();
console.log(stuffy.x, s2.x);

// Mode switching
var A = function() {
};

A.prototype.quack = function() {
	console.log(this.adjective, 'quack');
};

var B = function () {
};

B.prototype.quack = function() {
	console.log(this.adjective, 'quock');
};

var duck = new A();

duck.adjective = 'loud';
duck.quack();

console.log(duck.prototype, duck.__proto__);

duck.__proto__ = B.prototype;

console.log(duck.prototype, duck.__proto__);

duck.quack();

// With Object.create
var A = {
	quack: function() {
		console.log(this.adjective, 'quack');
	},
};

var B = {
	quack: function() {
		console.log(this.adjective, 'quock');
	},
};

var duck = Object.create(A);

duck.adjective = 'tiny';
duck.quack();

console.log(duck.prototype, duck.__proto__);

duck.__proto__ = B;

console.log(duck.prototype, duck.__proto__);

duck.quack();

var dog = Object.create(duck);

dog.quack = function() {
	console.log(this.adjective, 'bark');
}

dog.quack();

duck.adjective = 'huge';

A.quack();
B.quack();
duck.quack();
dog.quack();

// Cyclic prototypes

var foo = Object.create(null);
foo.x = 42;

var bar = Object.create(null);
foo.y = 12;

foo.__proto__ = bar;

console.log(foo.x, foo.y, bar.x, bar.y);

bar.__proto__ = foo;

console.log(foo.x, foo.y, bar.x, bar.y);
