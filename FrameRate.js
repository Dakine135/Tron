//NPM PACKAGES
var express = require('express');
var socket = require('socket.io');
var hash = require('object-hash');
const gameloop = require('node-gameloop');
// var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

//OUR CODE
var GAMESTATE = require('./server/GameState');
var MAZE = require('./server/Maze');
var SNAKE = require('./server/Snake');
var CLIENT = require('./server/Client');
var LIB = require('./server/lib.js');
var CONFIG = require('./server/Config.js');
var GLOBALS = require('./server/Globals');
// var GENETICLEARNING = require('./server/GeneticLearning.js');

var app = express();
var server = app.listen(3033);
var io = socket(server);

// var url = 'mongodb://localhost:27017/FrameRate';
// MongoClient.connect(url, function(err, db) {
//     assert.equal(null, err);
//     console.log("Connected correctly to MongoDB server.");
//     db.close();
// });

app.use(express.static('./public'));
console.log("Tron node server running");

io.sockets.on('connection', newConnection);

console.log("CONFIG", CONFIG);

var CLIENTSETTINGS = {
    hash: null,
    GAMEGRIDSCALE: CONFIG.GAMEGRIDSCALE,
    WIDTH: CONFIG.WIDTH,
    HEIGHT: CONFIG.HEIGHT
};
CLIENTSETTINGS.hash = hash(CLIENTSETTINGS);

var MAZELINES = null;
MAZELINES = new MAZE();

//MAIN GAME COUNTER
//start the loop at 30 fps (1000/30ms per frame) and grab its id
var FRAMECOUNT = 0;
GLOBALS.CURRENTGAMESTATE = new GAMESTATE(FRAMECOUNT, MAZELINES, CLIENTSETTINGS);
var runOnce = true;

var GAMELOOPID = gameloop.setGameLoop(function(delta) {
    FRAMECOUNT++;
    //console.log('Frame=%s', frameCount);

    GLOBALS.CURRENTGAMESTATE.update(FRAMECOUNT);
    if(runOnce && MAZELINES != null){
        runOnce = false;
        // GLOBALS.CURRENTGAMESTATE.runSimulation();
    }

    var clientPackage = GLOBALS.CURRENTGAMESTATE.package();
    //console.log(clientPackage);
    io.sockets.emit('updateClients', clientPackage);

}, 1000 / CONFIG.TICKSPERSECOND); //end game loop 30 updates a second

// // stop the loop 2 seconds later
// setTimeout(function() {
//     console.log('2000ms passed, stopping the game loop');
//     gameloop.clearGameLoop(GAMELOOPID);
// }, 2000);

function newConnection(socket){
  //Client first connects, create Client object and snake
  console.log("a user connected: ", socket.id);
    var snake = new SNAKE(socket.id);
    // console.log(snake);
    var tempClient = new CLIENT(socket.id, snake);

    GLOBALS.CURRENTGAMESTATE.addClient(tempClient);

    socket.on('snakeDir', updateSnakeDir);
    function updateSnakeDir(snakeDir){
        //console.log("change snake direction: ", snakeDir);
        GLOBALS.CURRENTGAMESTATE.updateSnakeDir(socket.id, snakeDir.x, snakeDir.y);
    }

    socket.on('guiState', updateGuiState);
    function updateGuiState(guiState){
        GLOBALS.CURRENTGAMESTATE.updateGuiState(guiState);
    }

    socket.on('newMaze', generateNewMaze);
    function generateNewMaze(){
        MAZELINES = new MAZE();
        GLOBALS.CURRENTGAMESTATE.mazeLines = MAZELINES;
        GLOBALS.CURRENTGAMESTATE.restart();
    }

    socket.on('updatePing', updatePing);
    function updatePing(time){
        GLOBALS.CURRENTGAMESTATE.updatePing(socket.id, new Date().getTime(), time);
    }

    socket.on('disconnecting', clientDisconnected);
    function clientDisconnected(){
        console.log("client disconnected: ", socket.id);
        GLOBALS.CURRENTGAMESTATE.removeClient(socket.id);
    }

}//new connection "per socket"
