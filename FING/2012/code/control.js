//~~~~~~~~~~
// Control

var character = {
	name: 'Paul Atreides',
	nickname: "Muad'dib",
	birthplace: 'Caladan',
	motto: 'Fear is the mind killer',
}

// Classic 3-parts `for`
for (var i = 0; i < 18; ++i)
	;

character.age = i;

// `for in`
for (var property in character) {
	console.log(character[property]);
}

// switch matches expressions
switch (character.birthplace) {
case 'Caladan':
	console.log('House Atreides');
	break;

case 'Giedi Prime':
	console.log('House Harkonnen');
	break;

case 'Kaitain':
	console.log('House Corrino')

default:
	console.log('Arrakis');
}

// Classic `while`
while (character.title < 'Emperor') {
	harvestSpice();
	raiseArmy();
	harassHarkonnens();
}

// And `do while`
do {
	harvester.forward();
	harvester.scanForSandworms();
} while (!harvester.isFull());
