//var template = require('./some-template.jade');
var vdom = require('ampersand-virtual-dom-mixin');
var View = require('ampersand-view');
var MySubview = View.extend(vdom, {
    template: "<div>WooHoo!</div>"
});

var MyView = View.extend(vdom, {
    template: '<div><h1>Hi!</h1><p>0</p><some-subview/>',
    components: {
        'some-subview': MySubview
    },
});

module.exports = MyView;
