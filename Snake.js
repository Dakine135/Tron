function Snake(){
  this.x = 300;
  this.y = 300;
  this.xdir = 0;
  this.ydir = 0;
  this.xspeed = 0;
  this.yspeed = 0;
  this.color = color(255,255,255);
  this.trail = [];
  this.tailColors = [];

  this.intializeTailColor = function(){
    for(var n = 0; n < 100; n++) {
        if(n < 100/3) {
            this.tailColors[n] = color(255, 255/(n+1), 255/(n+1));
        } else if(n < 2*100/3) {
            this.tailColors[n] = color(255/(n-(100/3)), 255, 255/(n-(100/3)));
        } else {
            this.tailColors[n] = color(255/(n+1), 255/(n+1), 255);
        }
    }
  }

  this.dir = function(x, y) {
    this.xdir = x;
    this.ydir = y;
    this.xspeed = x*speed;
    this.yspeed = y*speed;
  }
  this.update = function() {
    var previousPosition = {
      x: this.x,
      y: this.y,
      jump: false
    };
    if(this.trail.length < 200){
      this.trail.unshift(previousPosition);
    } else{
      this.trail.pop();
      this.trail.unshift(previousPosition);
    }
    //console.log(this.trail);

    this.x = Math.floor(this.x +this.xspeed*(scl/2));
    this.y = Math.floor(this.y +this.yspeed*(scl/2));

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
    fill(this.color);
    stroke(0, 0, 0);
    ellipse(this.x, this.y, scl,scl);

    var prevPt;
    for(var i=0; i < this.trail.length; i++){
      var curPt = this.trail[i];
      if(prevPt == null){
        prevPt = curPt;
      }else{
        if(!curPt.jump){
          stroke(255, 204, 0);
          line(prevPt.x, prevPt.y, curPt.x, curPt.y);

        }

        prevPt = curPt;
      }
    }// end for loop
  }//end show func
}//end snake class
