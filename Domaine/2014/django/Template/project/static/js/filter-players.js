// Executes the 'onLoad' function after loading the page
document.addEventListener('DOMContentLoaded', onLoad);

function getPlayerData(fn) {
  $.ajax("/project/api/players")
    .done(fn)
    .fail(function(msg) {
      console.error('AJAX request failed:', msg);
    });
}

function getPlayerHTML(filter, fn) {
  $.ajax("/project/api2/players?filter=" + filter.replace(/&/, '%25'))
    .done(fn)
    .fail(function(msg) {
      console.error('AJAX request failed:', msg);
    });
}

function onLoad() {
  // Built the table once
  getPlayerData(updatePlayers);

  // On change in the #filter-players input, compute the table again
  // by filtering rows
  $('#with-js .filter-players').on('input', filterPlayers);

  $('#with-django-ajax .filter-players')
    .on('input', function(event) {
      var filter = event.target.value;

      getPlayerHTML(filter, function(tbody) {
        $('#with-django-ajax tbody')
          .html(tbody);
      });
    });
}

// Create DOM elements from the data
function updatePlayers(rows) {
  var f = document.createDocumentFragment();
  rows.forEach(function(r) {
    var tr = document.createElement('tr');

    $('<td>')
      .text(r.name)
      .appendTo(tr);

    $('<td>')
      .text(r.age)
      .appendTo(tr);

    var link = $('<a>')
      .text('Matches ')
      .attr('href', '/project/player_details/' + r.name + '/');

    var span = $('<span>')
      .addClass('badge')
      .text(r.matchesCount)
      .appendTo(link);

    $('<td>')
      .append(link)
      .appendTo(tr);

    f.appendChild(tr);
  });

  $('#with-js tbody')
    .empty()
    .append(f);
}

function filterPlayers(event) {
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

// Polyfill for String.contains
if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}
