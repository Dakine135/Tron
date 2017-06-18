module.exports = GameState;
var LIB = require('./Lib');
var hash = require('object-hash');
function GameState(frame, MAZELINES, CLIENTSETTINGS){
    this.frame = frame;
    this.time = new Date().getTime();
    this.mazeLines = MAZELINES;
    this.clientSettings = CLIENTSETTINGS;
    this.guiState = "startOfGame";
    this.previousState = this.guiState;
    this.snakes = new Map();

    this.restart = function() {
        console.log("RESTART");
        this.updateGuiState("startOfGame");

    };// end restart

    this.addSnake = function(snake){
        snake.chngColorRandom();
        snake.intializeTailColor();
        snake.spawn();
        this.snakes.set(snake.name, snake);
    };

    this.removeSnake = function(snakeName){
        if(this.snakes.has(snakeName)) {
            this.snakes.delete(snakeName);
        }
    };

    this.updateSnakeDir = function(snakeName, x, y){
      var snake = this.snakes.get(snakeName);
      snake.dir(x,y);
      this.snakes.set(snakeName, snake);
    };

    this.updateGuiState = function(guiState){
        console.log("updateGuiState: ", guiState);
        if(guiState === "paused"){
            this.previousState = this.guiState;
            this.guiState = guiState;
        } else if(guiState === "resume"){
            this.guiState = this.previousState;
        } else if(guiState === "gameRunning" && this.guiState === "gameRunning"){
            this.restart();
        } else {
            this.guiState = guiState;
        }

    };

    this.checkCollisionWithWalls = function(snake){
        if (snake.tail.length < 1) return null;
        var collision = null;
        for (var i=0; i < this.mazeLines.lines.length; i++ ){
            var l = this.mazeLines.lines[i];
            collision = LIB.collideLineLine(snake.x, snake.y, snake.tail[0].x, snake.tail[0].y,
                                        l.x1, l.y1, l.x2, l.y2);
            if(collision && collision.hit){
                collision["wall"] = l;
                return collision;
            }
        }
        return collision;
    };

    this.checkForCollisions = function(){
        //check if snakes run into tails (self and others)
        for(var snakeHeadKey of this.snakes.keys()){
            var snakeHead = this.snakes.get(snakeHeadKey);
            for(var snakeTailKey of this.snakes.keys()){
                if(snakeHeadKey != snakeTailKey){ //dont check collision with self
                    var snakeTail = this.snakes.get(snakeTailKey);
                    var collisionSnake = snakeHead.checkCollisionWithTail(snakeTail.tail);
                    if(collisionSnake != null){
                        console.log("Snake Tail Collision: ", collisionSnake);
                        snakeTail.tail[collisionSnake.tail].color = [255,255,255];
                        snakeHead.spawn();
                    }
                }//check if itself
            }//othersnake loop

            if(this.mazeLines){
                var collisionWall = this.checkCollisionWithWalls(snakeHead);
                if(collisionWall && collisionWall.hit){
                    console.log("Wall Collision: ",collisionWall);
                    collisionWall.wall.color = [255,255,255];
                    this.mazeLines.hash = hash(this.mazeLines);
                    snakeHead.spawn();
                    //  console.log("wall Hit");
                }
            }//if a maze has been generated

        }//selfsnake loop
    };// checkForCollisions

    this.update = function(frame) {
        this.frame = frame;
        //this.time = new Date().getTime();

        if(this.guiState === "gameRunning"){
            //updateSnakes
            this.snakes.forEach(function(snake){
                snake.update();
            });
            this.checkForCollisions();
        }//guiState is gameRunning
    };

    this.package = function(NUMPLAYERSCONNECTED){
        var gameState = {
            frame: this.frame,
            time: new Date().getTime(),
            guiState: this.guiState,
            mazeLines: this.mazeLines,
            settings: this.clientSettings,
            playersConnected: NUMPLAYERSCONNECTED
        };
        gameState['snakes'] = Array.from(this.snakes.values());

        return gameState;
    };

}//end GameState class