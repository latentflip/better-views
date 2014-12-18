var View = require('ampersand-view');
var vdom = require('ampersand-virtual-dom-mixin');
var virtualize = require('./virtualize');
var App = require('./app');
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
        var i = setInterval(function () {
            this.i++;
        }.bind(this), 1000);
    }
});



function rehydrate(view, el) {
    view.el = el;
    view.tree = virtualize(el, null, {
        isWidget: function (props) {
            return props.dataset.vdomWidget && view.components[props.dataset.vdomWidget];
        },
        hydrateWidget: function (el, tree, props) {
            var key = props.dataset.vdomKey;
            var widgetTag = props.dataset.vdomWidget;
            var Constructor = view.components[widgetTag];

            var args = {};
            Object.keys(props.dataset).forEach(function (a) {
                args[a] = coerce(props.dataset[a]);
            });

            var subView = new Constructor(args);
            subView.tree = tree;
            subView.set({ el: el }, { silent: true });
            subView.render();

            return {
                type: 'Widget',
                name: 'MyWidget',
                id: key,
                key: key,
                view: subView,
                init: function () {
                    return this.view.el;
                },
                update: function (previous, dom) {
                    throw '?';
                },
                destroy: function () {
                    this.view.remove();
                }
            };
        }
    });
    return view;
}

function attachView(view, el) {
    window.initEl = el;
    view = rehydrate(view, el);
    view.render();
}

attachView(new App(), document.querySelector('#app'));


function coerce(str) {
    var trimmed = str.trim();
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (!isNaN(trimmed)) return parseFloat(trimmed);
    return str;
}
