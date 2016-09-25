(function() {

  // Mock REST API
  var api = {
    players: {
      // List ids of players
      get: function() {
        return Object.keys(players)
          .filter(function(k) { return k !== 'add'; });
      },

      // Create new player
      post: function(p) {
        players.add(player(p.name));
      }
    },

    player: {
      // Get specific player
      get: function(id) {
        return players[id];
      },

      // Update specific player
      put: function(id, name) {
        players[id].name = name;
      },

      // DELETE /player/{id}
      delete: function(id) {
        delete players[id];
      }
    },

    matches: {
      // List ids of matches
      get: function() {
        return Object.keys(matches)
          .filter(function(k) { return k !== 'add'; });
      },

      // Create new match
      post: function(m) {
        matches.add(match(m.player1, m.player2));
      }
    },

    match: {
      // Get specific match
      get: function(id) {
        return matches[id];
      },

      // Update specific match
      put: function(id, winner, loser, score1, score2) {
        matches[id].winner = winner;
        matches[id].loser = loser;
        matches[id].score1 = score1;
        matches[id].score2 = score2;
      },

      // DELETE /match/{id}
      delete: function(id) {
        delete matches[id];
      }
    }

  };

  function table() {
    var countId = 0;

    return {
      add: function(row) {
        var id = countId++;
        row.id = id;
        this[id] = row;
        return this;
      }
    };
  }

  function player(name) {
    return {
      name: name
    };
  }

  function match(player1, player2, score1, score2) {
    return {
      player1: player1,
      player2: player2,
      score1: score1,
      score2: score2
    };
  }

  function randomMatch() {
    var n = api.players.get().length;

    var w = Math.floor(Math.random() * n);
    var l = Math.floor(Math.random() * n);

    if (w === l)
      l = (l + 1) % n;

    return match(w, l, Math.floor(Math.random() * 5),
                 Math.floor(Math.random() * 5));
  }

  function repeat(n, f) {
    var ary = [];
    for (var i = 0; i < n; ++i) {
      ary.push(f());
    }
    return ary;
  }

  // Build the database
  var players = table();

  players
    .add(player('Axel'))
    .add(player('Béatrice'))
    .add(player('Caius'))
    .add(player('Delphine'))
    .add(player('Eugène'))
    .add(player('Flore'))
    .add(player('Gordon'))
    .add(player('Hippolyte'))
    .add(player('Ibraïm'))
    .add(player('Joge'))
    .add(player('Karim'))
    .add(player('Loïs'))
    .add(player('Matteo'))
    .add(player('Nellie'))
    .add(player('Octave'))
    .add(player('Pénélope'))
    .add(player('Quentin'))
    .add(player('Rima'))
    .add(player('Sénéchal'))
    .add(player('Tracy'))
    .add(player('Ulysse'))
    .add(player('Vanille'))
    .add(player('Willhem'))
    .add(player('Xiu'))
    .add(player('Yoko'))
    .add(player('Zoé'));

  var matches = table();

  repeat(5000, function() {
    matches.add(randomMatch());
  });

  // Exports
  this.api = api;

  var ex = api.matches.get().map(function(id) {
    var m = api.match.get(id);
    return {
      id: parseInt(id, 10),
      player1: m.player1,
      player2: m.player2,
      score1: m.score1,
      score2: m.score2,
    };
  });
  // console.log(JSON.stringify(ex, null, 2));

  // var ex = api.players.get().map(function(id) {
  //   return {
  //     id: id,
  //     name: api.player.get(id).name,
  //   }
  // });

  // console.log(JSON.stringify(ex, null, 2));

}());
