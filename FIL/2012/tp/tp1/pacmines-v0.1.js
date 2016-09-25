// ## Préliminaires
//
// À partir de ce TP, il sera plus commode d'éditer le fichier
// `pacmines-v0.1.js` dans un éditeur de texte, de le sauvegarder, et
// de recharger la page `index.html` dans le navigateur.
//
// Si le script comporte une erreur, elle s'affichera dans la console
// du navigateur (`Ctrl+Maj+j` dans Chrome).

// ## Pacmines
//
// L'objectif de ce TP est de dessiner le niveau de Pacmines.  Un
// niveau de Pacmines est une grille.
//
// Une case de cette grille a des propriétés individuelles; on
// représentera donc une case par un objet.
//
// Il y a 3 types de cases dans Pacmines :
//
// 1. Le sol.
// 2. Les murs.
// 3. Les pilules.
//
// Les cases « sol » sont vides, et Pacmines pourra s'y déplacer.  Les
// cases « murs » sont pleines : on ne peut pas les traverser.  Les
// cases « pilules » contiennent des ... pilules ... qui sont dévorées
// par Pacmines pour tenter de satisfaire sa faim insatiable, et
// augmenter son score.

// ## Objectifs
//
// Vous devez écrire les deux fonctions vides du fichier
// `pacmines-v0.1.js`.  Ces fonctions seront ensuites appelées par le
// code du fichier `pacmines-core.js` qui se chargera du dessin et de
// la liaison avec le navigateur.  Si tout est correct, vous devez
// voir un niveau de Pacmines inerte en chargeant le fichier
// `index.html`.

// ### Écrire la fonction `initLevel`
//
// Cette fonction prend en entrée la carte en version ASCII située
// dans la page HTML et rend un objet.  Par exemple :
//
//     ####
//     #..#
//     ####
//
// Chaque caractère représente le type de la case.  La légende est la
// suivante :
//
//     ' ' // sol
//     '#' // mur
//     '.' // pilule
//
// La carte en entrée est un tableau de tableaux qui eux-mêmes
// contiennent des caractères.  Le tableau correspondant à la carte
// précédente est donc :
//
//     [['#', '#', '#', '#'], ['#','.','.','#'], ['#', '#', '#', '#']]
//
// On suppose que les tableaux internes ont tous la même longueur.
//
// L'objet retourné a la structure suivante :
//
//     {
//        height: // nombre de tableaux internes de la carte
//        width:  // longueur de chaque tableau interne (supposée fixe)
//        tiles:  // tableau à une dimension de cases (qui sont
//                // elles-mêmes des objets)
//     }
//
// Pour créer chaque case, faites appel à la fonction
// `createTileFromMap`, définie par la suite.
//
// La fonction `initLevel` se charge aussi d'ajouter les coordonnées
// `x` et `y` à l'objet case retourné par `createTileFromMap`.  Par
// exemple, la seconde pilule de la carte ASCII montrée au dessus a
// comme coordonnées (2,1).
function initLevel(map) {

}

// ### Écrire la fonction `createTileFromMap`
//
// La fonction `createTileFromMap` prend un caractère en entrée et
// renvoie un objet représentant une case.  Une case a les propriétés
// suivantes :
//
// * Une couleur `color` qui est une couleur valide en
//   [CSS](https://developer.mozilla.org/en-US/docs/CSS/color_value);
//   donc une chaîne de caractères décrivant une couleur valide ou une
//   valeur hexadécimale.
// * Une fonction de dessin `draw` qui a pour valeur
//   `Pacmines.painters.tile` (dessine un carré).
// * Une hauteur `height` et largeur `width` de dessin pour
//   `Pacmines.painters.tile`.  Les murs sont infranchissables,
//   donc à dessiner avec une taille égale à leur largeur (variable
//   globale `tileHeight`).  En revanche, les pilules sont
//   certainement plus petites que les murs ...
function createTileFromMap(mapChar) {

}
