module.exports = GeneticLearning;
var LIB = require('./lib.js');
var CONFIG = require('./Config.js');
var GLOBALS = require('./Globals');
var GeneticSnake = require('./GeneticSnake');
function GeneticLearning(){
    this.time = new Date().getTime();
    this.lastTime = this.time;
    this.updateClient = 0;
    this.geneticSnakesTotalLifeSpan = 0;
    this.geneticSnakesCurrentLifeSpan = 0;
    this.numberOfSnakes = 0;
    this.generationCount = 0;
    this.geneticSnakes = new Map();
    this.foundSolution = false;
    this.allCrashed = false;
    this.bestSnake = null;
    this.bestGlobalScore = 0;
    this.bestGeneration = 0;

    var that = this;

    this.createGeneticSnakes = function(numOfSnakes,numOfMovements){
        this.geneticSnakesTotalLifeSpan = numOfMovements;
        this.numberOfSnakes = numOfSnakes;
        for(var i=0; i < numOfSnakes; i++){
            var tempGeneticSnake = new GeneticSnake(i, numOfMovements);
            tempGeneticSnake.chngColorRandom();
            tempGeneticSnake.initalizeMovement();
            this.geneticSnakes.set(i, tempGeneticSnake);
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
        if(this.geneticSnakesCurrentLifeSpan < this.geneticSnakesTotalLifeSpan && !this.allCrashed) {
            this.allCrashed = true;
            this.geneticSnakes.forEach(function (snake) {
                snake.update(that.geneticSnakesCurrentLifeSpan);
            });
            this.geneticSnakes.forEach(function (snake) {
                if(!snake.crashed) { //if not already crashed, check if crashed
                    var collision = GLOBALS.CURRENTGAMESTATE.checkCollisionWithWalls(snake);
                    if (collision && collision.hit) {
                        snake.crashed = true;
                        snake.stoppedAtMovementIndex = snake.currentMovement;
                        // console.log("wall collision: ",snake.stoppedAtMovementIndex, snake.crashed,
                        // "Name: ",snake.name, that.generationCount;
                    } else if(collision && !collision.hit){
                        //someone is still going
                        that.allCrashed = false;
                    }
                }

            });
            //if(this.allCrashed) console.log("everyone Crashed");
            this.geneticSnakesCurrentLifeSpan++;

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
            this.geneticSnakes.forEach(function(snake){
                snake.calculateScore();
                totalScore = totalScore + snake.score;
                if(snake.score > bestScore) {
                    bestScore = snake.score;
                    if(that.bestSnake == null || that.bestGlobalScore < bestScore) {
                        that.bestSnake = snake.genes();
                        that.bestGlobalScore = bestScore;
                        that.bestGeneration = that.generationCount;
                        console.log("bestSnakeFound.index: ",
                        snake.stoppedAtMovementIndex, snake.crashed, snake.name, snake.score);
                    }
                }
                if(snake.madeItToGoal > 0) madeItToGoal = true;
            });

            console.log("Generation: ",this.generationCount," Time: ", this.deltaTime,
                "ms Best Score: ", bestScore, " Total: ", totalScore, "AllCrashed: ", this.allCrashed);

            if(madeItToGoal || this.generationCount >= 5){
                this.foundSolution = true;
            }


            if(this.foundSolution) {
                snakeGenes.push(this.bestSnake);
                snakeGenes.forEach(function (snakeGene) {
                    var snake = new GeneticSnake("bestSnakeSolutionGene"+snakeGene.name, snakeGene.numOfMovements);
                    snake.movement = snakeGene.movement;
                    snake.stoppedAtMovementIndex = snakeGene.stoppedAtMovementIndex;
                    snake.chngColorRandom();
                    //snake.reset();
                    console.log("Sending Snake: -----------");
                    console.log("snakeName and bestGeneration: ", snake.name, that.bestGeneration);
                    console.log("genes.stoppedAtMovementIndex: ", snakeGene.stoppedAtMovementIndex);
                    console.log("snakeToSend.stoppedAtMovementIndex: ", snake.stoppedAtMovementIndex);
                    console.log("--------------------------")
                    snakesToSend.push(snake);
                });
                GLOBALS.CURRENTGAMESTATE.geneticLearningSnakes = snakesToSend;
            } else {

                //breed new generation
                var lastGeneration = Array.from(this.geneticSnakes.values());
                //console.log("last Generation: ", lastGeneration.length);
                for(var i=0; i< this.numberOfSnakes; i++){
                    var tempGeneticSnake = new GeneticSnake(i, this.geneticSnakesTotalLifeSpan);
                    tempGeneticSnake.chngColorRandom();
                    var snake1 = this.pickOneParentSnake(lastGeneration, totalScore);
                    var snake2 = this.pickOneParentSnake(lastGeneration, totalScore);
                    tempGeneticSnake.breed(snake1, snake2, bestScore);
                    this.geneticSnakes.set(i, tempGeneticSnake);
                }

                //reset simulation
                this.geneticSnakes.forEach(function(snake){
                    snake.reset();
                });
                this.geneticSnakesCurrentLifeSpan = 0;
                this.allCrashed = false;
                this.generationCount++;
            }

        } //end else create new generation
    }; //end update
}//end genetic learning class
