var vdom = require('ampersand-virtual-dom-mixin');
var View = require('ampersand-view');
var MySubview = View.extend(vdom, {
    template: function (v) {
        return "<div>WooHoo! <input type='text'/> " + v.someInt + " </div>";
    },
    props: {
        someInt: 'number'
    },
    initialize: function () {
        this.renderOnViewChange();
    }
});

var MyView = View.extend(vdom, {
    components: {
        'some-subview': MySubview
    },
    template: function (v) {
        return '<div><h1>Hi!<input type="text"/></h1><p>' + v.i + '</p><some-subview key="foo" someInt="' + v.i + '"/></div>';
    },
    props: {
        i: ['number', true, 10]
    },
    initialize: function () {
        this.on('change:i', this.render.bind(this));
        setTimeout(function () {
            var i = setInterval(function () {
                console.log('i');
                this.i++;
            }.bind(this), 1000);
        }.bind(this), 2000);
    }
});

module.exports = MyView;
