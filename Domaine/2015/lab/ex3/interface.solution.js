// Executes the 'onLoad' function after loading the page
$(onLoad)

function onLoad() {
  // On change in the #filter-friends input, compute the table again by
  // filtering rows
  $('#filter-friends').on('input', filterFriends)

  // On click on TH elements, sort the table by the column value.
  $('#sort-age').on('click', function() { sortByField('age') })
  $('#sort-name').on('click', function() { sortByField('name') })
}

function filterFriends() {
  var filter = this.value
  var $rows = $('#friends tbody tr')

  // Add the 'hide' class to all friends whose name do not contain the string
  // `filter`.  Use `stringContains` below.
  $rows
    .addClass('hide')
    .filter(function() {
      return stringContains($(this).data('name'), filter)
    }).removeClass('hide')

  // or...
  // $rows.each(function() {
  //   var r = $(this)
  //   if (stringContains(r.data('name'), filter))
  //     r.removeClass('hide')
  //   else
  //     r.addClass('hide')
  // })
}

// Return true iff STR contains R as a substring.  Ignores case.
function stringContains(str, r) {
  return str.toLowerCase().indexOf(r.toLowerCase()) > -1
}

function sortByField(field) {
  // Get the rows as an array
  var $rows = $('#friends tbody tr')

  // Sort the rows in place
  $rows.sort(compareField(field))

  // Put them back in the document
  $('#friends tbody').append($rows)
}

// Return a comparator for be used by Array.sort that compares two DOM elements
// based on the value of their attribute named `data-FIELD` using the less-than
// (`<`) operator.
function compareField(field) {
  // See http://devdocs.io/javascript/global_objects/array/sort for how to write
  // a comparator.
  return function(a, b) {
    var na = $(a).data(field)
    var nb = $(b).data(field)
    if (na < nb)
      return -1
    else if (na > nb)
      return 1
    else
      return 0
  }
}
