var React = require('react');

var MySubclass = React.createClass({

});

var MyClass = React.createClass({
    render: function () {
        return React.createElement('div', {}, [ React.createElement('p', {}, ["hello"]) ]);
    }
});

console.log(React.renderToString(React.createElement(MyClass, null)));
