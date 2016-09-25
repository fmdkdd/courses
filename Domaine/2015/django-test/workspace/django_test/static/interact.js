$(init)

function init() {
  $('[name=filter-friends]').on('input', refreshFriendlist)
}

function refreshFriendlist() {
  var $input = $(this)
  var $ul = $input.parent().find('.users')
  $.get('/friends/' + $input.val(), function(users) {
    $ul.html(users)
  })
}
