//NPM PACKAGES
var express = require('express');
var socket = require('socket.io');
const gameloop = require('node-gameloop');

//OUR CODE
var GAMESTATE = require('./GameState');
var MAZE = require('./Maze');
var BOARD = require('./Board');
var SNAKE = require('./Snake');

var app = express();
var server = app.listen(3033);
var io = socket(server);

//config options
var GAMEGRIDSCALE = 60;
var WALLREMOVALFACTOR = 3;
var CEARUPSINGLEWALLS = true;
var LEAVEWALLEDGE = false;
var WIDTH = 1400;
var HEIGHT = 740;
var TICKSPERSECOND = 30;

//snake Defaults
var SNAKETAIL = 400;
var SNAKESIZE = 10;

app.use(express.static('../public'));
console.log("Tron node server running");

io.sockets.on('connection', newConnection);

var CLIENTS = new Map();
var MAZELINES = new MAZE(GAMEGRIDSCALE, WIDTH, HEIGHT,
        WALLREMOVALFACTOR, CEARUPSINGLEWALLS, LEAVEWALLEDGE);

//MAIN GAME COUNTER
// start the loop at 30 fps (1000/30ms per frame) and grab its id
var frameCount = 0;
var CURRENTGAMESTATE = new GAMESTATE(frameCount, MAZELINES);
const GAMELOOPID = gameloop.setGameLoop(function(delta) {
    frameCount++;
    //console.log('Frame=%s', frameCount);

    CURRENTGAMESTATE.update(frameCount);

    var clientPackage = CURRENTGAMESTATE.package();
    // console.log(clientPackage);
    io.sockets.emit('updateClients', clientPackage);


}, 1000 / TICKSPERSECOND); //end game loop 30 updates a second

//stop the loop 2 seconds later
// setTimeout(function() {
//     console.log('2000ms passed, stopping the game loop');
//     gameloop.clearGameLoop(GAMELOOPID);
// }, 2000);


//
// if (previousTick != currentTick){
//     updateCount++;
//     BOARD.boardUpdate();
//     BOARD.show();
//     BOARD.showSnakes();
//     GUI.drawGUI();
//
//     totalGameTick++;
//     previousTick = currentTick;
// }

var randomInt = function(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

function newConnection(socket){
  //Client first connects, create Client object and snake
  console.log("a user connected: ", socket.id);
    var startColor = [randomInt(0,256),randomInt(0,256),randomInt(0,256)];
    var endColor = [randomInt(0,256),randomInt(0,256),randomInt(0,256)];
    var tempClient = {
        key: socket.id,
        connectedAt: new Date(),
        snake: new SNAKE(socket.id, null, null, null, null, startColor, endColor,
            SNAKETAIL, SNAKESIZE, WIDTH, HEIGHT, GAMEGRIDSCALE)
    };

    CLIENTS.set(socket.id, tempClient);
    CURRENTGAMESTATE.addSnake(tempClient.snake);

    socket.on('disconnecting', clientDisconnected);

    function clientDisconnected(){
        console.log("client disconnected: ", socket.id);
        CLIENTS.delete(socket.id);
        CURRENTGAMESTATE.removeSnake(socket.id);
    }


  // sendNewGuiState("startOfGame");
  //
  // socket.on('getCanvasSize', setCanvasSizeOfClients);
  // socket.on('addSnake', sendNewSnake);
  // socket.on('snakeDir', sendSnakeDir);
  // socket.on('snakeRespawn', sendSnakeRespawn);
  // socket.on('guiState', sendNewGuiState);
  //
  //
  // function setCanvasSizeOfClients(currentWindow){
  //   console.log("window size of ", socket.id, " is ",currentWindow);
  //   sessionWindowSizes.set(socket.id, currentWindow);
  //   setWindow = {
  //     width: null,
  //     height: null
  //   };
  //   sessionWindowSizes.forEach(function(currentWindow){
  //     console.log("currentWindow in loop: ", currentWindow);
  //     var setWidth = Math.round((currentWindow.width - 50)/GAMEGRIDSCALE)*GAMEGRIDSCALE;
  //     var setHeight = Math.round((currentWindow.height - 150)/GAMEGRIDSCALE)*GAMEGRIDSCALE;
  //     if(setWindow.width == null ||
  //        setWindow.width > setWidth) setWindow.width = setWidth;
  //     if(setWindow.height == null ||
  //        setWindow.height > setHeight) setWindow.height = setHeight;
  //   });
  //
  //   if(setWindowOLD == null || setWindow.mazeLines == null ||
  //      setWindow.width != setWindowOLD.width || setWindow.height != setWindowOLD.height) {
  //         setWindow.mazeLines = new MAZE(GAMEGRIDSCALE, setWindow.width, setWindow.height,
  //                                        WALLREMOVALFACTOR, CEARUPSINGLEWALLS, LEAVEWALLEDGE);
  //   }
  //
  //   setWindowOLD = setWindow;
  //   io.sockets.emit('getCanvasSize', setWindow);
  // }//end setCanvasSizeOfClients
  //
  //
  //   function sendNewSnake(snake){
  //     socket.broadcast.emit('addSnake', snake);
  //   }//end sendNewSnake
  //
  //   function sendSnakeDir(snakeDir){
  //     socket.broadcast.emit('snakeDir', snakeDir);
  //   }
  //
  //   function sendSnakeRespawn(snakeRespawn){
  //     socket.broadcast.emit('snakeRespawn', snakeRespawn);
  //   }
  //
  //
  // function sendNewGuiState(guiState){
  //   socket.broadcast.emit('guiState', guiState);
  // }





}//new connection "per socket"
