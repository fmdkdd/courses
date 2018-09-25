// Execute the 'onLoad' function after the page has finished loading
$(onLoad)

function onLoad() {
  // 1. On change in the #filter-friends input, compute the table again by
  // filtering rows.

  // Use $().on(...) to register events

  // 2. On click on TH elements, sort the table by the column value.

  // Use $().on(...) to register events
}

function filterRows() {
  // 1. Get the value of the input `filter-friends`

  // Look for `value` or `val` in jQuery

  // 2. Hide all rows whose name do not contain the string `filter`.

  // Hint: use $().filter() to filter elements matching a predicate, and
  // $().hide() to hide elements from the page
}

function sortByField(field) {
  // 1. Sort the rows in place using `Array.sort` and the comparator
  // `compareField` below.

  // 2. Put them back in the table using $().append().
}

// Return a comparator to be used by Array.sort that compares two DOM elements
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
