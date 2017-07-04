module.exports = GameState;
var LIB = require('./lib.js');
var PowerUp = require('./PowerUp.js');
var hash = require('object-hash');
var CONFIG = require('./Config.js');
var GLOBALS = require('./Globals');
var SNAKE = require('./Snake');
var CPUsnake = require('./CPUsnake');
function GameState(frame, MAZELINES, CLIENTSETTINGS){
    this.frame = frame;
    this.time = new Date().getTime();
    this.lastTime = this.time;
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

    this.cpuSnakeTotalLifeSpan = 0;
    this.cpuSnakeCurrentLifeSpan = 0;
    this.numberOfSnakes = 0;
    this.CPUsnakes = new Map();
    this.createCPUsnakes = function(numOfSnakes,numOfMovements){
        this.cpuSnakeTotalLifeSpan = numOfMovements;
        this.numberOfSnakes = numOfSnakes;
      for(var i=0; i < numOfSnakes; i++){
          var tempCPUsnake = new CPUsnake(i, numOfMovements);
          tempCPUsnake.chngColorRandom();
          tempCPUsnake.initalizeMovement();
          //console.log(tempCPUsnake);
          this.CPUsnakes.set(i, tempCPUsnake);
      }
    };

    var widthCells = CONFIG.WIDTH / CONFIG.GAMEGRIDSCALE;
    var heightCells = CONFIG.HEIGHT / CONFIG.GAMEGRIDSCALE;
    var rowNum = Math.floor(heightCells*(3/4));
    var colNum = Math.floor(widthCells*(3/4));
    var goalX = (CONFIG.GAMEGRIDSCALE * colNum) + (CONFIG.GAMEGRIDSCALE / 4);
    var goalY = (CONFIG.GAMEGRIDSCALE * rowNum) + (CONFIG.GAMEGRIDSCALE / 4);
    this.snakeGoal = {
        x: goalX,
        y: goalY,
        size: 20
    };

    this.pickOneParentSnake = function(list, totalScore){
      var index = 0;
      var r = LIB.randomInt(0,totalScore);
      while (r >= 0){
          r = r - list[index].score;
          index++;
      }
      index--;
      return list[index];
    };

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
        this.CPUsnakes = new Map();
        this.createCPUsnakes(200, 200);

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
        //adjust snake "current position" to extend to the tip, from center and previous point
        var snakeHeadX = snake.x + (snake.xdir * (snake.size/2));
        var snakeHeadY = snake.y + (snake.ydir * (snake.size/2));
        for (var i=0; i < this.mazeLines.lines.length; i++ ){
            var l = this.mazeLines.lines[i];
            collision = LIB.collideLineLine(snakeHeadX, snakeHeadY, snake.tail[0].x, snake.tail[0].y,
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
                    //collisionWall.wall.color = [255,255,255];
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
        this.lastTime = this.time;
        this.time = new Date().getTime();
        this.deltaTime = this.time - this.lastTime;

        if(this.guiState === "gameRunning"){
            //updateSnakes
            this.snakes.forEach(function(snake){
                snake.update();
            });
            this.checkForCollisions();

            if(this.cpuSnakeCurrentLifeSpan < this.cpuSnakeTotalLifeSpan) {
                this.CPUsnakes.forEach(function (cpuSnake) {
                    cpuSnake.update(that.cpuSnakeCurrentLifeSpan);
                });
                this.CPUsnakes.forEach(function (cpuSnake) {
                    var collision = that.checkCollisionWithWalls(cpuSnake);
                    if(collision && collision.hit) cpuSnake.crashed = true;
                });
                this.cpuSnakeCurrentLifeSpan++;
            } else {
                //console.log("NEW GENERATION");

                //calculate scores
                var totalScore = 0;
                var bestScore = 0;
                this.CPUsnakes.forEach(function(snake){
                    snake.calculateScore();
                    totalScore += snake.score;
                    if(snake.score > bestScore) bestScore = snake.score;
                });
                console.log("Best Score: ",bestScore, " Total: ",totalScore);

                //breed new generation
                var lastGeneration = Array.from(this.CPUsnakes.values());
                for(var i=0; i< this.numberOfSnakes; i++){
                    var tempCPUsnake = new CPUsnake(i, this.cpuSnakeTotalLifeSpan);
                    tempCPUsnake.chngColorRandom();
                    var snake1 = this.pickOneParentSnake(lastGeneration, totalScore);
                    var snake2 = this.pickOneParentSnake(lastGeneration, totalScore);
                    tempCPUsnake.breed(snake1, snake2, bestScore);
                    //console.log(tempCPUsnake);
                    this.CPUsnakes.set(i, tempCPUsnake);
                }

                //reset simulation
                this.CPUsnakes.forEach(function(snake){
                    snake.reset();
                });
                this.cpuSnakeCurrentLifeSpan = 0;
            }
        }//guiState is gameRunning
    };

    this.package = function(){
        var gameState = {
            frame: this.frame,
            time: new Date().getTime(),
            guiState: this.guiState,
            mazeLines: this.mazeLines,
            settings: this.clientSettings,
            snakeGoal: this.snakeGoal
        };
        gameState['snakes'] = Array.from(this.snakes.values()).map(function(snake){
            return snake.package();
        });
        gameState['cpuSnakes'] = Array.from(this.CPUsnakes.values()).map(function(cpuSnake){
           return cpuSnake.package();
        });
        gameState['clients'] = Array.from(this.clients.values()).map(function(client){
            return client.package();
        });
        gameState["powerUps"] = {
            powerUps: this.powerUps.map(function(powerUp){
                return powerUp.package();
            }),
            hash: hash(this.powerUps)
        };

        return gameState;
    };

}//end GameState class