module.exports = CPUsnake;
var LIB = require('./lib.js');
var CONFIG = require('./Config.js');
var GLOBALS = require('./Globals');

function CPUsnake(snakeName, numOfMovements) {
    //console.log("createCPUsnake: ", snakeName);
    this.name = snakeName;

    //starting position
    this.size = CONFIG.snakeDefaults.SNAKESIZE/2;
    var widthCells = CONFIG.WIDTH / CONFIG.GAMEGRIDSCALE;
    var heightCells = CONFIG.HEIGHT / CONFIG.GAMEGRIDSCALE;
    var rowNum = Math.floor(heightCells*(1/4));
    var colNum = Math.floor(widthCells*(1/4));
    this.x = (CONFIG.GAMEGRIDSCALE * colNum) + (CONFIG.GAMEGRIDSCALE / 2);
    this.y = (CONFIG.GAMEGRIDSCALE * rowNum) + (CONFIG.GAMEGRIDSCALE / 2);
    this.direction = "Stopped";

    //ai stuff
    this.movement = [];
    this.numOfMovements = numOfMovements;
    this.currentMovement = 0;
    this.triggerDir = 0;
    this.score = 0;
    this.crashed = false;
    this.madeItToGoal = -1;
    this.stoppedAtMovementIndex = numOfMovements-1;

    //starting direction and speed
    this.xdir = 0;
    this.ydir = 0;
    //speedscale is pixels per second
    this.speedScale = CONFIG.snakeDefaults.SNAKESPEEDSCALE;

    //tail and color stuff
    this.tail = [];
    this.tailColors = [];
    this.currentColor = 0;
    this.startColor = [0,0,0];
    this.endColor = [255,255,255];
    this.colorDirection = true;
    this.currTailLength = 0; //length in pixels
    this.maxTailLength = 15;
    this.maxSegmentDist = this.maxTailLength / 40;

    this.intializeTailColor = function(){
        var steps = 100;
        var redDiff = this.endColor[0] - this.startColor[0];
        var greenDiff = this.endColor[1] - this.startColor[1];
        var BlueDiff = this.endColor[2] - this.startColor[2];

        for(var i=0; i<steps; i++){
            var currRed = this.startColor[0] + (redDiff * (i/steps));
            var currGreen = this.startColor[1] + (greenDiff * (i/steps));
            var currBlue = this.startColor[2] + (BlueDiff * (i/steps));
            this.tailColors[i] = [currRed, currGreen, currBlue];
        }
    };

    this.initalizeMovement = function(){
        for(var i=0; i < this.numOfMovements; i++){
            var tempDir = {
                x: LIB.randomInt(-1,2),
                y: LIB.randomInt(-1,2),
                noChange: LIB.randomInt(0,101)
            };
            this.movement[i] = tempDir;
        }
    };


    this.spawn = function(){
        var widthCells = CONFIG.WIDTH / CONFIG.GAMEGRIDSCALE;
        var heightCells = CONFIG.HEIGHT / CONFIG.GAMEGRIDSCALE;
        var randomRow = LIB.randomInt(0, heightCells);
        var randomCol = LIB.randomInt(0, widthCells);
        var newXPos = (CONFIG.GAMEGRIDSCALE * randomCol) + (CONFIG.GAMEGRIDSCALE / 2);
        var newYPos = (CONFIG.GAMEGRIDSCALE * randomRow) + (CONFIG.GAMEGRIDSCALE / 2);
        //console.log("spawn: ", newXPos, newYPos);
        //this.createPreviousPosition(this.x, this.y, true, false);
        this.x = newXPos;
        this.y = newYPos;
        this.createPreviousPosition(this.x, this.y, false, true);
        this.dir(0, 0, true);
    };//end spawn

    this.dir = function(x, y, spawn) {
        var undo = {
            xdir: this.xdir,
            ydir: this.ydir,
            direction: this.direction
        };
        this.xdir = x;
        this.ydir = y;

        if(this.xdir == 0 && this.ydir == 0) this.direction = "Stopped";
        else if(this.xdir == 0 && this.ydir < 0) this.direction = "N";
        else if(this.xdir > 0 && this.ydir < 0) this.direction = "NE";
        else if(this.xdir > 0 && this.ydir == 0) this.direction = "E";
        else if(this.xdir > 0 && this.ydir > 0) this.direction = "SE";
        else if(this.xdir == 0 && this.ydir > 0) this.direction = "S";
        else if(this.xdir < 0 && this.ydir > 0) this.direction = "SW";
        else if(this.xdir < 0 && this.ydir == 0) this.direction = "W";
        else if(this.xdir < 0 && this.ydir < 0) this.direction = "NW";
        else console.log("ERROR in DIRECTION");

        //if you try to move the opposite direction or stop, then undo
        var triggerUndo = false;
        if(this.direction == "Stopped" && !spawn) triggerUndo = true;
        else if(this.direction == "N" && undo.direction == "S") triggerUndo = true;
        else if(this.direction == "S" && undo.direction == "N") triggerUndo = true;
        else if(this.direction == "E" && undo.direction == "W") triggerUndo = true;
        else if(this.direction == "W" && undo.direction == "E") triggerUndo = true;
        else if(this.direction == "NE" && undo.direction == "SW") triggerUndo = true;
        else if(this.direction == "SE" && undo.direction == "NW") triggerUndo = true;
        else if(this.direction == "SW" && undo.direction == "NE") triggerUndo = true;
        else if(this.direction == "NW" && undo.direction == "SE") triggerUndo = true;

        if(triggerUndo){
            this.xdir = undo.xdir;
            this.ydir = undo.ydir;
            this.direction = undo.direction;
        }

        if(this.direction != "Stopped") this.createPreviousPosition(this.x,this.y,false,true);
    };

    //currently just for turning and jumping
    this.createPreviousPosition = function(x,y,jump,newSegment){
        // console.log("---------calling function createPreviousPosition(",x,",",y,",",jump,",",newSegment,")");
        var distance = 0;
        if(this.tail.length>0 && !this.tail[0].jump){
            var prevX = this.tail[0].x;
            var prevY = this.tail[0].y;
            distance = LIB.dist(x,y,prevX,prevY);
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
            this.tail[0].dir === previousPosition.dir) combine = true;

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
            if(this.currentColor === 0) this.colorDirection = true;
            else if(this.currentColor === (this.tailColors.length - 1)) this.colorDirection = false;
            if(this.colorDirection) this.currentColor++;
            else this.currentColor--;
        }

    };//end createPreviousPosition

    this.update = function(currentLifespanTick) {
        //console.log("currentLifespanTick: ", currentLifespanTick);
        if(this.currentMovement < this.movement.length &&
                this.triggerDir == 0 && this.madeItToGoal < 0 && !this.crashed) {
            if(this.movement[this.currentMovement].noChange < 90){
                //dont change direction
            }
            else{
                this.dir(this.movement[this.currentMovement].x, this.movement[this.currentMovement].y, false);
            }
            this.currentMovement++;
            this.triggerDir = 1;

        } else {
            if(this.currentMovement >= this.movement.length || this.madeItToGoal > 0 || this.crashed){
                this.xdir = 0;
                this.ydir = 0;
                this.triggerDir = 10;
            }else{
                this.triggerDir--;
            }
        }


        var seconds = GLOBALS.CURRENTGAMESTATE.deltaTime / 1000;
        var distX = this.xdir * (seconds * this.speedScale);
        var distY = this.ydir * (seconds * this.speedScale);
        var nextX = Math.round((this.x + distX) * 100) / 100;
        var nextY = Math.round((this.y + distY) * 100) / 100;

        if (nextX === this.x && nextY === this.y) {
            // dont change tail if you havent moved
            return;
        }

        //Wall wrapping code
        var leftWall = -1;
        var rightWall = CONFIG.WIDTH + 1;
        var topWall = -1;
        var bottomWall = CONFIG.HEIGHT + 1;
        if (this.x >= rightWall) { //right wall
            this.createPreviousPosition(this.x, this.y, true, false);
            this.x = 0;
            this.createPreviousPosition(this.x, this.y, false, true);
            return;
        } else if (this.x <= leftWall) { //left wall
            this.createPreviousPosition(this.x, this.y, true, false);
            this.x = CONFIG.WIDTH;
            this.createPreviousPosition(this.x, this.y, false, true);
            return;
        } else if (this.y >= bottomWall) { //bottom wall
            this.createPreviousPosition(this.x, this.y, true, false);
            this.y = 0;
            this.createPreviousPosition(this.x, this.y, false, true);
            return;
        } else if (this.y <= topWall) { //top wall
            this.createPreviousPosition(this.x, this.y, true, false);
            this.y = CONFIG.HEIGHT;
            this.createPreviousPosition(this.x, this.y, false, true);
            return;
        }

        this.createPreviousPosition(this.x, this.y, false, false);

        this.x = nextX;
        this.y = nextY;

        this.checkIfAtGoal(currentLifespanTick);


    };//end update


    //change snake's color to random colors
    this.chngColorRandom = function(){
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

        this.startColor = [startRed,startGreen,startBlue];
        this.endColor = [r,g,b];
        this.intializeTailColor();
    };

    this.breed = function(snake1, snake2, bestScore){
        var midpoint = LIB.randomInt(0,numOfMovements);
        //var avgScoreOfParents = Math.round((snake1.score + snake2.score)/2);
        //chance between 1 and 5 percent depending on parents score compared to best
        //var chance = 5 - (Math.floor(4*(avgScoreOfParents/bestScore)));
        var chance = 1;
       // console.log(chance, " => ", avgScoreOfParents);
        var numOfMutations = 0;
      for(var i=0; i < numOfMovements; i++){
          if(i < midpoint) this.movement[i] = snake1.movement[i];
          else this.movement[i] = snake2.movement[i];

          var r = LIB.randomInt(1,101); //between 1-100
          if(r <= chance){
              numOfMutations++;
              this.movement[i] = {
                  x: LIB.randomInt(-1,2),
                  y: LIB.randomInt(-1,2),
                  noChange: LIB.randomInt(0,101)
              };
          }
      }
      //console.log(numOfMutations, " num of Mutations");
    };

    this.calculateScore = function(){
        var goal = GLOBALS.GENETICLEARNING.snakeGoal;
        this.score = (1 / (LIB.dist(this.x, this.y, goal.x, goal.y)+1))*1000;
        //console.log("inital: ", this.score);
        if(this.madeItToGoal > 0){
            var multiplier = Math.round(100*(1/this.madeItToGoal)*100)/100;
            //console.log("multiplier: ", multiplier, "madeItToGoal: ", this.madeItToGoal);
            this.score = this.score + (this.score * multiplier);
        }
        if(this.crashed) this.score = this.score * 0.5;
        this.score = Math.round(Math.pow(this.score, 2)*10)/10;
        //console.log("final: ", this.score);
    };

    //reset to default (refresh)
    this.reset = function() {
        //reset values
        this.tail = [];
        this.currTailLength = 0;
        var widthCells = CONFIG.WIDTH / CONFIG.GAMEGRIDSCALE;
        var heightCells = CONFIG.HEIGHT / CONFIG.GAMEGRIDSCALE;
        var rowNum = Math.floor(heightCells*(1/4));
        var colNum = Math.floor(widthCells*(1/4));
        this.x = (CONFIG.GAMEGRIDSCALE * colNum) + (CONFIG.GAMEGRIDSCALE / 2);
        this.y = (CONFIG.GAMEGRIDSCALE * rowNum) + (CONFIG.GAMEGRIDSCALE / 2);
        this.direction = "Stopped";
        this.xdir = 0;
        this.ydir = 0;
        this.currentMovement = 0;
        this.triggerDir = 0;
        //this.intializeTailColor();

    };//end reset

    this.checkIfAtGoal = function(currentLifespanTick){
        var snakeStartX = this.x;
        var snakeStartY = this.y;
        var snakeEndX = this.tail[0].x;
        var snakeEndY = this.tail[0].y;

        var goalX = GLOBALS.GENETICLEARNING.snakeGoal.x;
        var goalY = GLOBALS.GENETICLEARNING.snakeGoal.y;
        var goalSize = GLOBALS.GENETICLEARNING.snakeGoal.size;

        var collision = LIB.collideLineRect(snakeStartX, snakeStartY, snakeEndX, snakeEndY,
            goalX, goalY, goalSize, goalSize);

        if(collision && collision.hit){
            this.madeItToGoal = currentLifespanTick;
            //console.log("this.madeItToGoal: ", this.madeItToGoal);
        }
    };


    // //returns the index of the tail that you collided width
    // //and the location on the grid
    // this.checkCollisionWithTail = function(snake){
    //     var tailInput = snake.tail;
    //     var tailIndex = 0;
    //     if(snake.name == this.name) tailIndex = 4;
    //     var lineStartX;
    //     var lineStartY;
    //     var lineEndX;
    //     var lineEndY;
    //     var collision;
    //     if(this.tail.length < 1) return null;
    //     var snakeLineX = this.tail[0].x;
    //     var snakeLineY = this.tail[0].y;
    //     //adjust snake "current position" to extend to the tip, from center and previous point
    //     var snakeHeadX = this.x + (this.xdir * (this.size/2));
    //     var snakeHeadY = this.y + (this.ydir * (this.size/2));
    //
    //     //make another line the width of the head and check collision
    //     // var snakeWidthX1
    //     // var snakeWidthY1
    //     // var snakeWidthX2
    //     // var snakeWidthY2
    //     //console.log("start => extended: ", this.x, this.y, " => ", snakeHeadX, snakeHeadY);
    //     while(tailIndex < (tailInput.length - 1)){
    //         if(!tailInput[tailIndex + 1].jump){
    //             lineStartX = tailInput[tailIndex].x;
    //             lineStartY = tailInput[tailIndex].y;
    //             lineEndX = tailInput[tailIndex + 1].x;
    //             lineEndY = tailInput[tailIndex + 1].y;
    //             collision = LIB.collideLineLine(snakeHeadX, snakeHeadY, snakeLineX, snakeLineY,
    //                 lineStartX,lineStartY,lineEndX,lineEndY);
    //         }
    //         //console.log("hit: ", hit);
    //         if(collision && collision.hit){
    //             collision["tail"] = tailIndex + 1;
    //             return collision;
    //         }
    //         tailIndex++;
    //     }
    //     return null;
    // };

    this.package = function(){
        var packagedSnake = {
            name: this.name,
            size: this.size,
            x: this.x,
            y: this.y,
            xdir: this.xdir,
            ydir: this.ydir,
            speedScale: this.speedScale,
            tail: this.tail,
            startColor: this.startColor,
            endColor: this.endColor
        };
        return packagedSnake;
    };

}