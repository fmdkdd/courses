/* global console */

(function(){
  document.addEventListener('DOMContentLoaded', runTests);

  function runTests() {
    var body = document.querySelector('body');
    var htmlo = '<body>' + body.innerHTML.trim() + '</body>';
    var domo = window.parseHtmlo(htmlo);
    console.dir(window.queryo(body, '.c1'));
    console.log(window.queryoAll(domo, 'p'));
  }
}());
