function Snake(){
  //starting position
  this.size = 10;
  this.x = width/2 - (this.size/2);
  this.y = height/2 - (this.size/2);

  //controls
  this.upButton;
  this.downButton;
  this.leftButton;
  this.rightButton;

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
  this.startColor = color(194, 254, 34);
  this.endColor = color(235, 29, 99);
  this.colorDirection = true;
  this.currTailLength = 0; //length in pixels
  this.maxTailLength = 1000;

  //stuff for pausing
  this.paused = false;
  this.lastX = this.xdir;
  this.lastY = this.ydir;
  this.lastSpeedScale = this.speedScale;

  this.setControls = function(upButton,downButton,leftButton,rightButton){
    this.upButton = upButton;
    this.downButton = downButton;
    this.leftButton = leftButton;
    this.rightButton = rightButton;
  }

  //detects when keys are pressed and changes snakes direction
  this.checkControls = function(){
    var xdir = 0;
    var ydir = 0;
    if (keyIsDown(this.upButton)){
      //s.dir(0, -1);
      ydir--;
    }if (keyIsDown(this.downButton)) {
      //s.dir(0, 1);
      ydir++;
    }if (keyIsDown(this.leftButton)) {
      //s.dir(-1, 0);
      xdir--;
    }if (keyIsDown(this.rightButton)) {
      //s.dir(1, 0);
      xdir++;
    }
    // if(Math.abs(xdir) == 1 && Math.abs(ydir) == 1 ){
    //   console.log(xdir, " ", ydir);
    //   if(xdir > 0) xdir = 0.7;
    //   else xdir = -0.7;
    //   if(ydir > 0) ydir = 0.7;
    //   else ydir = -0.7;
    //   console.log("=> ",xdir, " ", ydir);
    // }
    this.dir(xdir,ydir);
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
  }

  this.update = function() {
    var currX = Math.floor(this.x + this.xspeed);
    var currY = Math.floor(this.y + this.yspeed);

    if(currX != this.x || currY != this.y){ // dont change tail if you havent moved
      var dist = Math.sqrt(Math.pow((currX-this.x), 2)+Math.pow((currY-this.y), 2));
      var previousPosition = {
        x: this.x,
        y: this.y,
        jump: false,
        dist: dist,
        color: this.tailColors[this.currentColor]
      };
      this.currTailLength = this.currTailLength + dist;

      if(this.currentColor == 0) this.colorDirection = true;
      else if(this.currentColor == (this.tailColors.length - 1)) this.colorDirection = false;

      if(this.colorDirection) this.currentColor++;
      else this.currentColor--;

      if(this.currTailLength < this.maxTailLength){
        this.tail.unshift(previousPosition);
      } else{
        while(this.currTailLength > this.maxTailLength){
          var removedPoint = this.tail.pop();
          this.currTailLength = this.currTailLength - removedPoint.dist;
        }
        this.tail.unshift(previousPosition);
      }
    }

    // console.log("dist / currTailLength: ", this.currTailLength, " / ", this.tail.length);

    this.x = currX;
    this.y = currY;

    //Wall wrapping code
    var leftWall = -1;
    var rightWall = width + 1;
    var topWall = -1;
    var bottomWall = height + 1;
    if (this.x >= rightWall){ //right wall
      this.x = 0;
      previousPosition.jump = true;
    }else if (this.x <= leftWall){ //left wall
      this.x = width - this.size;
        previousPosition.jump = true;
    }else if (this.y >= bottomWall){ //bottom wall
      this.y = 0;
        previousPosition.jump = true;
    }else if (this.y <= topWall){ //top wall
      this.y = height - this.size;
        previousPosition.jump = true;
    }
  }//end update

  //increase or decrease tail length
  this.chngTail = function(input){
    this.maxTailLength = this.maxTailLength + input;
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
	  this.startColor = color(194, 254, 34);
	  this.endColor = color(235, 29, 99);
	  this.intializeTailColor();
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

  this.show = function(){
    fill(this.startColor);
    stroke(this.endColor);
    ellipse(this.x, this.y, this.size, this.size);

    var prevPt;
    var strokeStartWeight = this.size/3;
    for(var i=0; i < this.tail.length; i++){
      var curPt = this.tail[i];
      if(prevPt == null){
        prevPt = curPt;
      }else{
        if(!curPt.jump){
          stroke(curPt.color);
          var strokeVar = strokeStartWeight - ((strokeStartWeight * (i / this.tail.length)) - 1);
          strokeWeight(strokeVar);
          line(prevPt.x, prevPt.y, curPt.x, curPt.y);

        }

        prevPt = curPt;
      }
    }// end for loop
  }//end show func
}//end snake class
