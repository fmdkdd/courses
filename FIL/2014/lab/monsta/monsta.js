var allMonstas = {
  Fushigidane: {
    hp: 3,
    power: 1,
    attacks: ['Tackle'],
  },

  Hitokage: {
    hp: 4,
    power: 2,
    attacks: ['Scratch', 'Growl'],
  },
};

var player = {
  inMatch: false,
  monsta: Object.create(allMonstas.Hitokage),

  walk: function() {
    if (this.inMatch)
      return this.tryToEscape();
    else {
      if (chance(0.5))
        return this.startMatch();
      else
        return 'You walk in the grass';
    }
  },

  attack: function() {
    return ['Which attack do you want to use?',
            this.monsta.attacks.join(', ')].join('\n');
  },

  startMatch: function() {
    this.inMatch = true;
    var monsta = choose(Object.keys(allMonstas));
    this.opponent = Object.create(allMonstas[monsta]);
    this.opponent.name = monsta;
    return ['A wild', monsta, 'appears!  Prepare to fight!'] .join(' ');
  },

  tryToEscape: function() {
    if (chance(0.3))
      return this.escape();
    else
      return 'You failed to escape';
  },

  escape: function() {
    this.inMatch = false;
    return 'You escaped from the fight!';
  },
};

function choose(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function chance(probability) {
  return Math.random() < probability;
}

// walk
// walk
// a wild pokemon appears !
// attack
