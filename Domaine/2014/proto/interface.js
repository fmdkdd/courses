/* eslint-env browser */
/* global d3 */

document.addEventListener('DOMContentLoaded', init);

function init() {
  refreshScores();
  refreshMatches();

  document.getElementById('filter-scores')
    .addEventListener('input', function(event) {
      refreshScores(this.value);
    });

  document.getElementById('search-match')
    .addEventListener('click', function(event) {
      event.preventDefault();
      refreshResults();
    });
}

function refreshResults() {
  var player1 = document.getElementById('player1').value;
  var player2 = document.getElementById('player2').value;

  if (player1.length === 0 || player2.length === 0)
    return;

  var rows = api.matches.get()
    .map(function(id) {
      var m = api.match.get(id);
      return {
        player1: api.player.get(m.player1).name,
        player2: api.player.get(m.player2).name,
        score1: m.score1,
        score2: m.score2,
      };
    })
    .filter(function(m) {
      var p1 = m.player1.toLowerCase();
      var p2 = m.player2.toLowerCase();
      var left = player1.toLowerCase();
      var right = player2.toLowerCase();

      return (p1.indexOf(left) > -1 && p2.indexOf(right) > -1)
          || (p1.indexOf(right) > -1 && p2.indexOf(left) > -1);
    });

  var frag = document.createDocumentFragment();
  rows.forEach(function(m) {
    var r = tableRow(m.player1, m.score1, '—', m.score2, m.player2);
    frag.appendChild(r);
  });

  var tbody = document.querySelector('#results tbody');
  clearNode(tbody);
  tbody.appendChild(frag);
}

function refreshMatches() {
  var matrix = computeMatchesMatrix();
  var frag = document.createDocumentFragment();

  var quantize = d3.scale.quantize()
    .domain([d3.min(matrix, function(r) { return d3.min(r);}),
             d3.max(matrix, function(r) { return d3.max(r);})])
    .range(d3.range(9).map(function(i) { return "q" + i; }));

  var chart = d3.select('#all-matches');

  chart.append('thead')
    .append('tr')
    .selectAll('td')
      .data(api.players.get())
    .enter().append('td')
    .text(function(d) { return api.player.get(d).name; });

  chart.select('thead tr')
    .insert('td', ':first-child');

  chart.append('tbody')
    .selectAll('tr')
    .data(matrix)
    .enter().append('tr')
    .each(makeRow);

  function makeRow(row, y) {
    d3.select(this)
      .selectAll('td')
        .data(row)
      .enter().append('td')
        .attr('data-x', function(d,x) { return x; })
        .attr('data-y', function() { return y; })
        .attr('class', function(d) { return 'square ' + quantize(d); })
        .on('mouseenter', highlightLabels)
        .append('span')
          .attr('class', 'delta-score')
          .text(function(d) { return d; });

    d3.select(this)
    .insert('td', ':first-child')
      .text(api.player.get(y).name[0] + '.');
  }

  document.querySelector('#all-matches tbody')
    .addEventListener('mouseleave', unhighlightLabels);

  function highlightLabels() {
    var target = this;
    chart.selectAll('.square')
      .classed('inactive', function() {
        return this.getAttribute('data-y') !== target.getAttribute('data-y')
          && this.getAttribute('data-x') !== target.getAttribute('data-x')
      });
  }

  function unhighlightLabels() {
    chart.selectAll('.inactive').classed('inactive', false);
  }
}

function computeMatchesMatrix() {
  var matrix = [];

  // Fill matrix with zeroes
  var l = api.players.get().length;
  for (var i = 0; i < l; ++i) {
    matrix[i] = [];
    for (var j = 0; j < l; ++j) {
      matrix[i][j] = 0;
    }
  }

  api.matches.get().forEach(function(id) {
    var m = api.match.get(id);
    if (m.score1 > m.score2) {
      matrix[m.player1][m.player2] += 1;
      matrix[m.player2][m.player1] -= 1;
    } else {
      matrix[m.player1][m.player2] -= 1;
      matrix[m.player2][m.player1] += 1;
    }
  });

  return matrix;
}

function refreshScores(player) {
  var rows = api.players.get()
    .map(function(id) {
      return {
        name: api.player.get(id).name,
        wins: 0,
        defeats: 0,
        draws: 0,
        points: 0
      };
    });

  api.matches.get().forEach(function(id) {
    var m = api.match.get(id);
    if (m.score1 > m.score2) {
      rows[m.player1].wins += 1;
      rows[m.player2].defeats += 1;
    }

    else if (m.score2 > m.score1) {
      rows[m.player2].wins += 1;
      rows[m.player1].defeats += 1;
    }

    else {
      rows[m.player1].draws += 1;
      rows[m.player2].draws += 1;
    }
  });

  if (typeof player === 'string' && player.length > 0) {
    rows = rows.filter(function(r) {
      return r.name.toLowerCase().indexOf(player.toLowerCase()) > -1;
    });
  }

  rows.forEach(function(r, id) {
    rows[id].points = rows[id].wins * 3 + rows[id].draws;
  });

  rows.sort(function(a, b) {
    return b.points - a.points;
  });

  var frag = document.createDocumentFragment();
  rows.forEach(function(p) {
    var r = tableRow(p.name, p.wins, p.draws, p.defeats, p.points);
    frag.appendChild(r);
  });

  var tbody = document.querySelector('#scores tbody');
  clearNode(tbody);
  tbody.appendChild(frag);
}

function tableRow(/* args */) {
  var tr = document.createElement('tr');

  for (var i=0; i < arguments.length; ++i) {
    var td = document.createElement('td');
    td.textContent = arguments[i];
    tr.appendChild(td);
  }

  return tr;
}

function clearNode(n) {
  while (n.firstChild)
    n.removeChild(n.firstChild);
}
