document = require('min-document');
var MyView = require('./app');
var view = new MyView();
view.render();
var toString = require('virtual-dom-stringify');
console.log(toString(view.tree, null, { invalidAttributes: true }));
