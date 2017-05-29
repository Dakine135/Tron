function Snake(){
  this.x = 300;
  this.y = 300;
  this.xdir = 0;
  this.ydir = 0;
  this.xspeed = 0;
  this.yspeed = 0;
  this.color = color(255,255,255);
  this.tail = [];
  this.tailColors = [];
  this.currentColor = 0;
  this.startColor = [0, 0, 204];
  this.endColor = [102, 255, 255];
  this.colorDirection = true;
  this.currTailLength = 0; //length in pixels
  this.maxTailLength = 1000;

  this.intializeTailColor = function(){
    var steps = 100;
    var redDiff = this.endColor[0] - this.startColor[0];
    var greenDiff = this.endColor[1] - this.startColor[1];
    var BlueDiff = this.endColor[2] - this.startColor[2];

    for(var i=0; i<steps; i++){
      var currRed = this.startColor[0] + (redDiff * (i/steps));
      var currGreen = this.startColor[1] + (greenDiff * (i/steps));
      var currBlue = this.startColor[2] + (BlueDiff * (i/steps));
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

    console.log("dist / currTailLength: ", this.currTailLength, " / ", this.tail.length);

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
  }

  this.show = function(){
    fill(this.startColor[0], this.startColor[1], this.startColor[2]); //used to be this.color
    stroke(this.endColor[0], this.endColor[1], this.endColor[2]);
    ellipse(this.x, this.y, scl,scl);

    var prevPt;
    for(var i=0; i < this.tail.length; i++){
      var curPt = this.tail[i];
      if(prevPt == null){
        prevPt = curPt;
      }else{
        if(!curPt.jump){
          stroke(curPt.color);
          line(prevPt.x, prevPt.y, curPt.x, curPt.y);

        }

        prevPt = curPt;
      }
    }// end for loop
  }//end show func
}//end snake class
