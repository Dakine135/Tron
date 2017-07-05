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
        this.x = (this.x / SETTINGS.WIDTH) * BOARD.cameraWidth;
        this.y = (this.y / SETTINGS.HEIGHT) * BOARD.cameraHeight;
        this.size = (this.size / SETTINGS.WIDTH) * BOARD.cameraWidth;
        this.tail.map(function(prevPoint){
            var scaled = prevPoint;
            scaled.x = (scaled.x / SETTINGS.WIDTH) * BOARD.cameraWidth;
            scaled.y = (scaled.y / SETTINGS.HEIGHT) * BOARD.cameraHeight;
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

        if(snake) {
            //console.log("server update Snake BEFORE: ", this.x, this.y, this.speedScale);
            this.size = snake.size;
            this.x = snake.x;
            this.y = snake.y;
            this.xdir = snake.xdir;
            this.ydir = snake.ydir;
            this.speedScale = Math.round((snake.speedScale / SETTINGS.HEIGHT) * BOARD.cameraHeight);

            //tail and color stuff
            this.tail = snake.tail;
            this.startColor = color(snake.startColor[0], snake.startColor[1], snake.startColor[2]);
            this.endColor = color(snake.endColor[0], snake.endColor[1], snake.endColor[2]);

            //console.log("server update Snake AFTER: ", this.x, this.y, this.speedScale);

            this.scaleSnake();

        } else {
            // //simulate moving straight
            // //console.log("simulate BEFORE: ", this.x, this.y, this.speedScale);
            // var seconds = DELTATIME/1000;
            // //console.log("seconds: ", seconds);
            // //console.log("dirXY: ", this.xdir, this.ydir);
            // var distX = this.xdir * (seconds * this.speedScale);
            // var distY = this.ydir * (seconds * this.speedScale);
            // //console.log("distXY: ", distX, distY);
            // var nextX = Math.round((this.x + distX)*100)/100;
            // var nextY = Math.round((this.y + distY)*100)/100;
            //
            // this.x = nextX;
            // this.y = nextY;
            //
            // this.tail[0].x = this.x;
            // this.tail[0].y = this.y;
            // //console.log("simulate AFTER: ", this.x, this.y, this.speedScale);
        }

    };//end update


    this.show = function(width, height){
        if(width == null || height == null){
            width = 0;
            height = 0;
        }
        fill(this.startColor);
        stroke(this.endColor);
        strokeWeight(Math.ceil(this.size / 15)+1);
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
