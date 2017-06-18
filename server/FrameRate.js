//NPM PACKAGES
var express = require('express');
var socket = require('socket.io');
var hash = require('object-hash');
const gameloop = require('node-gameloop');

//OUR CODE
var GAMESTATE = require('./GameState');
var MAZE = require('./Maze');
var SNAKE = require('./Snake');
var CLIENT = require('./Client');
var LIB = require('./Lib');

var app = express();
var server = app.listen(3033);
var io = socket(server);

//CONFIG OPTIONS
var WALLREMOVALFACTOR = 3;
var CEARUPSINGLEWALLS = true;
var LEAVEWALLEDGE = false;
var HEIGHT = 50*9;
var WIDTH = 50*16;
var NUMOFCELLS = 20;
var GAMEGRIDSCALE = WIDTH / NUMOFCELLS;
var TICKSPERSECOND = 30;

var CLIENTSETTINGS = {
    hash: null,
    GAMEGRIDSCALE: GAMEGRIDSCALE,
    WIDTH: WIDTH,
    HEIGHT: HEIGHT
};
CLIENTSETTINGS.hash = hash(CLIENTSETTINGS);

var NUMPLAYERSCONNECTED = 0;

//snake Defaults
var SNAKETAIL = 400;
var SNAKESIZE = 10;
var SNAKESPEEDSCALE = 3;
var SNAKEDEFAULTS = {
    tailLength: SNAKETAIL,
    size: SNAKESIZE,
    snakeSpeedScale: SNAKESPEEDSCALE
};

var STARTSCORE = 10;

app.use(express.static('../public'));
console.log("Tron node server running");

io.sockets.on('connection', newConnection);

var MAZELINES = new MAZE(GAMEGRIDSCALE, WIDTH, HEIGHT,
        WALLREMOVALFACTOR, CEARUPSINGLEWALLS, LEAVEWALLEDGE);

//MAIN GAME COUNTER
//start the loop at 30 fps (1000/30ms per frame) and grab its id
var FRAMECOUNT = 0;
var CURRENTGAMESTATE = new GAMESTATE(FRAMECOUNT, MAZELINES, CLIENTSETTINGS, SNAKEDEFAULTS);

var GAMELOOPID = gameloop.setGameLoop(function(delta) {
    FRAMECOUNT++;
    //console.log('Frame=%s', frameCount);

    CURRENTGAMESTATE.update(FRAMECOUNT);

    var clientPackage = CURRENTGAMESTATE.package(NUMPLAYERSCONNECTED);
    //console.log(clientPackage);
    io.sockets.emit('updateClients', clientPackage);

}, 1000 / TICKSPERSECOND); //end game loop 30 updates a second

// // stop the loop 2 seconds later
// setTimeout(function() {
//     console.log('2000ms passed, stopping the game loop');
//     gameloop.clearGameLoop(GAMELOOPID);
// }, 2000);

function newConnection(socket){
  //Client first connects, create Client object and snake
  console.log("a user connected: ", socket.id);
    NUMPLAYERSCONNECTED++;
    var snake = new SNAKE(socket.id, SNAKETAIL, SNAKESIZE, SNAKESPEEDSCALE, WIDTH, HEIGHT, GAMEGRIDSCALE);
    var tempClient = new CLIENT(socket.id, STARTSCORE, snake);

    CURRENTGAMESTATE.addClient(tempClient);

    socket.on('snakeDir', updateSnakeDir);
    function updateSnakeDir(snakeDir){
        //console.log("change snake direction: ", snakeDir);
        CURRENTGAMESTATE.updateSnakeDir(socket.id, snakeDir.x, snakeDir.y);
    }

    socket.on('guiState', updateGuiState);
    function updateGuiState(guiState){
        CURRENTGAMESTATE.updateGuiState(guiState);
    }

    socket.on('newMaze', generateNewMaze);
    function generateNewMaze(){
        MAZELINES = new MAZE(GAMEGRIDSCALE, WIDTH, HEIGHT,
            WALLREMOVALFACTOR, CEARUPSINGLEWALLS, LEAVEWALLEDGE);
        CURRENTGAMESTATE.mazeLines = MAZELINES;
    }

    socket.on('disconnecting', clientDisconnected);
    function clientDisconnected(){
        console.log("client disconnected: ", socket.id);
        CURRENTGAMESTATE.removeClient(socket.id);
        NUMPLAYERSCONNECTED--;
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
