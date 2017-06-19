module.exports = PowerUp;
var LIB = require('./lib.js');
function PowerUp(GAMEGRIDSCALE){

    this.x = 30;
    this.y = 30;
    this.type = " ";
    this.gameGridScale = GAMEGRIDSCALE;
    this.size = (this.gameGridScale/5);

    this.spawn = function (){
        var widthCells = width / this.gameGridScale;
        var heightCells = height / this.gameGridScale;
        var randomRow = floor(random(0, heightCells));
        var randomCol = floor(random(0, widthCells));
        var newXPos = (this.gameGridScale * randomCol) + (this.gameGridScale/2)-(this.size/2);
        var newYPos = (this.gameGridScale * randomRow) + (this.gameGridScale/2)-(this.size/2);
        this.x = newXPos;
        this.y = newYPos;

        //random type
        var possibleTypes = ["Speed+","Speed-","Size+","Size-","Tail+","Tail-","Point+","Death"];
        var randIndex = Math.floor(Math.random()*possibleTypes.length);
        this.type = possibleTypes[randIndex];
        console.log("spawn: ", this.type, newXPos, newYPos);

    };

    this.checkForCollisions = function(snake){
        //need to create the collideRectCircle or equvalent function, probly the line to rect one
        //put in library
        //var hit = collideRectCircle(this.x,this.y,this.size,this.size,snake.x,snake.y,snake.size);
        if (hit){
            this.applyEffect(snake);
            this.spawn();
        }
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
                snake.spawn();
                break;
        }//end PowerUpType
    };//End of applyEffect

}//End of PowerUp