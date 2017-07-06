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
    this.foundSolution = false;
    this.allCrashed = false;
    this.bestSnake = null;

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
        while(!this.foundSolution) {
            this.update();
        }
    };

    this.update = function(){
        if(this.cpuSnakeCurrentLifeSpan < this.cpuSnakeTotalLifeSpan && !this.allCrashed) {
            this.allCrashed = true;
            this.CPUsnakes.forEach(function (cpuSnake) {
                cpuSnake.update(that.cpuSnakeCurrentLifeSpan);
            });
            this.CPUsnakes.forEach(function (cpuSnake) {
                if(!cpuSnake.crashed) { //if not already crashed, check if crashed
                    var collision = GLOBALS.CURRENTGAMESTATE.checkCollisionWithWalls(cpuSnake);
                    if (collision && collision.hit) {
                        cpuSnake.crashed = true;
                        cpuSnake.stoppedAtMovementIndex = cpuSnake.currentMovement;
                        //console.log("wall collision: ",cpuSnake.stoppedAtMovementIndex, cpuSnake.crashed, cpuSnake.name);
                    } else if(collision && !collision.hit){
                        //someone is still going
                        that.allCrashed = false;
                    }
                }

            });
            //if(this.allCrashed) console.log("everyone Crashed");
            this.cpuSnakeCurrentLifeSpan++;

        } else {
            //end of generation simulation
            this.lastTime = this.time;
            this.time = new Date().getTime();
            this.deltaTime = this.time - this.lastTime;

            //calculate scores, assess Generation
            var totalScore = 0;
            var bestScore = 0;
            var snakesToSend = [];
            var snakeGenes = [];
            var madeItToGoal = false;
            this.CPUsnakes.forEach(function(snake){
                snake.calculateScore();
                totalScore = totalScore + snake.score;
                if(snake.score > bestScore) {
                    bestScore = snake.score;
                    if(that.bestSnake == null || that.bestSnake.score < bestScore) {
                        that.bestSnake = snake.genes();
                        //console.log("bestSnakeFound.index: ", snake.stoppedAtMovementIndex, snake.crashed, snake.name, snake.score);
                    }
                }
                if(snake.madeItToGoal > 0) madeItToGoal = true;
            });

            console.log("Generation: ",this.generationCount," Time: ", this.deltaTime,
                "ms Best Score: ", bestScore, " Total: ", totalScore, "AllCrashed: ", this.allCrashed);

            if(madeItToGoal || this.generationCount >= 30){
                this.foundSolution = true;
            }


            if(this.foundSolution) {
                snakeGenes.push(this.bestSnake);
                snakeGenes.forEach(function (snakeGene) {
                    var snake = new CPUsnake("bestSnakeSolutionGene", snakeGene.numOfMovements);
                    snake.movement = snakeGene.movement;
                    snake.stoppedAtMovementIndex = snakeGene.stoppedAtMovementIndex;
                    snake.chngColorRandom();
                    //snake.reset();
                    console.log("genes.index: ", snakeGene.stoppedAtMovementIndex);
                    console.log("snakeToSend.index: ", snake.stoppedAtMovementIndex);
                    snakesToSend.push(snake);
                });
                GLOBALS.CURRENTGAMESTATE.geneticLeaningSnakes = snakesToSend;
            } else {

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
                this.allCrashed = false;
                this.generationCount++;
            }

        } //end else create new generation
    }; //end update
}//end genetic learning class