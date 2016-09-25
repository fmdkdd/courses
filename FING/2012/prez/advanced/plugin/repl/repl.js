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
			echo.textContent = eval(code.textContent);
		} catch (e) {
			echo.textContent = e;
		}
	}
}

document.addEventListener('keydown', function(event) {
	if (event.which == 119)
		evalCode(Reveal.getCurrentSlide());
});

// eval all code block with class 'preload'
document.addEventListener('DOMContentLoaded', function() {
	var nodes = document.querySelectorAll('code.preload');
	for (var i = 0; i < nodes.length; ++i) {
		evalCode(nodes[i].parentNode.parentNode);
	}
});
