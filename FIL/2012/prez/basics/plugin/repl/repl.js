function evalCode(slide) {
  var code = slide.querySelector('code.eval');
  var echo = slide.querySelector('code.echo');

  Object.prototype.toString = function() {
    var self = this;
    return '{\n'
      + Object.keys(this)
      .map(function(key) {
	return '"' + key + '"' + ': ' + self[key]; })
      .join('\n')
      + '\n}';
  }

  Object.setPrototypeOf = function(obj, proto) {
    obj.__proto__ = proto;
  };

  if (code && echo) {
    try {
      var r = eval(code.textContent);
      if (r === undefined)
        echo.textContent = 'undefined';
      else if (r === null)
        echo.textContent = 'null';
      else
        echo.textContent = r;
    } catch (e) {
      echo.textContent = e;
    } finally {
      hljs.highlightBlock(echo);
    }
  }
}

document.addEventListener('keydown', function(event) {
  if (event.which == 119)		  // F8
    evalCode(Reveal.getCurrentSlide());

  // Hitting Page Up or Page Down when in a content editable box messes
  // up the layout.  Fix by disabling these keys.
  if (event.which == 33 || event.which == 34)
    event.preventDefault();
});

// eval all code block with class 'preload'
document.addEventListener('DOMContentLoaded', function() {
  var nodes = document.querySelectorAll('code.preload');
  for (var i = 0; i < nodes.length; ++i) {
    evalCode(nodes[i].parentNode.parentNode);
  }
});
