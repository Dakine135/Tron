//Global Variables
var DEBUGBOOL = false;
var BOARD;
var GUI;
var startTime = new Date().getTime();
var currentTick = 0;

//runs once at the beggining
function setup(){
  frameRate(60);
  BOARD = new Board();
  BOARD.init();
  BOARD.setCanvasToWindow();
  GUI = new Menu();
  //Snake(snakeName, upButton,downButton,leftButton,rightButton, startColor, endColor, tailLength, size)
  var snake1Name = BOARD.addSnake("Player1", UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW,
      color(194, 254, 34), color(235, 29, 99), 400, 10);
  var snake2Name = BOARD.addSnake("Player2",87, 83, 65, 68,
      color(28, 20, 242), color(252, 14, 30), 400, 10);

  GUI.startOfGame = true;

  console.log("Snake ",snake1Name, " created");
  console.log("Snake ",snake2Name, " created");
  //GUI.introSnake();
}

function mousePressed() {
  GUI.checkClicks();
  //console.log("clicked", mouseX," , ", mouseY);
}

function keyPressed(){
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
    document.getElementById("drawCount").innerHTML = drawCount + " / " + updateCount;
    drawCount = 0;
    //console.log("updateCount: ", updateCount);
    updateCount = 0;
  }
  if (previousTick != currentTick){
    updateCount++;
     BOARD.boardUpdate();
     GUI.drawGUI();

    previousTick = currentTick;
  }
  BOARD.showSnakes();
  displayText();
  updateHTML();
} //draw

function updateHTML(){
  // document.getElementById("xPos").innerHTML = s.x;
  // document.getElementById("yPos").innerHTML = s.y;
  // document.getElementById("xSpd").innerHTML = s.speedScale;
  // document.getElementById("snakeSize").innerHTML = s.size;
  // document.getElementById("mouseXPos").innerHTML = Math.round(mouseX);
  // document.getElementById("mouseYPos").innerHTML = Math.round(mouseY);
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
