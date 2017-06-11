
var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(3033);
var io = socket(server);
app.use(express.static('public'));
console.log("Tron node server running");

io.sockets.on('connection', newConnection);

var sessionWindowSizes = new Map();
var setWindow;

function newConnection(socket){
  // console.log("socket: ",socket);
  console.log("a user connected: ", socket.id);

  socket.on('mouse', mouseMsg);
  function mouseMsg(data) {
    console.log(data);
    socket.broadcast.emit('mouse', data); //send to all other clients (not original sender)
    //io.sockets.emit('mouse', data); //send to all clients
  }

  socket.on('getCanvasSize', setCanvasSizeOfClients);
  function setCanvasSizeOfClients(currentWindow){
    console.log("window size of ", socket.id, " is ",currentWindow);
    sessionWindowSizes.set(socket.id, currentWindow);
    setWindow = {
      width: null,
      height: null
    }
    sessionWindowSizes.forEach(function(currentWindow){
      console.log("currentWindow in loop: ", currentWindow);
      if(setWindow.width == null ||
         setWindow.width > currentWindow.width) setWindow.width = currentWindow.width;
      if(setWindow.height == null ||
         setWindow.height > currentWindow.height) setWindow.height = currentWindow.height;
    });
    console.log("result: ", setWindow);
    io.sockets.emit('getCanvasSize', setWindow);
  }//end setCanvasSizeOfClients

  socket.on('gameState', sendNewGameState);
  function sendNewGameState(gameState){
    socket.broadcast.emit('gameState', gameState);
  }

  socket.on('disconnecting', clientDisconnected);
  function clientDisconnected(){
    console.log("client disconnected: ", socket.id);
    sessionWindowSizes.delete(socket.id);
  }


}//new connection "per socket"
