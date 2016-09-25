NodeList.prototype.forEach = Array.prototype.forEach;

function highlight(element) {
  if (element.classList.contains('highlight')) {
	  unhighlight(element);
    // Trigger reflow to force animation to restart
    element.offsetWidth = element.offsetWidth;
  }
	element.classList.add('highlight');
}

function unhighlight(element) {
	element.classList.remove('highlight');
}

function unhighlightAll() {
	document.querySelectorAll('.highlight').forEach(unhighlight);
}

function highlightThenUnhighlight(element) {
	highlight(element);
  element.addEventListener('animationend', function() {
	  unhighlight(element);
  });
}

document.addEventListener('DOMContentLoaded', function() {

  var fakeDom = document.querySelector('#fakeDom');

  // Wrap jQuery that only works on the fakeDom
  function $(selector) {
	  return jQuery(selector, fakeDom);
  }

  var input = document.querySelector('#input');
  input.addEventListener('input', _.debounce(function() {
	  var result = eval(input.value);
    if (result)
      result.each(function(index, element) {
        unhighlightAll();
        highlight(element);
	      //highlightThenUnhighlight(element);
      });

    updateFakeDomSource();
  }, 500));

  var fakeDomSource = document.querySelector('#fakeDomSource');
  function updateFakeDomSource() {
    fakeDomSource.innerHTML = fakeDom.stringify();
  }

  // First update
  updateFakeDomSource();
});

// From ???

HTMLElement.prototype.stringify = function(options) {
	options = options || {};
	var defaults = {
		string: "string",
		attr: "attr",
		tag: "tag",
		markup: "markup",
		tab: "&nbsp;&nbsp;&nbsp;&nbsp;",
		gt: "&gt;",
		lt: "&lt;",
		end: "/",
		newline: "<br>"
	};

	for(var key in defaults) if(!options[key]) options[key] = defaults[key];

	var str = "", textElems = /\b(?:(?:h\d)|(?:li))\b/;

	(function recur(elements, level) {
		elements.forEach(function(elem) {
			var tagName = elem.tagName.toLowerCase(),
				isInline = ((elem.currentStyle || window.getComputedStyle(elem, "")).display == "inline"),
				highlight = !!elem.classList.contains("highlight");

			str += tag(elem, isInline ? 0 : level, highlight);
			if(!elem.children.length && (tagName.match(textElems) || isInline)) str += elem.textContent;

			if(elem.children.length) {
				recur(Array.prototype.slice.call(elem.children), level + 1);
				str += tag(elem, (tagName.match(textElems) || isInline) ? 0 : level, highlight, true, !level);
			} else {
				str += tag(elem, 0, highlight, true);
			}
		});
	})([this], 0);

	function tag(elem, tab, highlight, close, newline) {
		return (tab || newline ? options.newline : "") +
			(function() { str = ""; for(var i = 0; i < tab; i++) str += options.tab; return str; })() +
			"<span class='" + (highlight ? "highlight" : "") + "'>" +
			"<span class='" + options.markup + "''>" + options.lt +
			(close ? options.end : "") + "</span>" +
			"<span class='" + options.tag + "'>" + elem.tagName.toLowerCase() + "</span>" +
			(close ? "" : (function() {
        return Array.prototype.map.call(elem.attributes, function(attr) {
          if (attr.nodeName === "class") {
            if (attr.value === "highlight" || attr.value === "")
              return;
            if (attr.value.contains('highlight'))
              attr.value = attr.value.replace(/ ?highlight ?/, '');
          }

          return " <span class='" + options.attr + "'>" + attr.nodeName +
            "=</span><span class='" + options.string + "'>\"" + attr.value + "\"</span>"})
          .join(""); })()) +
			"<span class='" + options.markup + "'>" + options.gt + "</span>" +
			"</span>";
	}

	return str
};

// From underscore

_ = {};

_.debounce = function(func, wait, immediate) {
  var result;
  var timeout = null;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
};
