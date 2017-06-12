//Global Variables
var DEBUGBOOL = false;
var BACKGROUNDIMAGE;
var BOARD;
var GUI;
var MAZE;
var SOCKET;
var GAMEGRIDSCALE = 60;
var startTime = new Date().getTime();
var currentTick = 0;

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
  // BOARD.setCanvasToWindow();

  // MAZE = new Maze(GAMEGRIDSCALE, color(44, 53, 241, 100), true, true);
  GUI = new Menu();
  GUI.guiState("startOfGame", false);
  //BOARD.startMenuSnakes();
  SOCKET = new Socket();
}

function mousePressed() {
  console.log("clicked", mouseX," , ", mouseY);
  // SOCKET.sendClicks();
  GUI.checkClicks();
}

function keyPressed(){
  SOCKET.sendKeyboard();
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
  if (previousTick != currentTick){
    updateCount++;
    BOARD.boardUpdate();
    BOARD.show();
    BOARD.showSnakes();
    if(MAZE) MAZE.show();
    GUI.drawGUI();

    previousTick = currentTick;
  }
} //draw

//reset canvas and snake properties
function reset() {
  BOARD.resetBoard();
  BOARD.resetSnakes();
}

function DEBUG(input){
  if(DEBUGBOOL){
    if(input == null) input = "No Input"
    console.log("Debug");
    console.log("Speed: ",s.speedScale);
    console.log("input: ",input);
    console.log("currentTick: ", currentTick);
    console.log("END OF DEBUG");
  }
}
