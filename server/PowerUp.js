module.exports = PowerUp;
var LIB = require('./lib.js');
var CONFIG = require('./Config.js');
var GLOBALS = require('./Globals');
function PowerUp(){

    this.x = CONFIG.WIDTH;
    this.y = CONFIG.HEIGHT;
    this.type = " ";
    this.size = (CONFIG.GAMEGRIDSCALE/3);
    this.fillColor = [195, 73, 224];
    this.strokeColor = [195, 73, 224];
    //console.log("COLOR OF POWERUP "+this.color);


    this.spawn = function (){
      this.size = (CONFIG.GAMEGRIDSCALE/3);
        var widthCells = CONFIG.WIDTH / CONFIG.GAMEGRIDSCALE;
        var heightCells = CONFIG.HEIGHT / CONFIG.GAMEGRIDSCALE;
        //console.log("WHCells ", widthCells, heightCells);
        var randomRow = LIB.randomInt(0, heightCells);
        var randomCol = LIB.randomInt(0, widthCells);
        //console.log("random: ", randomRow, randomCol);
        var newXPos = (CONFIG.GAMEGRIDSCALE * randomCol) + (CONFIG.GAMEGRIDSCALE / 2)-(this.size/2);
        var newYPos = (CONFIG.GAMEGRIDSCALE * randomRow) + (CONFIG.GAMEGRIDSCALE / 2)-(this.size/2);
        //console.log("newXY: ", newXPos, newYPos);
        this.x = newXPos;
        this.y = newYPos;

            //random type
            var possibleTypes = ["Speed+","Speed-","Size+","Size-","Tail+","Tail-","Point+","Death"];
            var randIndex = Math.floor(Math.random()*possibleTypes.length);
            this.type = possibleTypes[randIndex];

            switch(this.type){
                case "Speed+":
                this.fillColor = [155, 244, 66];
                this.strokeColor = [255, 255, 255];
                    break;

                case "Speed-":
                this.fillColor = [244, 229, 65];
                this.strokeColor = [255, 255, 255];
                    break;

                case "Size+":
                this.fillColor = [65, 235, 244];
                this.strokeColor = [255, 255, 255];
                    break;

                case "Size-":
                this.fillColor = [0, 21, 99];
                this.strokeColor = [255, 255, 255];
                    break;

                case "Tail+":
                this.fillColor = [249, 0, 201];
                this.strokeColor = [255, 255, 255];
                    break;

                case "Tail-":
                this.fillColor = [99, 0, 80];
                this.strokeColor = [255, 255, 255];
                    break;

                case "Point+":
                this.fillColor = [249, 241, 1];
                this.strokeColor = [255, 255, 255];
                  break;

                case "Death":
                this.fillColor = [0, 0, 0];
                this.strokeColor = [188, 0, 0];
                this.size = (CONFIG.GAMEGRIDSCALE);
                  break;
            }//end PowerUpType

        console.log("Powerup Spawned:",this.type," ",this.x," ",this.y);

    };

    this.checkForCollisions = function(snake){
        if(snake.tail.length < 1) return null;
        var snakeHeadX = snake.x + (snake.xdir * (snake.size/2));
        var snakeHeadY = snake.y + (snake.ydir * (snake.size/2));
        var lineX2 = snake.tail[0].x;
        var lineY2 = snake.tail[0].y;
        var collision = LIB.collideLineRect(snakeHeadX, snakeHeadY, lineX2, lineY2, this.x, this.y, this.size, this.size);
        //console.log(collision);
        if (collision && collision.hit){
            this.applyEffect(snake);
            this.spawn();
        }
        return collision;
    };
    this.applyEffect = function(snake){
        console.log("HIT");
        switch(this.type){
            case "Speed+":
                snake.chngSpeed(2); //pixels per seconds
                 //this.text("Speed +", (50), (50));
                break;

            case "Speed-":
                snake.chngSpeed(-2);
                break;

            case "Size+":
                snake.chngSize(20);
                break;

            case "Size-":
                snake.chngSize(-20);
                break;

            case "Tail+":
                snake.chngTail(2);
                break;

            case "Tail-":
                snake.chngTail(-2);
                break;

            case "Point+":
                //add point to client
                break;

            case "Death":
                snake.reset();
                //subtract point from client

                break;
        }//end PowerUpType
    };//End of applyEffect

    this.package = function(){
        var package = {
            x: Math.round(this.x),
            y: Math.round(this.y),
            type: this.type,
            size: Math.round(this.size),
            fillColor: this.fillColor,
            strokeColor: this.strokeColor
        };
        return package;
    }

}//End of PowerUp
