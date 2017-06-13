//Global Variables
var BACKGROUNDIMAGE;
var BOARD;
var GUI;
var MAZE;
var SOCKET;
var GAMEGRIDSCALE = 60;
var startTime = new Date().getTime();
var currentTick = 0;
var totalGameTick = 0;

// function preload() {
//   bgMusic = loadSound('assets/Derezzed.mp3');
// }

//runs once at the beggining
function setup(){
  frameRate(60);
  // bgMusic.setVolume(0.05);
  // bgMusic.play();
  // bgMusic.jump(30);
  BOARD = new Board();
  BOARD.init();
  BOARD.createBackground();
  GUI = new Menu();
  GUI.guiState("startOfGame", false);
  //BOARD.startMenuSnakes();
  SOCKET = new Socket();
  //SOCKET.startGame();
}

function mousePressed() {
  // console.log("clicked", mouseX," , ", mouseY);
  // SOCKET.sendClicks();
  GUI.checkClicks();
}

function keyPressed(){
  //SOCKET.sendKeyboard(totalGameTick);
  BOARD.checkControls();
}

//draw function runs constantly, repeating at frameRate per second
var previousTick = 0;
var drawCount = 0;
var updateCount = 0;
function draw(){
  drawCount++;
  var currentTime = new Date().getTime();
  var timeDiff = currentTime - startTime;
  currentTick = Math.floor((timeDiff % 1000) / 25);
  //console.log("currentTick: ", currentTick);
  if(currentTick == 0 && previousTick != currentTick) {
    document.getElementById("drawCount").innerHTML = "FrameRate: " + drawCount + " / " + updateCount;
    drawCount = 0;
    //console.log("updateCount: ", updateCount);
    updateCount = 0;
  }







  //game ticks
  if (previousTick != currentTick){
    updateCount++;
    BOARD.boardUpdate();
    BOARD.show();
    BOARD.showSnakes();
    GUI.drawGUI();

    totalGameTick++;
    previousTick = currentTick;
  }
} //draw






//reset canvas and snake properties
function reset() {
  BOARD.resetBoard();
  BOARD.resetSnakes();
}
