// Executes the 'onLoad' function after loading the page
document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
  // Build the table once
  updatePlayers(window.players);

  // On change in the #filter-players input, compute the table again
  // by filtering rows
  document.querySelector('#filter-players')
    .addEventListener('input', filterScores);
}

// Create the DOM elements from the data
function updatePlayers(rows) {
  var f = document.createDocumentFragment();
  rows.forEach(function(r) {
    var tr = document.createElement('tr');
    var name = document.createElement('td');
    name.textContent = r.name;
    tr.appendChild(name);
    var age = document.createElement('td');
    age.textContent = r.age;
    tr.appendChild(age);
    f.appendChild(tr);
  });

  var node = document.querySelector('#players tbody');
  clearNode(node);
  node.appendChild(f);
}

function filterScores(event) {
  var playerFilter = event.target.value;
  var rows = window.players;

  // Filter rows when playerFilter is a non-empty string
  if (playerFilter.length > 0) {
    rows = rows.filter(function(r) {
      return r.name.toLowerCase().contains(playerFilter.toLowerCase());
    });
  }

  updatePlayers(rows);
}

// Shortcut function to empty a DOM node
function clearNode(n) {
  while (n.firstChild != null) {
    n.removeChild(n.firstChild);
  }
}
