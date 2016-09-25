/* To make this example work with Django:
 * 1. Move 'index.html' to 'myapp/templates/'
 * 2. Modify the `index` view to render the 'index.html' template
 * 3. Move 'style.css' and 'interface.js' to 'myapp/static/'
 * 4. Modify the template to use static template tags for paths
 */

// Executes the 'onLoad' function after loading the page
document.addEventListener('DOMContentLoaded', onLoad);

function getPlayerData(fn) {
  ajax("/myapp/api/players", fn, function(msg) {
    console.error('AJAX request failed:', msg);
  });
}

function onLoad() {
  // Build the table once
  getPlayerData(updatePlayers);

  // On change in the #filter-players input, compute the table again
  // by filtering rows
  document.querySelector('#filter-players')
    .addEventListener('input', filterScores);
}

// Create DOM elements from the data
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

  getPlayerData(function(rows) {
    // Filter rows when playerFilter is a non-empty string
    if (playerFilter.length > 0) {
      rows = rows.filter(function(r) {
        return r.name.toLowerCase().contains(playerFilter.toLowerCase());
      });
    }

    updatePlayers(rows);
  });
}

// Shortcut function to empty a DOM node
function clearNode(n) {
  while (n.firstChild != null) {
    n.removeChild(n.firstChild);
  }
}

function ajax(url, success, error) {
  var req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === 200)
      success(this.response);
    else
      error(this.statusText);
  };
  req.onerror = function() {
    error('Network error');
  }
  req.open("GET", url, true);
  req.responseType = "json";
  req.send();
}
