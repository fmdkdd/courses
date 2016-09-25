/* global console */

// Toy implementation of a Document Object Model

// HTMLO is a simple HTML defined by the following grammar:
//
// document := node
//
// node := open_tag content* close_tag
//
// content := node* | text
//
// open_tag := '<' tag_name attribute* '>'
//
// close_tag := '<' '/' tag_name '>'
//
// attribute := key '=' '"' value '"'
//
// Terminals:
//
// tag_name := \w+
// key := \w+
// value = .*
// text := [^<>]*

(function() {

var DOMOElementProto = {
  get id() {
    return this.attributes.id;
  },

  get classList() {
    return {
      add: function(klass) {
        if (this.attributes.class == null)
          this.attributes.class = '';

        this.attributes.class += ' ' + klass;
      }.bind(this),

      remove: function(klass) {
        if (this.attributes.class != null)
          this.attributes.class.replace(klass, '');
      }.bind(this),

      contains: function(klass) {
        if (this.attributes.class == null)
          return false;

        return this.attributes.class.indexOf(klass) !== -1;
      }.bind(this),

      toggle: function(klass) {
        if (this.classList.contains(klass))
          this.classList.remove(klass);
        else
          this.classList.add(klass);
      }.bind(this),
    };
  },

  toString: function() {
    var content = this.childNodes
      .map(function(n) { return n.toString(); })
      .join('\n');

    return '<' + this.tagName + '>'
      + content
      + '</' + this.tagName + '>';
  },
};

function DOMOElement(name, parent) {
  if (name != null)
    name = name.toUpperCase();

  return {
    __proto__: DOMOElementProto,
    parentNode: parent,
    childNodes: [],
    tagName: name,
    attributes: {},
  };
}

var DOMOTextNodeProto = {
  __proto__: DOMOElementProto,
  toString: function() {
    return this.text;
  },
};

function DOMOTextNode(text, parent) {
  return {
    __proto__: DOMOTextNodeProto,
    parent: parent,
    text: text,
  };
}

function parseHtmlo(htmlo, success, error) {
  var document = DOMOElement(undefined, null);

 try {
    parseNode(htmlo, [document]);
  } catch (ex) {
    error(ex);
    return false;
  }

  return success(document);
}

function parseNode(htmlo, stack) {
  htmlo = parseOpenTag(htmlo, stack);
  htmlo = parseContent(htmlo, stack);
  htmlo = parseCloseTag(htmlo, stack);
  return htmlo;
}

function parseContent(htmlo, stack) {
  var tag = stack[stack.length - 1];
  var closeTag = '</' + tag.tagName + '>';
  var closeTagSomewhere = new RegExp(closeTag, 'i');
  var closeTagNow = new RegExp('^' + closeTag, 'i');

  if (closeTagSomewhere.test(htmlo) === false)
    throw 'Parse error: unclosed tag `' + tag.tagName +'`';

  while (closeTagNow.test(htmlo) === false) {
    var next = htmlo.search(/</);
    if (next === 0)
      htmlo = parseNode(htmlo, stack);
    else if (next > 0) {
      var textNode = DOMOTextNode(htmlo.slice(0, next), tag);
      tag.childNodes.push(textNode);
      htmlo = htmlo.slice(next);
    }
  }

  return htmlo;
}

function parseOpenTag(htmlo, stack) {
  var parent = stack[stack.length - 1];

  var m = /^<([^<>]+)>/.exec(htmlo);

  if (m == null)
    throw 'Parse error: expected an opening tag at "'
      + htmlo.slice(0, 15)
      + '..."';

  htmlo = htmlo.slice(m[0].length);
  var groups = m[1].split(' ');

  var tagName = groups.shift();
  if (/^\w+$/.test(tagName) === false)
    throw 'Parse error: invalid tag name "'
    + tagName
    + '"';

  var attrs = {};
  var attrRe = /^(\w+)=".*"$/;
  groups.forEach(function(t) {
    if (attrRe.test(t) === false)
      throw 'Parse error: malformed attribute "'
      + t
      + '..."';

    var a = t.split('=');
    attrs[a[0]] = a[1].slice(1,-1);
  });

  var tag = DOMOElement(tagName, parent);
  tag.attributes = attrs;

  parent.childNodes.push(tag);

  stack.push(tag);

  return htmlo;
}

function parseCloseTag(htmlo, stack) {
  var tag = stack[stack.length - 1];
  var closeTag = '</' + tag.tagName + '>';
  var re = new RegExp('^' + closeTag, 'i');

  if (re.test(htmlo) === true) {
    stack.pop();
    return htmlo.slice(closeTag.length);
  }
  else
    throw 'Parse error: expected a closing tag `'
    + closeTag
    + '` at "'
    + htmlo.slice(0, 15)
    + '..."';
}

this.parseHtmlo = parseHtmlo;

}());
