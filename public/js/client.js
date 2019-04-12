// here we listen to the server responses

var socket = io.connect('http://localhost:8080');

var USE_DB = false;

socket.on('magazines', function(message) {
    console.log('=> server - on magazines: ' + message);
})