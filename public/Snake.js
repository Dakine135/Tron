function Snake(snakeName){
  this.name = snakeName;

  //starting position
  this.size = null;
  this.x = null;
  this.y = null;

  //tail and color stuff
  this.tail = [];
  this.startColor = null;
  this.endColor = null;

  this.scaleW = 1;
  this.scaleH = 1;

  this.scaleSnake = function(){
      this.scaleW = this.width / SETTINGS.WIDTH;
      this.scaleH = this.height / SETTINGS.HEIGHT;
  };

  //detects when keys are pressed and changes snakes direction
  this.checkControls = function(){
    var xdir = 0;
    var ydir = 0;
    var pressed = false;
    if (keyIsDown(UP_ARROW)){
      ydir--;
      pressed = true;
    }if (keyIsDown(DOWN_ARROW)) {
      ydir++;
      pressed = true;
    }if (keyIsDown(LEFT_ARROW)) {
      xdir--;
      pressed = true;
    }if (keyIsDown(RIGHT_ARROW)) {
      xdir++;
      pressed = true;
    }
    if(pressed) this.dir(xdir,ydir);
  };//END OF keyP FUNCTION


  this.dir = function(x, y) {
      SOCKET.changeSnakeDir(x, y);
  };

  this.update = function(snake) {

      //starting position
      this.size = snake.size;
      this.x = snake.x;
      this.y = snake.y;

      //tail and color stuff
      this.tail = snake.tail;
      this.startColor = color(snake.startColor[0],snake.startColor[1],snake.startColor[2]);
      this.endColor = color(snake.endColor[0],snake.endColor[1],snake.endColor[2]);

  };//end update


  this.show = function(){
    fill(this.startColor);
    stroke(this.endColor);
    strokeWeight(Math.ceil(this.size / 10));
    ellipse(this.x*this.scaleW, this.y*this.scaleH, this.size*this.scaleW, this.size*this.scaleH);

    var prevPt;
    var strokeStartWeight = this.size/3;
    for(var i=0; i<this.tail.length; i++){
      var curPt = this.tail[i];
      if(prevPt == null){
        prevPt = curPt;
      }else{
        if(!curPt.jump){
          var tailColor = color(curPt.color[0],curPt.color[1],curPt.color[2]);
          stroke(tailColor);
          var strokeVar = strokeStartWeight - ((strokeStartWeight * (i / this.tail.length)) - 1);
          strokeWeight(strokeVar);
          // strokeWeight(strokeStartWeight);
          line(prevPt.x*this.scaleW, prevPt.y*this.scaleH, curPt.x*this.scaleW, curPt.y*this.scaleH);
        }
        prevPt = curPt;
      }
    }// end for loop that draws tail
  };//end show func
}//end snake class
