var express = require('express');
var socket = require('socket.io');
var GameState = require('./public/GameState');
var MAZE = require('./Maze');

var app = express();
var server = app.listen(3033);
var io = socket(server);
var GAMEGRIDSCALE = 60;
app.use(express.static('public'));
console.log("Tron node server running");

io.sockets.on('connection', newConnection);

var sessionWindowSizes = new Map();
var setWindow;

function newConnection(socket){
  // console.log("socket: ",socket);
  console.log("a user connected: ", socket.id);




  socket.on('getCanvasSize', setCanvasSizeOfClients);
  socket.on('addSnake', sendNewSnake);
  socket.on('snakeDir', sendSnakeDir);
  socket.on('guiState', sendNewGuiState);
  socket.on('disconnecting', clientDisconnected);
  //
  //
  function setCanvasSizeOfClients(currentWindow){
    console.log("window size of ", socket.id, " is ",currentWindow);
    sessionWindowSizes.set(socket.id, currentWindow);
    setWindow = {
      width: null,
      height: null
    };
    sessionWindowSizes.forEach(function(currentWindow){
      console.log("currentWindow in loop: ", currentWindow);
      if(setWindow.width == null ||
         setWindow.width > currentWindow.width) setWindow.width = currentWindow.width;
      if(setWindow.height == null ||
         setWindow.height > currentWindow.height) setWindow.height = currentWindow.height;
    });

    var mazeLines = MAZE(GAMEGRIDSCALE, setWindow.width, setWindow.height, true);
    setWindow.mazeLines = mazeLines;
    //console.log(mazeLines);
    console.log("result: ", setWindow);
    io.sockets.emit('getCanvasSize', setWindow);
  }//end setCanvasSizeOfClients


    function sendNewSnake(snake){
      socket.broadcast.emit('addSnake', snake);
    }//end sendNewSnake

    function sendSnakeDir(snakeDir){
      socket.broadcast.emit('snakeDir', snakeDir);
    }


  function sendNewGuiState(guiState){
    socket.broadcast.emit('guiState', guiState);
  }


  function clientDisconnected(){
    console.log("client disconnected: ", socket.id);
    sessionWindowSizes.delete(socket.id);
  }


}//new connection "per socket"
