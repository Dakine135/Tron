//Global Variables
DEBUGBOOL = true;
var s;
var BOARD;
var scl = 10;
var startTime = new Date().getTime();
var currentTick = 0;

//runs once at the beggining
function setup(){
  BOARD = new Board();
  BOARD.init();
  s = new Snake();
  s.intializeTailColor();
  frameRate(60);
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
  document.getElementById("xSpd").innerHTML = s.speedScale*10;
  document.getElementById("scl").innerHTML = scl;
}

//displays text in the center of the screen
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

//detects when keys are pressed and changes snakes direction
function keyPressed(){
  var xdir = 0;
  var ydir = 0;
  if (keyIsDown(UP_ARROW)){
    //s.dir(0, -1);
    ydir--;
  }if (keyIsDown(DOWN_ARROW)) {
    //s.dir(0, 1);
    ydir++;
  }if (keyIsDown(LEFT_ARROW)) {
    //s.dir(-1, 0);
    xdir--;
  }if (keyIsDown(RIGHT_ARROW)) {
    //s.dir(1, 0);
    xdir++;
  }
  s.dir(xdir,ydir);
}//END OF keyP FUNCTION

//change snake's color to random colors
function chngCOLOR(){
  var r = Math.floor(Math.random() * 255) + 1;
  var g = Math.floor(Math.random() * 255) + 1;
  var b = Math.floor(Math.random() * 255) + 1;
  s.startColor = color(r,g,b);
  r = Math.floor(Math.random() * 255) + 1;
  g = Math.floor(Math.random() * 255) + 1;
  b = Math.floor(Math.random() * 255) + 1;
  s.endColor = color(r,g,b);
  s.intializeTailColor();
}

//change increment multiplier for snakes speed up or down
function chngSPEED(input) {
  if ((s.speedScale + input)> 0){
    console.log("Button pressed: ", s.speedScale, ' + ', input);
    console.log(Math.round((s.speedScale+input)*100));
    s.speedScale = Math.round((s.speedScale+input)*100)/100;
    s.dir(s.xdir,s.ydir);
  } else {
    console.log("cannot reduce speed");
  }
}//END OF chngSPEED FUNCTION

//increase or decrease size of snake
function Scale(input){
    scl = scl + input;
}//END OF Scale FUNCTION

//increase or decrease tail length
function chngTail(input){
  s.maxTailLength = s.maxTailLength + input;
}//END of chngTail

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
