DEBUGBOOL = true;
var s;
var canvasHeight = 600;
var canvasWidth = 600;
var pause = false;
var scl = 10;
var food;
var speed = 0.6;
var lastX = 0;
var lastY = 0;
var lastSpeed = speed;
var startTime = new Date().getTime();
var currentTick = 0;


function setup(){
  createCanvas(canvasWidth,canvasHeight);
  s = new Snake();
  frameRate(60);
  food = createVector
}

var previousTick = 0;
var drawCount = 0;
var updateCount = 0;
function draw(){
  drawCount++;
  var currentTime = new Date().getTime();
  var timeDiff = currentTime - startTime;
  currentTick = Math.floor((timeDiff % 1000) / 25);
  //console.log("currentTick: ", currentTick);
  background(50);
  if(currentTick == 0 && previousTick != currentTick) {
    document.getElementById("drawCount").innerHTML = drawCount;
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

} //draw

function displayText(){
  if(pause){
    var textString = "Paused";
    var textHeight = height *.10;
    var textWidth = textHeight * (textString.length * 0.5);
    console.log("textHeight, textWidth: ", textHeight, " , ", textWidth);
    textSize(textHeight);
    var cntrX = (width * 0.5) - (textWidth * 0.5);
    var cntrY = (height * 0.5); // + (textHeight * 0.5)
    text(textString, cntrX, cntrY);
    fill(0, 102, 153);
  }
}
function canvasSize() {
    var x = document.getElementById("canvasSizeform");
    canvasWidth = x.elements[0].value;
    canvasHeight = x.elements[1].value;
    createCanvas(canvasWidth,canvasHeight);
}

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
function chngCOLOR(){
var r = Math.floor(Math.random() * 255) + 1;
var g = Math.floor(Math.random() * 255) + 1;
var b = Math.floor(Math.random() * 255) + 1;
s.color = color(r,g,b);

}
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

function StopStart(input) {
  DEBUG(input);
  if (input == 0){
    if (speed> 0){
      pause = true;
      console.log("Game Paused");
      lastX= s.xspeed;
      lastY= s.yspeed;
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

function Scale(input){
  if(input == 1){
    scl = scl + 5;
  } else if (input = 0){
    scl = scl -5;
  }
}//END OF Scale FUNCTION
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
  s.x = 300;
  s.y = 300;
  s.xspeed = 0;
  s.yspeed = 0;
  s.color = color(255,255,255);
  s.trail = [];
}
function DEBUG(input){
  if(DEBUGBOOL){
    if(input == null) input = "No Input"
    console.log("Debug");
    console.log("Speed: ",speed);
    console.log("input: ",input);
    console.log("currentTick: ", currentTick);
    console.log("Current RGB Value: ", s.color.levels[0], s.color.levels[1], s.color.levels[2] );
    console.log("END OF DEBUG");
  }
}
