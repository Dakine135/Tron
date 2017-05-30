function Snake(){
  //starting position
  this.x = width/2 - (scl/2);
  this.y = height/2 - (scl/2);

  //starting direction and speed
  this.xdir = 0;
  this.ydir = 0;
  this.xspeed = 0;
  this.yspeed = 0;

  //tail and color stuff
  this.tail = [];
  this.tailColors = [];
  this.currentColor = 0;
  this.startColor = color(0, 0, 204);
  this.endColor = color(102, 255, 255);
  this.colorDirection = true;
  this.currTailLength = 0; //length in pixels
  this.maxTailLength = 1000;

  //stuff for pausing
  this.paused = false;
  this.lastX= this.xdir;
  this.lastY= this.ydir;
  //this.lastSpeed = speed;


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
    this.xspeed = x*speed;
    this.yspeed = y*speed;
  }

  this.update = function() {
    var currX = Math.floor(this.x +this.xspeed*(scl/2));
    var currY = Math.floor(this.y +this.yspeed*(scl/2));

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

    if (this.x >= (width - scl + 1)){ //right wall
      this.x = 0;
      previousPosition.jump = true;
    }else if (this.x <= -1){ //left wall
      this.x = width-scl;
        previousPosition.jump = true;
    }else if (this.y >= height -scl + 1){ //bottom wall
      this.y = 0;
        previousPosition.jump = true;
    }else if (this.y <= -1){ //top wall
      this.y = height-scl;
        previousPosition.jump = true;
    }
  }//end update

  //reset to defualt (refresh)
  this.reset = function() {
    this.x = width/2;
	  this.y = height/2;
	  this.xspeed = 0;
	  this.yspeed = 0;
	  this.tail = [];
	  this.currentColor = 0;
	  this.startColor = color(0, 0, 204);
	  this.endColor = color(102, 255, 255);
	  this.intializeTailColor();
	  this.colorDirection = true;
	  this.currTailLength = 0; //length in pixels
	  this.maxTailLength = 1000;
  }//end reset

  this.pause = function(){
    if(this.paused){
      this.paused = false;

    }else{
      this.paused = true;
      this.lastX= this.xdir;
      this.lastY= this.ydir;
      //this.lastSpeed = speed;
      //this.speed = 0;
      this.dir(0, 0);
    }
  }

  this.show = function(){
    fill(this.startColor);
    stroke(this.endColor);
    ellipse(this.x, this.y, scl,scl);

    var prevPt;
    var strokeStartWeight = scl/3;
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
