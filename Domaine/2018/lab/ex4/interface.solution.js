$(onload)

function onload() {
  $('#fetch') .on('click', fetchFriends)
}

function fetchFriends() {
  $.getJSON('friends.json', buildTable)
}

function buildTable(friends) {
  const table = $('#friends tbody')

  friends.forEach(f => {
    table.append($(`<tr><td>${f.name}</td><td>${f.age}</td></tr>`))
  })
}
