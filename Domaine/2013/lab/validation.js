// Exécute la fonction 'onLoad' lorsque la page est chargée
document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
  // Sélectionne toutes les cellules du tableau
	var slots = document.querySelectorAll(/* BLANK */);

  slots.forEach(function(slot) {
    // Un seul listener pour chaque cellule:
    // 'click' -> checkBoxCount
    /* BLANK */
  });

  // Pour s'assurer que le nom de l'événement n'est pas vide, on
  // lui ajoute l'attribut 'required' qui vaut `true`
  var eventName = document.querySelector('input[name="event-name"]');
  /* BLANK */ // indice: slide 26

  // On veut vérifier qu'au moins un créneau est coché avant l'envoi
  // du formulaire.  On appelle countCheckedBoxes quand on clic sur le
  // bouton d'envoi.
  var submitButton = document.querySelector(/* BLANK */);
  /* BLANK */
}

// Invalide la checkbox
function pleaseTickBox(box) {
	box.setCustomValidity('Please select one or more time slot');
}

// Valide la checkbox
function validateBox(box) {
	box.setCustomValidity('');
}

// Retourne vrai si au moins une checkbox est cochée
function checkBoxValidation() {
  // Sélectionne toutes les checkbox
  var cboxes = document.querySelectorAll(/* BLANK */);
  return cboxes.some(function(box) { return box.checked; });
}

// Valide/invalide toutes les checkbox d'un coup
function countCheckedBoxes() {
  // Sélectionne toutes les checkbox
  var cboxes = document.querySelectorAll(/* BLANK */);

  if (checkBoxValidation()) {
    cboxes.forEach(validateBox);
  } else {
    cboxes.forEach(pleaseTickBox);
  }
}

// Utilitaires
NodeList.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.some = Array.prototype.some;
