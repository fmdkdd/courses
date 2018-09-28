// Execute the 'onLoad' function after the page has finished loading
$(onLoad)

function onLoad() {
  // On change in the #filter-friends input, compute the table again by
  // filtering rows

  $('#filter-friends').on('input', filterRows)

  // On click on TH elements, sort the table by the column value.

  $('#sort-name').on('click', () => sortByField('name'))
  $('#sort-age').on('click', () => sortByField('age'))
}

function filterRows() {
  var filter = this.value.toLowerCase()

  // Hide all rows whose name do not contain the string
  // `filter`.

  $('#friends tbody tr')
    .show()                     // first show all rows to clear the previous
                                // filtering (if any)
    .filter(function() {
      // Convert to lowercase first to do a case-insensitive match
      return !$(this).data('name').toLowerCase().includes(filter)
    })
    .hide()
}

function sortByField(field) {
  // Get the rows as an array

  var $rows = $('#friends tbody tr')

  // Sort the rows in place using `Array.sort` and the comparator below.
  // Put them back in the document using `append`.

  $('#friends tbody').append($rows.sort(compareField(field)))
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
