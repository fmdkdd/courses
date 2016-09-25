#!/usr/local/bin/node

// Outputs AST from students files

var esprima = require('esprima');
var fs = require('fs');

var filename = process.argv[2];
var file = fs.readFileSync(filename, {encoding: 'utf8'});

var ast = esprima.parse(file);

// Filter top-level expressions other than function declarations
ast.body = ast.body.filter(function(node) {
  return node.type === 'FunctionDeclaration';
});

process.stdout.write(JSON.stringify(ast, null, 2));
