var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var heptihex = require('./heptihex')(io);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


