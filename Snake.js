function Snake(snakeName, upButton,downButton,leftButton,rightButton, startColor, endColor){
  this.name = snakeName;

  //starting position
  this.size = 10;
  this.x = width/2 - (this.size/2);
  this.y = height/2 - (this.size/2);
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
  this.speedScale = 3;

  //tail and color stuff
  this.tail = [];
  this.tailColors = [];
  this.currentColor = 0;
  this.startColor = startColor;
  this.endColor = endColor;
  this.colorDirection = true;
  this.currTailLength = 0; //length in pixels
  this.maxTailLength = 1000;
  this.maxSegmentDist = this.maxTailLength / 50;

  //stuff for pausing
  this.paused = false;
  this.lastX = this.xdir;
  this.lastY = this.ydir;
  this.lastSpeedScale = this.speedScale;

  //detects when keys are pressed and changes snakes direction
  this.checkControls = function(){
    var xdir = 0;
    var ydir = 0;
    var pressed = false;
    if (keyIsDown(this.upButton)){
      ydir--;
      pressed = true;
    }if (keyIsDown(this.downButton)) {
      ydir++;
      pressed = true;
    }if (keyIsDown(this.leftButton)) {
      xdir--;
      pressed = true;
    }if (keyIsDown(this.rightButton)) {
      xdir++;
      pressed = true;
    }
    if(pressed) this.dir(xdir,ydir);
  }//END OF keyP FUNCTION

  this.intializeTailColor = function(){
    var steps = 100;
    var redDiff = this.endColor.levels[0] - this.startColor.levels[0];
    var greenDiff = this.endColor.levels[1] - this.startColor.levels[1];
    var BlueDiff = this.endColor.levels[2] - this.startColor.levels[2];

    for(var i=0; i<steps; i++){
      var currRed = this.startColor.levels[0] + (redDiff * (i/steps));
      var currGreen = this.startColor.levels[1] + (greenDiff * (i/steps));
      var currBlue = this.startColor.levels[2] + (BlueDiff * (i/steps));
      this.tailColors[i] = color(currRed, currGreen, currBlue);
    }
  }

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

    //this.tail.unshift(this.createPreviousPosition(this.x,this.y,false));
    //console.log("Direction: ", this.xspeed,":",this.yspeed, " ==> ", this.direction);
  }

  this.newSegment = function(prevPos){
    if(this.tail.length <= 1) return true;
    if(this.tail.length > 0){
       if(this.tail[0].dist > this.maxSegmentDist) return true;
       if(this.tail[0].dir != prevPos.dir) return true;
       if(this.tail[0].jump) return true;
     }
    return false;
  }

  //currently just for turning and jumping
  this.createPreviousPosition = function(x,y,jump){
    //console.log("---------calling function createPreviousPosition(",x,",",y,",",jump,")");
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
      dir: this.direction
    };

    this.currTailLength = this.currTailLength + distance;
    while(this.currTailLength > this.maxTailLength){ //remove to meet length restriction
      var removedPoint = this.tail.pop();
      this.currTailLength = this.currTailLength - removedPoint.dist;
    }

    //updateTail with new previousPosition
    var newSegment = this.newSegment(previousPosition);
    if(newSegment){
      this.tail.unshift(previousPosition);
      if(this.currentColor == 0) this.colorDirection = true;
      else if(this.currentColor == (this.tailColors.length - 1)) this.colorDirection = false;
      if(this.colorDirection) this.currentColor++;
      else this.currentColor--;
    }
    else{
      this.tail[0].x = previousPosition.x;
      this.tail[0].y = previousPosition.y;
      this.tail[0].dist = this.tail[0].dist + previousPosition.dist;
      this.tail[0].jump = previousPosition.jump;
    }

  }//end createPreviousPosition

  this.update = function() {
    var nextX = Math.floor(this.x + this.xspeed);
    var nextY = Math.floor(this.y + this.yspeed);

    if(nextX == this.x && nextY == this.y){
      // dont change tail if you havent moved
      return;
    }
    //var dist = Math.round(Math.sqrt(Math.pow((nextX-this.x), 2)+Math.pow((nextY-this.y), 2)));

    //Wall wrapping code
    var leftWall = -1;
    var rightWall = width + 1;
    var topWall = -1;
    var bottomWall = height + 1;
    if (this.x >= rightWall){ //right wall
      this.createPreviousPosition(this.x,this.y,true);
      this.x = 0;
      return;
    }else if (this.x <= leftWall){ //left wall
      this.createPreviousPosition(this.x,this.y,true);
      this.x = width;
      return;
    }else if (this.y >= bottomWall){ //bottom wall
      this.createPreviousPosition(this.x,this.y,true);
      this.y = 0;
      return;
    }else if (this.y <= topWall){ //top wall
      this.createPreviousPosition(this.x,this.y,true);
      this.y = height;
      return;
    }

    this.createPreviousPosition(this.x,this.y,false);

    this.x = nextX;
    this.y = nextY;

    // console.log("dist / currTailLength: ", this.currTailLength, " / ", this.tail.length);

  }//end update

  //increase or decrease tail length
  this.chngTail = function(input){
    this.maxTailLength = this.maxTailLength + input;
    this.maxSegmentDist = this.maxTailLength / 20;
  }

  //increase or decrease size of snake
  this.chngSize = function(input){
    this.size = this.size + input;
  }

  //change increment multiplier for snakes speed up or down
  this.chngSpeed = function(input) {
    if ((s.speedScale + input) > 0){
      s.speedScale = Math.round(s.speedScale + input);
      s.dir(s.xdir,s.ydir);
    } else {
      console.log("cannot reduce speed");
    }
  }//END OF chngSpeed FUNCTION

  //takes a index to cut at
  this.cutTail = function(index){
    this.tail = this.tail.slice(0,index);
    this.currTailLength = 0;
    for(var i=0; i<this.tail.length; i++){
      this.currTailLength = this.currTailLength + this.tail[i].dist;
    }
  }

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
  }

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
	  this.maxTailLength = 1000;
    this.size = 10;
    this.speedScale = 3;
  }//end reset

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
  }

  //returns the index of the tail that you collided width
  //returns -1 if did not collide
  this.checkCollisionWithTail = function(tailInput){
    var tailIndex = 1;
    while(tailIndex < (tailInput.length - 1)){
      //collideLineCircle(x1, y1, x2, y2, cx, cy, diameter)
      //collidePointLine(pointX, pointY, x, y, x2, y2, [buffer])
      var lineStartX = tailInput[tailIndex].x;
      var lineStartY = tailInput[tailIndex].y;
      var lineEndX = tailInput[tailIndex + 1].x;
      var lineEndY = tailInput[tailIndex + 1].y;
      var hit = collidePointLine(this.x, this.y, lineStartX, lineStartY, lineEndX, lineEndY, 0.5)
      // var hit = collideLineCircle(lineStartX, lineStartY, lineEndX, lineEndY, this.x, this.y, this.size);
      //console.log("hit: ", hit);
      if(hit) return tailIndex + 1;
      tailIndex++;
    }
    return -1;
  }

  this.show = function(){
    fill(this.startColor);
    stroke(this.endColor);
    ellipse(this.x, this.y, this.size, this.size);

    var prevPt;
    var strokeStartWeight = this.size/3;
    for(var i=0; i < (this.tail.length-1); i++){
      var curPt = this.tail[i];
      if(prevPt == null){
        prevPt = curPt;
      }else{
        if(!prevPt.jump){
          stroke(curPt.color);
          var strokeVar = strokeStartWeight - ((strokeStartWeight * (i / this.tail.length)) - 1);
          strokeWeight(strokeVar);
          // strokeWeight(strokeStartWeight);
          line(prevPt.x, prevPt.y, curPt.x, curPt.y);
        }
        prevPt = curPt;
      }
    }// end for loop that draws tail
  }//end show func
}//end snake class
