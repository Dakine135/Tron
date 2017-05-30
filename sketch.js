//Global Variables
DEBUGBOOL = true;
var s;
var BOARD;
var pause = false;
var scl = 10;
var speed = 0.6;
var lastX = 0;
var lastY = 0;
var lastSpeed = speed;
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
    previousTick = currentTick;
  }
  s.show();
  displayText();
  document.getElementById("xPos").innerHTML = s.x;
  document.getElementById("yPos").innerHTML = s.y;
  document.getElementById("xSpd").innerHTML = speed*10;
  document.getElementById("scl").innerHTML = scl;
  document.getElementById("canvasWidthBox").value = width;
  document.getElementById("canvasHeightBox").value = height;


} //draw

//displays text in the center of the screen
function displayText(){
  if(pause){
    var textString = "Paused";
    var textHeight = height *.10;
    var textWidth = textHeight * (textString.length * 0.5);
    //console.log("textHeight, textWidth: ", textHeight, " , ", textWidth);
    textSize(textHeight);
    var cntrX = (width * 0.5) - (textWidth * 0.5);
    var cntrY = (height * 0.5); // + (textHeight * 0.5)
    text(textString, cntrX, cntrY);
    fill(0, 102, 153);
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


  if (keyCode == 32){
    speed = speed * 2;
    s.dir(s.xdir,s.ydir);
    console.log("Space Bar Pressed: ", speed);
  }
}//END OF keyP FUNCTION

function keyReleased() {
  if (keyCode === 32) {
    speed = 1;
    s.dir(s.xdir,s.ydir);
  }
}

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
  if ((speed+input)> 0){
    console.log("Button pressed: ", speed, ' + ', input);
    console.log(Math.floor((speed+input)*100));
    speed = Math.floor((speed+input)*100)/100;
    s.dir(s.xdir,s.ydir);
  } else {
    console.log("cannot reduce speed");
  }
}//END OF chngSPEED FUNCTION

//pause and un-pause the game
function StopStart(input) {
  DEBUG(input);
  if (input == 0){
    if (speed> 0){
      pause = true;
      console.log("Game Paused");
      lastX= s.xdir;
      lastY= s.ydir;
      lastSpeed = speed;
      speed = 0;
      s.dir(0, 0);
    } else {

      console.log("Game not running");
    }
  }else if (input == 1){
    if (speed == 0){
      pause = false;
      console.log("Game Resumed");
      speed = lastSpeed;
      s.dir(lastX,lastY);
    } else {
      console.log("Game Already Running");
    }
  }
}//END OF StopStart FUNCTION

//increase or decrease size of snake
function Scale(input){
    scl = scl + input;
}//END OF Scale FUNCTION

//increase or decrease tail length
function chngTail(input){
  s.maxTailLength = s.maxTailLength + input;
}//END of chngTail

//reset canvas and snake properties
function Reset(){
  s;
  scl = 10;
  food;
  speed = 0.4;
  lastX = 0;
  lastY = 0;
  lastSpeed = speed;
  startTime = new Date().getTime();
  currentTick = 0;
  s.x = width/2;
  s.y = height/2;
  s.xspeed = 0;
  s.yspeed = 0;
  s.tail = [];
  s.currentColor = 0;
  s.startColor = color(0, 0, 204);
  s.endColor = color(102, 255, 255);
  s.intializeTailColor();
  s.colorDirection = true;
  s.currTailLength = 0; //length in pixels
  s.maxTailLength = 1000;
  StopStart(1);
}

function DEBUG(input){
  if(DEBUGBOOL){
    if(input == null) input = "No Input"
    console.log("Debug");
    console.log("Speed: ",speed);
    console.log("input: ",input);
    console.log("currentTick: ", currentTick);
    console.log("END OF DEBUG");
  }
}
