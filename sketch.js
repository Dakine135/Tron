//Global Variables
DEBUGBOOL = true;
var BOARD;
var startTime = new Date().getTime();
var currentTick = 0;

//Snakes
var s;

//runs once at the beggining
function setup(){
  BOARD = new Board();
  BOARD.init();
  BOARD.setCanvasToWindow();
  s = new Snake();
  s.setControls(
    UP_ARROW,
    DOWN_ARROW,
    LEFT_ARROW,
    RIGHT_ARROW
  );
  s.intializeTailColor();
  frameRate(60);
}

function keyPressed(){
  s.checkControls();
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
    document.getElementById("drawCount").innerHTML = drawCount + " / " + updateCount;
    drawCount = 0;
    //console.log("updateCount: ", updateCount);
    updateCount = 0;
  }
  if (previousTick != currentTick){
    updateCount++;
     s.update();
     BOARD.boardUpdate();

    previousTick = currentTick;
  }
  s.show();
  displayText();
  updateHTML();
} //draw

function updateHTML(){
  document.getElementById("xPos").innerHTML = s.x;
  document.getElementById("yPos").innerHTML = s.y;
  document.getElementById("xSpd").innerHTML = s.speedScale;
  document.getElementById("snakeSize").innerHTML = s.size;
}

//displays text in the center of the screen
//currently only used for pause
function displayText(){
  if(BOARD.paused){
    fill(255, 204, 0);
    stroke (255,255,255);
    var textString = "Game Paused";
    var textHeight = height *.10;
    var textWidth = textHeight * (textString.length * 0.5);
    //console.log("textHeight, textWidth: ", textHeight, " , ", textWidth);
    textSize(textHeight);
    var cntrX = (width * 0.5) - (textWidth * 0.5);
    var cntrY = (height * 0.5); // + (textHeight * 0.5)
    text(textString, cntrX, cntrY);

  }
}

//reset canvas and snake properties
function reset() {
  BOARD.resetBoard();
  s.reset();
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
