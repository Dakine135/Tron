function Socket(){

    this.socket = io();
    this.id = this.socket.id;
    this.startTime = new Date().getTime();
    this.currentTick = 0;
    this.previousTick = 0;
    this.packetCount = 0;

    this.mazeHash = "";
    this.settingsHash = "";
    this.powerUpsHash = "";

    this.myClient = null;
    this.mySnake = null;

    var that = this;

    //outgoing

    //incomming
    this.socket.on('updateClients', updateGameState);

    var once = true;
    var times = 0;
    function updateGameState(gameState){
        that.sendPong(gameState.time);
        if(once) console.log(gameState); once = false;
        if(that.id == null) that.id = that.socket.id;
        gameState.clients.forEach(function(client){
            if(client.key === that.id) that.myClient = client;
        });
        that.packetCount++;
        CURRENTGAMESTATE = gameState;

        //CALCULATE PING and packets per second
        var time = new Date().getTime();
        var timeDiff = time - that.startTime;
        that.currentTick = Math.floor(timeDiff % 1000);
        if(that.currentTick < that.previousTick){
            //once a second?
            //console.log("test");
            document.getElementById("packets").innerHTML = that.packetCount;
            that.packetCount = 0;
        }
        //if(times < 100){ console.log(that.currentTick, " < ", that.previousTick); times++; }
        that.previousTick = that.currentTick;


        if(that.myClient) {
            document.getElementById("ping").innerHTML = that.myClient.ping;

            var name = that.id.split('');
            document.getElementById("playerName").innerHTML = that.myClient.name;
        }

        document.getElementById("PlayersConnected").innerHTML = gameState.clients.length;

        // var scoreString = "Scores: \n";
        // gameState.clients.forEach(function(client){
        //     scoreString = scoreString + client.name + ": "+client.score+ "\n";
        // });
        var scoreString = "";
          gameState.clients.forEach(function(client){
              scoreString = scoreString + client.name + " - " +client.score

          });
        document.getElementById("scores").innerHTML = scoreString;


        if(that.mazeHash != gameState.mazeLines.hash){
            that.mazeHash = gameState.mazeLines.hash;
            MAZE = gameState.mazeLines.lines;
            //console.log("BOARD.init CALLED FROM Maze update");
            BOARD.init();
        }

        if(that.settingsHash != gameState.settings.hash){
            that.settingsHash = gameState.settings.hash;
            SETTINGS = gameState.settings;
            //console.log("BOARD.init CALLED FROM settings update");
            BOARD.init();
        }

        if(gameState.guiState != GUI.currentState){
            GUI.guiState(gameState.guiState);
        }

        //add or update local snakes
        gameState.snakes.forEach(function(snake) {
            if(BOARD.snakes.has(snake.name)){
                var oldSnake = BOARD.snakes.get(snake.name);
                oldSnake.update(snake);
                BOARD.snakes.set(snake.name, oldSnake);
                if(that.myClient && snake.name === that.myClient.key){
                    // console.log("setting snake: ", this.mySnake);
                    that.mySnake = BOARD.snakes.get(that.myClient.key);
                }
            } else {
                var newSnake = new Snake(snake.name);
                newSnake.update(snake);
                BOARD.snakes.set(snake.name, newSnake);
            }
        });

        //add or update local snakes
        if(gameState.cpuSnakes != null) {
            gameState.cpuSnakes.forEach(function (snake) {
                if (BOARD.snakes.has(snake.name)) {
                    //console.log("update cpu snake: ", snake.name);
                    var oldSnake = BOARD.snakes.get(snake.name);
                    oldSnake.update(snake);
                    BOARD.snakes.set(snake.name, oldSnake);
                    if (that.myClient && snake.name === that.myClient.key) {
                        // console.log("setting snake: ", this.mySnake);
                        that.mySnake = BOARD.snakes.get(that.myClient.key);
                    }
                } else {
                    console.log("add cpu snake: ", snake.name);
                    var newSnake = new Snake(snake.name);
                    console.log("new cpu snake: ", newSnake);
                    newSnake.update(snake);
                    BOARD.snakes.set(snake.name, newSnake);
                }
            });
        }

        //remove local snakes if no longer in gameState
        BOARD.snakes.forEach(function(boardSnake){
            var snakeFound = false;
            gameState.snakes.forEach(function (gameSnake) {
                if(boardSnake.name == gameSnake.name) snakeFound = true;
            });
            if(gameState.cpuSnakes != null) {
                gameState.cpuSnakes.forEach(function (gameSnake) {
                    if(boardSnake.name == gameSnake.name) snakeFound = true;
                });
            }
            if(!snakeFound){
                BOARD.snakes.delete(boardSnake.name);
            }
        });

        if(gameState.snakeGoal != null) {
            BOARD.snakeGoal = gameState.snakeGoal;
        }


        if(that.powerUpsHash != gameState.powerUps.hash){
            that.powerUpsHash = gameState.powerUps.hash;
            BOARD.powerUps = gameState.powerUps.powerUps;
            //console.log("BOARD.init CALLED FROM powerUps update");
            BOARD.init();
        }


    }//end updateGameState

    this.changeSnakeDir = function(x, y){
        var snakeDir = {
            x: x,
            y: y
        };
        this.socket.emit('snakeDir', snakeDir);
    };

    this.changeGuiState = function(guiState){
        this.socket.emit('guiState', guiState);
    };

    this.generateNewMaze = function(){
        this.socket.emit('newMaze', null);
    };

    this.sendPong = function(time){
        this.socket.emit('updatePing', time);
    };

}//end Sockets class function
