var Hapi = require('hapi');
var vm = require('vm');

var fs = require('fs');
var script = vm.createScript(fs.readFileSync('./app.vm'), 'app.vm');


var server = new Hapi.Server();

server.connection({ port: 8000 });

server.route({
    method: 'get',
    path: '/app',
    handler: function (request, reply) {
        var ctx = {
            require: require,
            console: console,
            done: function (html) {
                reply('<div id=app>' + html + '</div><script src="boot-app.js"></script>');
            }
        };

        try {
            script.runInNewContext(ctx);
        } catch (e) {
            console.log(e);
        }
    }
});

server.route({
    method: 'get',
    path: '/boot-app.js',
    handler: { file: './boot-app.bundle.js' }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
