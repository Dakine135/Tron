
var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(3000);
var io = socket(server);
app.use(express.static('public'));
console.log("Tron node server running");

io.sockets.on('connection', newConnection);

function newConnection(socket){
  // console.log("socket: ",socket);
  console.log("a user connected: ", socket.id);
  socket.on('mouse', mouseMsg);
  function mouseMsg(data) {
    console.log(data);
    socket.broadcast.emit('mouse', data); //send to all other clients (not original sender)
    //io.sockets.emit('mouse', data); //send to all clients
  }

}
