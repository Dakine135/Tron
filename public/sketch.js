//Global Variables
var BOARD;
var GUI;
var MAZE;
var SOCKET;
var SETTINGS;
var startTime = new Date().getTime();
var currentTick = 0;
var CURRENTGAMESTATE;
var VIEW;

var RAWBACKGROUDIMG;

var FIRSTPERSON = true;
function toggleFirstPerson(){
    FIRSTPERSON = !FIRSTPERSON;
    //console.log("BOARD.init CALLED FROM toggleFirstPerson");
    BOARD.init();
}

function preload() {
    //bgMusic = loadSound('assets/Derezzed.mp3');
    RAWBACKGROUDIMG = loadImage('assets/backgroundToRepeat.jpg');
}

//runs once at the beggining
function setup(){
    frameRate(60);
    // bgMusic.setVolume(0.05);
    // bgMusic.play();
    // bgMusic.jump(30);
    BOARD = new Board();
    //BOARD.createBackground();
    GUI = new Menu();
    GUI.guiState("startOfGame", false);
    SOCKET = new Socket();
}

function mousePressed() {
    GUI.checkClicks();
}

function keyPressed(){
    BOARD.checkControls();
}

//draw function runs constantly, repeating at frameRate per second
var previousTick = 0;
var drawCount = 0;
function draw(){

    if(FIRSTPERSON && CURRENTGAMESTATE && CURRENTGAMESTATE.guiState === "gameRunning" &&
        SOCKET && SOCKET.mySnake){
        if(VIEW == null){
            VIEW = new View();
        }
        VIEW.update(SOCKET.mySnake);
        camera.on();
        camera.zoom = 1;
        camera.position.x = VIEW.x;
        camera.position.y = VIEW.y;
    } else {
        camera.off();
        VIEW = null;
    }
    drawCount++;
    var currentTime = new Date().getTime();
    var timeDiff = currentTime - startTime;
    currentTick = Math.floor((timeDiff % 1000) / 25);
    //console.log("currentTick: ", currentTick);
    if(currentTick == 0 && previousTick != currentTick) {
        document.getElementById("drawCount").innerHTML = "FrameRate: " + drawCount;
        drawCount = 0;
        //console.log("updateCount: ", updateCount);
    }

    BOARD.show();
    BOARD.showSnakes();
    BOARD.showPowerUps();
    GUI.drawGUI();

    previousTick = currentTick;

} //draw

