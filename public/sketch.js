//Global Variables
var DEBUGBOOL = false;
var BACKGROUNDIMAGE;
var BOARD;
var GUI;
var MAZE;
var GAMEGRIDSCALE = 60;
var startTime = new Date().getTime();
var currentTick = 0;

var SOCKET;

// function preload() {
//   bgMusic = loadSound('assets/Derezzed.mp3');
// }

//runs once at the beggining
function setup(){
  frameRate(60);
  createBackground();
  // bgMusic.setVolume(0.05);
  // bgMusic.play();
  // bgMusic.jump(30);
  BOARD = new Board();
  BOARD.init();
  BOARD.setCanvasToWindow();

  MAZE = new Maze(GAMEGRIDSCALE, color(44, 53, 241, 100));
  MAZE.debugging = true;
  MAZE.knockOutWalls = true;
  GUI = new Menu();
  GUI.guiState("startOfGame");
  BOARD.startMenuSnakes();

  SOCKET = io();
  SOCKET.on('mouse', socketMouseClick);
}

function socketMouseClick(data){
  console.log("socket info: ", data);
}

function mousePressed() {
  console.log("clicked", mouseX," , ", mouseY);
  var data = {
    x: mouseX,
    y: mouseY
  }

  SOCKET.emit('mouse', data);
  GUI.checkClicks();
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
    displayBackground();
    updateCount++;
    MAZE.show();
    BOARD.boardUpdate();
    GUI.drawGUI();
    BOARD.showSnakes();
    displayText();

    previousTick = currentTick;
  }
} //draw

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

function createBackground(){
  console.log("createBackground");
  loadImage('assets/backgroundToRepeat.jpg',function(img){

    var newImage = new p5.Image(width,height);
    //newImage.copy(img,0,0,img.width,img.height,0,0,img.width,img.height);

    var widthRatio = Math.floor(width / img.width);
    var remainingWidth = (width / img.width) - widthRatio;
    var heightRatio = Math.floor(height /img.height);
    var remainingHeight = (height /img.height) - heightRatio;
    // console.log(widthRatio, heightRatio);

    //copy(srcImage,sx,sy,sw,sh,
    //dx,dy,dw,dh)
    for(var h=0; h<heightRatio; h++){
      //draw full row
      for(var w=0; w<widthRatio; w++){
        //full image
        newImage.copy(img,0,0,img.width,img.height,
          img.width*w,img.height*h,img.width,img.height);
      }
      //remaing of row
      if(remainingWidth > 0){
        newImage.copy(img,0,0,img.width*remainingWidth,img.height,
          img.width*widthRatio,img.height*h,img.width*remainingWidth,img.height);
      }
      //end draw full row
    }
    //draw last partial row
    if(remainingHeight > 0){
      for(var w=0; w<widthRatio; w++){
        //full image
        newImage.copy(img,0,0,img.width,img.height*remainingHeight,
          img.width*w,img.height*h,img.width,img.height*remainingHeight);
      }
      //remaing of row
      if(remainingWidth > 0){
        newImage.copy(img,0,0,img.width*remainingWidth,img.height*remainingHeight,
          img.width*widthRatio,img.height*heightRatio,img.width*remainingWidth,img.height*remainingHeight);
      }
    }

    // stroke(255);
    // strokeWeight(10);
    // newImage.line(0,0,500,500);

    //idea to draw walls onto a canvas and flatten to image.
    //will be more effecient and allow walls to be a texture
    var pPixels;
    var sketch = function(p){
      p.x = 100;
      p.y = 100;
      p.setup = function(){
        p.createCanvas(100,100);
        p.noLoop();
      }
      p.draw = function(){
        p.background(p.color(200,30,100));
        p.fill(p.color(30,100,200));
        p.rect(20,20,p.width,p.height);
        p.loadPixels();
        pPixels = p.pixels;
      }

    }
    var testP5 = new p5(sketch);
    console.log(pPixels);
    var testImg = new p5.Image(100,100);
    testImg.loadPixels();
    testImg.pixels = pPixels;
    testImg.updatePixels();
    console.log(testImg);
    console.log(newImage);

    // newImage.mask(testImg);




    BACKGROUNDIMAGE = newImage;
    // BACKGROUNDIMAGE = testImg;
  }, function(error){
    console.log("error: ",error);
  });

}

function displayBackground(){
  if(BACKGROUNDIMAGE){
    background(BACKGROUNDIMAGE);
  }//if image is loaded
}//end displayBackground

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
