;(function() {
    'use strict';

    var express = require('express');
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var port = 5000;

    // This will obviously need to be refined...
    var cipher = {
        'a': '!',
        'A': 's',
        'b': 'z',
        'c': 'K',
        'd': '0'
    };

    var translate = function translate(input) {
        var len = input.length;
        var output = [];
        for (var i = 0; i < len; i++) {
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
        io.emit('chat message', 'User connected');
        socket.on('chat message', function(msg) {
            io.emit('chat message', translate(msg));
        });
        socket.on('disconnect', function() {
            io.emit('chat message', 'User disconnected');
        });

    });
    http.listen(port, function() {
        console.log('Listening on port', port);
    });

})();