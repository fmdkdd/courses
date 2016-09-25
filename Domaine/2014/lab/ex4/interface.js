// Executes the 'onLoad' function after loading the page
document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
  // Build the table once
  updatePlayers(window.players);

  // TODO: Bind the 'input' event to the #filter-players input to call
  // the function `filterScores`.
}

// Create the DOM elements from the data
function updatePlayers(rows) {
  var f = document.createDocumentFragment();
  rows.forEach(function(r) {
    // TODO: Fill the fragment with a row of HTML data.
    // The `r` object has two keys: r.name and r.age
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
