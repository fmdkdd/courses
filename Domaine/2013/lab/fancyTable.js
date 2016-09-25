// Exécute la fonction 'onLoad' lorsque la page est chargée
document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
  // Sélectionne toutes les cellules du tableau
	var slots = document.querySelectorAll(/* BLANK */);

  slots.forEach(function(slot) {
    // Ajoutez trois listener:
    // 1. 'mouseenter' -> highlightSelection
    // 2. 'mouseleave' -> unhighlightSelection
    // 3. 'click'      -> toggleSlot
    slot.addEventListener(/* BLANK */, /* BLANK */);
    /* BLANK */
    /* BLANK */
  });
}

// Retourne l'élément en début de ligne qui décrit le jour
function getDayElement(slot) {
	return slot./* BLANK */;  // indice: slide 25
}

// Retourne l'élément en haut de colonne qui décrit l'heure
function getHourElement(slot) {
	var hourIdx = slot.parentNode.children.indexOf(slot);
	return document.querySelector('thead tr').children[hourIdx];
}

// Ajoute la classe 'selected' au jour et à l'heure du créneau
// sélectionné (pour pouvoir appliquer un style CSS)
function highlightSelection() {
  var day = getDayElement(this);
  var hour = getHourElement(this);
  day.classList.add(/* BLANK */);
  hour.classList.add(/* BLANK */);
}

// Retire les classes 'selected' au jour et à l'heure du créneau
// sélectionné (pour pouvoir appliquer un style CSS)
function unhighlightSelection() {
  var day = getDayElement(this);
  var hour = getHourElement(this);
  /* BLANK */  // indice: opération inverse à celle du BLANK précédent
  /* BLANK */
}

function toggleSlot(event) {
  var td = this;                // la cellule du tableau concernée
  var box = td.children[0];     // la checkbox qu'elle contient

  // Si le clic est sur la cellule du tableau, alors on coche/décoche
  // la case
  if (event.target === td)
    box.checked = !box.checked;

  // Si la case est cochée, on ajoute la classe 'checked' à la cellule
  // (pour pouvoir appliquer un style CSS)
  if (box.checked)
    td.classList.add('checked');
  else
    td.classList.remove('checked');
}

// Quelques utilitaires ...
NodeList.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.indexOf = Array.prototype.indexOf;
