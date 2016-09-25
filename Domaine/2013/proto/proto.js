document.addEventListener('DOMContentLoaded', start);

function start() {
	var slots = document.querySelectorAll('tbody td');

  for (var i=0; i < slots.length; ++i) {
    var slot = slots[i];
	  slot.addEventListener('click', clickSlot);

    // BONUS
	  slot.addEventListener('click', validate);
  }

  // Bonus: form validation
  // Enable submit button when the name field is not empty
  // and there's at least one selected time slot
  var submit = document.querySelector('input[type="submit"]');
  submit.addEventListener('click', validate);
}

function clickSlot(event) {
  var td = this;
  var box = this.children[0];

  if (event.target === td)
    box.checked = !box.checked;

  if (box.checked)
    td.classList.add('checked');
  else
    td.classList.remove('checked');

  checkedBoxesCount += box.checked ? 1 : -1;
}

var checkedBoxesCount = 0;

function validate() {
  var cboxes = document.querySelectorAll('tbody td input');
  if (checkedBoxesCount === 0) {
    for (var i = 0; i < cboxes.length ; ++i) {
	    cboxes[i].setCustomValidity('Please select one or more time slot');
    }
  } else {
    for (var i = 0; i < cboxes.length ; ++i) {
	    cboxes[i].setCustomValidity('');
    }
  }
}
