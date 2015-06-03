;(function() {
    'use strict';

    var express = require('express');
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var port = 5000;

    var cipher = {
        'a' : '!',
        'b' : 'z',
        'c' : 'K',
        'd' : '0'
    };

    var translate = function translate(input) {
        var len = input.length;
        var output = [];
        for (var i=0; i < len; i++) {
            if (input[i] in cipher) {
                output.push(cipher[input[i]]);
            } else {
            output.push(input[i]);
            }
        }
        return output.join('');
    };

    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html');
    });

    app.use('/static', express.static(__dirname + '/static'));

    io.on('connection', function(socket) {
        socket.on('chat message', function (msg) {
            io.emit('chat message', translate(msg));
        });
    });

    http.listen(port, function() {
        console.log('Listening on port', port);
    });

})();