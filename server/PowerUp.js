module.exports = PowerUp;
var LIB = require('./lib.js');
var CONFIG = require('./Config.js');
var GLOBALS = require('./Globals');
function PowerUp(){

    this.x = CONFIG.WIDTH;
    this.y = CONFIG.HEIGHT;
    this.type = " ";
    this.size = (CONFIG.GAMEGRIDSCALE/3);

    this.spawn = function (){
        var widthCells = CONFIG.WIDTH / CONFIG.GAMEGRIDSCALE;
        var heightCells = CONFIG.HEIGHT / CONFIG.GAMEGRIDSCALE;
        console.log("WHCells ", widthCells, heightCells);
        var randomRow = LIB.randomInt(0, heightCells);
        var randomCol = LIB.randomInt(0, widthCells);
        console.log("random: ", randomRow, randomCol);
        var newXPos = (CONFIG.GAMEGRIDSCALE * randomCol) + (CONFIG.GAMEGRIDSCALE / 2)-(this.size/2);
        var newYPos = (CONFIG.GAMEGRIDSCALE * randomRow) + (CONFIG.GAMEGRIDSCALE / 2)-(this.size/2);
        console.log("newXY: ", newXPos, newYPos);
        this.x = newXPos;
        this.y = newYPos;

        //random type
        var possibleTypes = ["Speed+","Speed-","Size+","Size-","Tail+","Tail-","Point+","Death"];
        var randIndex = Math.floor(Math.random()*possibleTypes.length);
        this.type = possibleTypes[randIndex];
        console.log("spawn: ", this.type, this.x, this.y);

        console.log("test: ", GLOBALS.CURRENTGAMESTATE);

    };

    this.checkForCollisions = function(snake){
        if(snake.tail.length < 1) return null;
        var lineX1 = snake.x;
        var lineY1 = snake.y;
        var lineX2 = snake.tail[0].x;
        var lineY2 = snake.tail[0].y;
        var collision = LIB.collideLineRect(lineX1, lineY1, lineX2, lineY2, this.x, this.y, this.size, this.size);
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
                snake.chngSpeed(1);
                break;

            case "Speed-":
                snake.chngSpeed(-1);
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
                snake.chngSpeed(-3);
                break;

            case "Death":
                snake.reset();

                break;
        }//end PowerUpType
    };//End of applyEffect

    this.package = function(){
        var package = {
            x: Math.round(this.x),
            y: Math.round(this.y),
            type: this.type,
            size: Math.round(this.size)
        };
        return package;
    }

}//End of PowerUp
