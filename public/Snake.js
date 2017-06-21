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
      this.x = Math.round((this.x / SETTINGS.WIDTH) * BOARD.cameraWidth);
      this.y = Math.round((this.y / SETTINGS.HEIGHT) * BOARD.cameraHeight);
      //this.size = Math.round((this.size / SETTINGS.WIDTH)*width);
      this.tail.map(function(prevPoint){
        var scaled = prevPoint;
        scaled.x = Math.round((scaled.x / SETTINGS.WIDTH) * BOARD.cameraWidth);
        scaled.y = Math.round((scaled.y / SETTINGS.HEIGHT) * BOARD.cameraHeight);
        return scaled;
      });
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

      this.scaleSnake();

  };//end update


  this.show = function(width, height){
    if(width == null || height == null){
      width = 0;
      height = 0;
    }
    fill(this.startColor);
    stroke(this.endColor);
    strokeWeight(Math.ceil(this.size / 10));
    ellipse(this.x + width, this.y + height, this.size, this.size);

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
          line(prevPt.x + width, prevPt.y + height, curPt.x + width, curPt.y + height);
        }
        prevPt = curPt;
      }
    }// end for loop that draws tail
  };//end show func
}//end snake class
