var View = require('ampersand-view');
var vdom = require('ampersand-virtual-dom-mixin');
var virtualize = require('./virtualize');
var MySubview = View.extend(vdom, {
    template: function (v) {
        return "<div>WooHoo! <input type=text/> " + v.someInt + " </div>";
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
        return '<div><h1>Hi!</h1><p>' + v.i + '</p><some-subview key="foo" someInt="' + v.i + '"/></div>';
    },
    props: {
        i: ['number', true, 10]
    },
    initialize: function () {
        this.on('change:i', this.render.bind(this));
        setTimeout(function () {
            var i = setInterval(function () {
                this.i++;
            }.bind(this), 1000);
        }.bind(this), 1000);
    }
});



function rehydrate(view, el) {
    view.el = el;
    view.tree = virtualize(el, null, {
        hydrateWidget: function (el, props) {
            console.log('Hydrate', el);
            var key = props.dataset.vdomKey;
            var widgetTag = props.dataset.vdomWidget;
            var Constructor = view.components[widgetTag];
            if (!Constructor) return;

            var subView = new Constructor();
            subView.el = el;
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

attachView(new MyView(), document.querySelector('#app'));
//var view = new MyView();
//view.render();
//document.body.appendChild(view.el);
