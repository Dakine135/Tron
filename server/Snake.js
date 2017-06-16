module.exports = Snake;
function Snake(snakeName, upButton, downButton, leftButton, rightButton,
               startColor, endColor, tailLength, size, width, height, GAMEGRIDSCALE){
  // console.log("create Snake: ",snakeName, upButton,downButton,leftButton,rightButton,
  //     startColor, endColor, tailLength, size);
  this.name = snakeName;

  this.WIDTH = width;
  this.HEIGHT = height;
  this.GAMEGRIDSCALE = GAMEGRIDSCALE;

  //starting position
  this.size = size;
  this.x = this.WIDTH/2 - (this.size/2);
  this.y = this.HEIGHT/2 - (this.size/2);
  this.direction = "Stopped";

  //controls
  this.upButton = upButton;
  this.downButton = downButton;
  this.leftButton = leftButton;
  this.rightButton = rightButton;

  //starting direction and speed
  this.xdir = 0;
  this.ydir = 0;
  this.xspeed = 0;
  this.yspeed = 0;
  this.lastXSpeed = this.xspeed;
  this.lastYSpeed = this.yspeed;
  this.speedScale = 3;

  //tail and color stuff
  this.tail = [];
  this.tailColors = [];
  this.currentColor = 0;
  this.startColor = startColor;
  this.endColor = endColor;
  this.colorDirection = true;
  this.currTailLength = 0; //length in pixels
  this.maxTailLength = tailLength;
  this.maxSegmentDist = this.maxTailLength / 40;

  //stuff for pausing
  this.paused = false;
  this.lastX = this.xdir;
  this.lastY = this.ydir;
  this.lastSpeedScale = this.speedScale;

  //detects when keys are pressed and changes snakes direction
  // this.checkControls = function(){
  //   var xdir = 0;
  //   var ydir = 0;
  //   var pressed = false;
  //   if (keyIsDown(this.upButton)){
  //     ydir--;
  //     pressed = true;
  //   }if (keyIsDown(this.downButton)) {
  //     ydir++;
  //     pressed = true;
  //   }if (keyIsDown(this.leftButton)) {
  //     xdir--;
  //     pressed = true;
  //   }if (keyIsDown(this.rightButton)) {
  //     xdir++;
  //     pressed = true;
  //   }
  //   if(pressed) this.dir(xdir,ydir);
  // };//END OF keyP FUNCTION

  // this.intializeTailColor = function(){
  //   var steps = 100;
  //   var redDiff = this.endColor.levels[0] - this.startColor.levels[0];
  //   var greenDiff = this.endColor.levels[1] - this.startColor.levels[1];
  //   var BlueDiff = this.endColor.levels[2] - this.startColor.levels[2];
  //
  //   for(var i=0; i<steps; i++){
  //     var currRed = this.startColor.levels[0] + (redDiff * (i/steps));
  //     var currGreen = this.startColor.levels[1] + (greenDiff * (i/steps));
  //     var currBlue = this.startColor.levels[2] + (BlueDiff * (i/steps));
  //     this.tailColors[i] = color(currRed, currGreen, currBlue);
  //   }
  // };

  var randomInt = function(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

  var dist = function(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x2-x1), 2)+Math.pow((y2-y1), 2));
  };

  var collidePointLine = function(px,py,x1,y1,x2,y2, buffer){
      // get distance from the point to the two ends of the line
      //var d1 = Math.sqrt(Math.pow((px-x1), 2)+Math.pow((py-y1), 2));
      //var d2 = Math.sqrt(Math.pow((px-x2), 2)+Math.pow((py-y2), 2));
      var d1 = dist(px, py, x1, y1);
      var d2 = dist(px, py, y1, y2);

      // get the length of the line
      var lineLen = Math.sqrt(Math.pow((x1-x2), 2)+Math.pow((y1-y2), 2));

      // since floats are so minutely accurate, add a little buffer zone that will give collision
      if (buffer === undefined){ buffer = 0.1; }   // higher # = less accurate

      // if the two distances are equal to the line's length, the point is on the line!
      // note we use the buffer here to give a range, rather than one #
      if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
          return true;
      }
      return false;
  };//end collidePointLine


  this.spawn = function(){
    if(this.upButton != null) {
        var widthCells = this.WIDTH / this.GAMEGRIDSCALE;
        var heightCells = this.HEIGHT / this.GAMEGRIDSCALE;
        var randomRow = randomInt(0, heightCells);
        var randomCol = randomInt(0, widthCells);
        var newXPos = (this.GAMEGRIDSCALE * randomCol) + (this.GAMEGRIDSCALE / 2);
        var newYPos = (this.GAMEGRIDSCALE * randomRow) + (this.GAMEGRIDSCALE / 2);
        //console.log("spawn: ", newXPos, newYPos);
        this.createPreviousPosition(this.x, this.y, true, false);
        this.x = newXPos;
        this.y = newYPos;
        this.createPreviousPosition(this.x, this.y, false, true);
        //SOCKET.snakeRespawn(this.name, this.x, this.y);
        this.dir(0, 0);
    }
  };//end spawn

  this.dir = function(x, y) {
    this.xdir = x;
    this.ydir = y;
    this.xspeed = x*this.speedScale;
    this.yspeed = y*this.speedScale;

    if(this.xspeed == 0 && this.yspeed == 0) this.direction = "Stopped";
    else if(this.xspeed == 0 && this.yspeed < 0) this.direction = "N";
    else if(this.xspeed > 0 && this.yspeed < 0) this.direction = "NE";
    else if(this.xspeed > 0 && this.yspeed == 0) this.direction = "E";
    else if(this.xspeed > 0 && this.yspeed > 0) this.direction = "SE";
    else if(this.xspeed == 0 && this.yspeed > 0) this.direction = "S";
    else if(this.xspeed < 0 && this.yspeed > 0) this.direction = "SW";
    else if(this.xspeed < 0 && this.yspeed == 0) this.direction = "W";
    else if(this.xspeed < 0 && this.yspeed < 0) this.direction = "NW";
    else console.log("ERROR in DIRECTION");

    // if(this.lastXSpeed != this.xspeed || this.lastYSpeed != this.yspeed){
    //     this.lastXSpeed = this.xspeed;
    //     this.lastYSpeed = this.yspeed;
    //     SOCKET.changeSnakeDir(this.name, this.x, this.y, this.xspeed, this.yspeed);
    // }

    if(this.direction != "Stopped") this.createPreviousPosition(this.x,this.y,false,true);
    //console.log("Direction: ", this.xspeed,":",this.yspeed, " ==> ", this.direction);
  };

  //currently just for turning and jumping
  this.createPreviousPosition = function(x,y,jump,newSegment){
    // console.log("---------calling function createPreviousPosition(",x,",",y,",",jump,",",newSegment,")");
    var distance = 0;
    if(this.tail.length>0 && !this.tail[0].jump){
      var prevX = this.tail[0].x;
      var prevY = this.tail[0].y;
      distance = int(dist(x,y,prevX,prevY));
    }

    var previousPosition = {
      x: x,
      y: y,
      jump: jump,
      dist: distance,
      color: this.tailColors[this.currentColor],
      dir: this.direction,
      newSegment: newSegment
    };


    this.currTailLength = this.currTailLength + distance;
    while(this.currTailLength > this.maxTailLength && this.tail.length > 0){ //remove to meet length restriction
      var removedPoint = this.tail.pop();
      this.currTailLength = this.currTailLength - removedPoint.dist;
    }

    var combine = false;
    if(this.tail.length > 0 &&
      this.tail[0].dist < this.maxSegmentDist &&
      !previousPosition.newSegment &&
      !this.tail[0].newSegment &&
      this.tail[0].dir == previousPosition.dir) combine = true;

    //updateTail with new previousPosition
    //var newSegment = this.newSegment(previousPosition);
    if(combine){
      this.tail[0].x = previousPosition.x;
      this.tail[0].y = previousPosition.y;
      this.tail[0].dist = this.tail[0].dist + previousPosition.dist;
      this.tail[0].jump = previousPosition.jump;
      this.tail[0].color = previousPosition.color;
    }
    else{
      this.tail.unshift(previousPosition);
      if(this.currentColor == 0) this.colorDirection = true;
      else if(this.currentColor == (this.tailColors.length - 1)) this.colorDirection = false;
      if(this.colorDirection) this.currentColor++;
      else this.currentColor--;
    }

  };//end createPreviousPosition

  this.update = function() {
    var nextX = Math.floor(this.x + this.xspeed);
    var nextY = Math.floor(this.y + this.yspeed);

    if(nextX == this.x && nextY == this.y){
      // dont change tail if you havent moved
      return;
    }

    //Wall wrapping code
    var leftWall = -1;
    var rightWall = width + 1;
    var topWall = -1;
    var bottomWall = height + 1;
    if (this.x >= rightWall){ //right wall
      this.createPreviousPosition(this.x,this.y,true,false);
      this.x = 0;
      this.createPreviousPosition(this.x,this.y,false,true);
      return;
    }else if (this.x <= leftWall){ //left wall
      this.createPreviousPosition(this.x,this.y,true,false);
      this.x = width;
      this.createPreviousPosition(this.x,this.y,false,true);
      return;
    }else if (this.y >= bottomWall){ //bottom wall
      this.createPreviousPosition(this.x,this.y,true,false);
      this.y = 0;
      this.createPreviousPosition(this.x,this.y,false,true);
      return;
    }else if (this.y <= topWall){ //top wall
      this.createPreviousPosition(this.x,this.y,true,false);
      this.y = height;
      this.createPreviousPosition(this.x,this.y,false,true);
      return;
    }

    this.createPreviousPosition(this.x,this.y,false,false);

    this.x = nextX;
    this.y = nextY;

    // console.log("dist / currTailLength: ", this.currTailLength, " / ", this.tail.length);

  };//end update

  //increase or decrease tail length
  this.chngTail = function(input){
    this.maxTailLength = this.maxTailLength + input;
    this.maxSegmentDist = this.maxTailLength / 40;
  };

  //increase or decrease size of snake
  this.chngSize = function(input){
    this.size = this.size + input;
  };

  //change increment multiplier for snakes speed up or down
  this.chngSpeed = function(input) {
    if ((s.speedScale + input) > 0){
      s.speedScale = Math.round(s.speedScale + input);
      s.dir(s.xdir,s.ydir);
    } else {
      console.log("cannot reduce speed");
    }
  };//END OF chngSpeed FUNCTION

  //change snake's color to random colors
  this.chngColor = function(){
    var startRed = Math.floor(Math.random() * 255) + 1;
    var startGreen = Math.floor(Math.random() * 255) + 1;
    var startBlue = Math.floor(Math.random() * 255) + 1;

    var r = Math.floor(Math.random() * 255) + 1;
    var g = Math.floor(Math.random() * 255) + 1;
    var b = Math.floor(Math.random() * 255) + 1;

    var diffR = Math.abs(startRed - r);
    var diffG = Math.abs(startGreen - g);
    var diffB = Math.abs(startBlue - b);
    while(Math.max(diffR,diffG,diffB) < 100){
      r = Math.floor(Math.random() * 255) + 1;
      g = Math.floor(Math.random() * 255) + 1;
      b = Math.floor(Math.random() * 255) + 1;

      diffR = Math.abs(startRed-r);
      diffG = Math.abs(startGreen-g);
      diffB = Math.abs(startBlue-b);
    }

    this.startColor = color(startRed,startGreen,startBlue);
    this.endColor = color(r,g,b);
    this.intializeTailColor();
  };

  //reset to defualt (refresh)
  this.reset = function() {
    this.x = width/2;
	  this.y = height/2;
	  this.xspeed = 0;
	  this.yspeed = 0;
	  this.tail = [];
	  this.currentColor = 0;
	  //this.startColor = color(194, 254, 34);
	  //this.endColor = color(235, 29, 99);
	  //this.intializeTailColor();
	  this.colorDirection = true;
	  this.currTailLength = 0; //length in pixels
	  // this.maxTailLength = 1000;
    this.size = 10;
    this.speedScale = 3;
  };//end reset

  this.pause = function(){
    if(this.paused){
      this.paused = false;
      this.speedScale = this.lastSpeedScale;
      this.dir(this.lastX,this.lastY);
    }else{
      this.paused = true;
      this.speedScale = 0;
      this.lastX= this.xdir;
      this.lastY= this.ydir;
      this.dir(0, 0);
    }
  };

  //takes a collision object (returned from tail collision)
  this.cutTail = function(collision){
    if(collision == null) return 0;
    var oldLastPoint = this.tail[collision.tail];
    this.tail = this.tail.slice(0,collision.tail);

    //modify last point to be closer to collision location
    // var diffX = this.tail[this.tail.length-1].x - collision.x;
    // var diffY = this.tail[this.tail.length-1].y - collision.y;
    // var newX = Math.round(this.tail[this.tail.length-1].x - (diffX*0.7));
    // var newY = Math.round(this.tail[this.tail.length-1].y - (diffY*0.7));
    // this.tail[this.tail.length-1].x = newX;
    // this.tail[this.tail.length-1].y = newY;

    var oldTailLength = this.currTailLength;
    this.currTailLength = 0;
    for(var i=0; i<this.tail.length; i++){
      this.currTailLength = this.currTailLength + this.tail[i].dist;
    }
    return abs(this.currTailLength - oldTailLength);
  };//end cutTail

  //returns the index of the tail that you collided width
  //returns -1 if did not collide
  this.checkCollisionWithTail = function(tailInput){
    var tailIndex = 2;
    var lineStartX;
    var lineStartY;
    var lineEndX;
    var lineEndY;
    var hit;
    while(tailIndex < (tailInput.length - 1)){

      if(!tailInput[tailIndex + 1].jump){
        lineStartX = tailInput[tailIndex].x;
        lineStartY = tailInput[tailIndex].y;
        lineEndX = tailInput[tailIndex + 1].x;
        lineEndY = tailInput[tailIndex + 1].y;
        hit = collidePointLine(this.x, this.y, lineStartX, lineStartY, lineEndX, lineEndY, this.size/4)
      }
      //console.log("hit: ", hit);
      if(hit){
        return {
          tail: tailIndex + 1,
          x: this.x,
          y: this.y
        };
      }
      tailIndex++;
    }
    return null;
  };

  this.show = function(){
    fill(this.startColor);
    stroke(this.endColor);
    strokeWeight(Math.ceil(this.size / 10));
    ellipse(this.x, this.y, this.size, this.size);

    var prevPt;
    var strokeStartWeight = this.size/3;
    for(var i=0; i<this.tail.length; i++){
      var curPt = this.tail[i];
      if(prevPt == null){
        prevPt = curPt;
      }else{
        if(!curPt.jump){
          stroke(curPt.color);
          var strokeVar = strokeStartWeight - ((strokeStartWeight * (i / this.tail.length)) - 1);
          strokeWeight(strokeVar);
          // strokeWeight(strokeStartWeight);
          line(prevPt.x, prevPt.y, curPt.x, curPt.y);
        }
        prevPt = curPt;
      }
    }// end for loop that draws tail
  };//end show func
}//end snake class
