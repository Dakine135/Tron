module.exports = GameState;
var LIB = require('./lib.js');
var PowerUp = require('./PowerUp.js');
var hash = require('object-hash');
var CONFIG = require('./Config.js');
function GameState(frame, MAZELINES, CLIENTSETTINGS){
    this.frame = frame;
    this.time = new Date().getTime();
    this.mazeLines = MAZELINES;
    this.clientSettings = CLIENTSETTINGS;
    this.guiState = "startOfGame";
    this.previousState = this.guiState;
    this.clients = new Map();
    this.snakes = new Map();
    this.powerUps = [];

    var tempPowerUp = new PowerUp();
    tempPowerUp.spawn();
    this.powerUps.push(tempPowerUp);

    var that = this;

    this.restart = function() {
        console.log("RESTART");
        this.updateGuiState("startOfGame");
        this.snakes.forEach(function(snake){
           snake.reset();
        });
        this.clients.forEach(function(client){
            client.reset();
        });

    };// end restart

    this.addSnake = function(snake){
        console.log("addSnake: ", snake.name);
        snake.chngColorRandom();
        snake.intializeTailColor();
        snake.spawn();
        this.snakes.set(snake.name, snake);
    };

    this.addClient = function(client){
        this.clients.set(client.key, client);
        this.addSnake(client.snake);
    };

    this.removeClient = function(clientKey){
        if(this.clients.has(clientKey)){
            this.clients.delete(clientKey);
        }
        if(this.snakes.has(clientKey)){
            this.removeSnake(clientKey);
        }
    };


    this.chngScore = function(clientKey, amount){
        var client = this.clients.get(clientKey);
        client.score = client.score + amount;
        this.clients.set(clientKey, client);
    };

    this.updatePing = function(clientKey, pongTime, pingTime){
        var client = this.clients.get(clientKey);
        client.updatePing(pongTime, pingTime);
        this.clients.set(clientKey, client);
    };

    this.removeSnake = function(snakeName){
        if(this.snakes.has(snakeName)) {
            this.snakes.delete(snakeName);
        }
    };

    this.updateSnakeDir = function(snakeName, x, y){
      var snake = this.snakes.get(snakeName);
      snake.dir(x,y, false);
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
                //if(snakeHeadKey != snakeTailKey){ //dont check collision with self
                    var snakeTail = this.snakes.get(snakeTailKey);
                    var collisionSnake = snakeHead.checkCollisionWithTail(snakeTail);
                    if(collisionSnake != null){
                        //console.log("Snake Tail Collision: ", collisionSnake);
                        snakeTail.tail[collisionSnake.tail].color = [255,255,255];
                        snakeHead.reset();
                        this.chngScore(snakeHead.name, -1);
                        if(snakeHeadKey != snakeTailKey) this.chngScore(snakeTail.name, 1);
                    }
               // }//check if itself
            }//othersnake loop

            if(this.mazeLines){
                var collisionWall = this.checkCollisionWithWalls(snakeHead);
                if(collisionWall && collisionWall.hit){
                    //console.log("Wall Collision: ",collisionWall);
                    collisionWall.wall.color = [255,255,255];
                    this.mazeLines.hash = hash(this.mazeLines);
                    snakeHead.reset();
                    this.chngScore(snakeHead.name, -1);
                }
            }//if a maze has been generated

            //check powerUps for Collision
            this.powerUps.forEach(function(powerUp){
               var collision = powerUp.checkForCollisions(snakeHead);
               //event is handled inside powerUp, but collision contains the location
            });

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

    this.package = function(){
        var gameState = {
            frame: this.frame,
            time: new Date().getTime(),
            guiState: this.guiState,
            mazeLines: this.mazeLines,
            settings: this.clientSettings
        };
        gameState['snakes'] = Array.from(this.snakes.values()).map(function(snake){
            return snake.package();
        });
        gameState['clients'] = Array.from(this.clients.values()).map(function(client){
            return client.package();
        });
        gameState["powerUps"] = {
            powerUps: this.powerUps,
            hash: hash(this.powerUps)
        }
        ;

        return gameState;
    };

}//end GameState class