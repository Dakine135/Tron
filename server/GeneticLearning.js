module.exports = GeneticLearning;
var LIB = require('./lib.js');
var CONFIG = require('./Config.js');
var GLOBALS = require('./Globals');
var CPUsnake = require('./CPUsnake');
function GeneticLearning(){
    this.time = new Date().getTime();
    this.lastTime = this.time;
    this.updateClient = 0;
    this.cpuSnakeTotalLifeSpan = 0;
    this.cpuSnakeCurrentLifeSpan = 0;
    this.numberOfSnakes = 0;
    this.generationCount = 0;
    this.CPUsnakes = new Map();
    this.run = true;

    var that = this;

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
        //this.simulate();
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
    GLOBALS.CURRENTGAMESTATE.snakeGoal = this.snakeGoal;

    this.pickOneParentSnake = function(list, totalScore){
        //console.log("pick a parent: ", list.length, totalScore);
        var index = 0;
        var r = LIB.randomInt(0,totalScore);
        while (r >= 0){
            r = r - list[index].score;
            index++;
        }
        index--;
        return list[index];
    };

    this.simulate = function(){
        while(this.run){
            this.update();
        }
    };

    this.update = function(){
        this.lastTime = this.time;
        this.time = new Date().getTime();
        this.deltaTime = this.time - this.lastTime;

        if(this.cpuSnakeCurrentLifeSpan < this.cpuSnakeTotalLifeSpan) {
            this.CPUsnakes.forEach(function (cpuSnake) {
                cpuSnake.update(that.cpuSnakeCurrentLifeSpan);
            });
            this.CPUsnakes.forEach(function (cpuSnake) {
                var collision = GLOBALS.CURRENTGAMESTATE.checkCollisionWithWalls(cpuSnake);
                if(collision && collision.hit){
                    cpuSnake.crashed = true;
                    cpuSnake.stoppedAtMovementIndex = cpuSnake.currentMovement;
                    //console.log(cpuSnake.stoppedAtMovementIndex, " at crash");
                }
            });
            this.cpuSnakeCurrentLifeSpan++;
        } else {
            //console.log("NEW GENERATION");
            this.updateClient--;


            //calculate scores
            var totalScore = 0;
            var bestScore = 0;
            var bestSnake = null;
            this.CPUsnakes.forEach(function(snake){
                snake.calculateScore();
                totalScore += snake.score;
                if(snake.score > bestScore) {
                    bestScore = snake.score;
                    bestSnake = snake;
                }
            });
            if(this.updateClient <= 0) {
                this.updateClient = 0;
                var snakesToSend = [];
                snakesToSend.push(bestSnake);
                snakesToSend.forEach(function (snake) {
                   snake.currentMovement = 0;
                   console.log(snake.stoppedAtMovementIndex);
                });
                GLOBALS.CURRENTGAMESTATE.geneticLeaningSnakes = snakesToSend;
            }

            console.log("Generation: ",this.generationCount," Time: ", this.deltaTime,
                "ms Best Score: ", bestScore, " Total: ",totalScore);

            //breed new generation
            var lastGeneration = Array.from(this.CPUsnakes.values());
            //console.log("last Generation: ", lastGeneration.length);
            for(var i=0; i< this.numberOfSnakes; i++){
                var tempCPUsnake = new CPUsnake(i, this.cpuSnakeTotalLifeSpan);
                tempCPUsnake.chngColorRandom();
                //console.log("function: ", this.pickOneParentSnake([1,2], 3));
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
            this.generationCount++;
        } //end else create new generation
    }; //end update
}//end genetic learning class