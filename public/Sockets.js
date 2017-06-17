function Socket(){

  this.socket = io();
  this.id = this.socket.id;
  this.pings = [];
  this.avgPing = 10;

  this.guiState = "startOfGame";

  var that = this;

  //outgoing

  //incomming
  this.socket.on('updateClients', updateGameState);

  var once = true;
  function updateGameState(gameState){
      if(that.id == null) that.id = that.socket.id;

    //CALCULATE PING
    var time = new Date().getTime();
    var ping = Math.abs(time - gameState.time);
    if(that.pings.length < 30) {
        that.pings.push(ping);
    } else {
      var calculateAverage = 0;
        that.pings.forEach(function(ping){ calculateAverage = calculateAverage + ping});
        calculateAverage = Math.round(calculateAverage / that.pings.length);
        that.pings = [];
        that.avgPing = Math.round((calculateAverage + that.avgPing) / 2);
        document.getElementById("ping").innerHTML = "Ping: " + that.avgPing;
    }

      document.getElementById("PlayersConnected").innerHTML =
            "Number of Players Connected: " + gameState.playersConnected;

    if(!MAZE){
        MAZE = gameState.mazeLines;
        MAZE.forEach(function(line){
          line['color'] = color(4,255,239);
        });
    }

    if(!SETTINGS){
      SETTINGS = gameState.settings;
      BOARD.init();
    }

    if(gameState.guiState != this.guiState){
        GUI.guiState(gameState.guiState);
        this.guiState = gameState.guiState;
    }

    gameState.snakes.forEach(function(snake) {
      if(BOARD.snakes.has(snake.name)){
          var oldSnake = BOARD.snakes.get(snake.name);
          oldSnake.update(snake);
          BOARD.snakes.set(snake.name, oldSnake);
      } else {
          var newSnake = new Snake(snake.name);
          newSnake.update(snake);
          BOARD.snakes.set(snake.name, newSnake);
      }
    });

    if(once) console.log(gameState); once = false;

    // console.log("gameState = frame:%s time:%s ping:%s",
    //     gameState.frame, gameState.time, that.avgPing);

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

    this.startGame = function(){
      this.socket.emit("startGame", null);
    };


  // function socketCanvasSize(serverWindow){
  //   // console.log("socketSetCanvasSize: ", serverWindow);
  //   // if(serverWindow.width != width || serverWindow.height != height) {
  //   //     BOARD.setCanvasSize(serverWindow.width, serverWindow.height);
  //   //     GUI.recalculateGui();
  //   // }
  //   // MAZE = serverWindow.mazeLines;
  //   // MAZE.forEach(function(line){
  //   //   line['color'] = color(4,255,239);
  //   // });
  //   //console.log("mazelines: ", serverWindow.mazeLines);
  // }
  //
  // function changeGuiState(guiState){
  //   console.log("socket set gameState: ",guiState);
  //   GUI.guiState(guiState, true);
  // }
  //
  // // function socketKeyPressed(key){
  // //   console.log("socket key pressed: ", key);
  // // }
  // //
  // function socketAddSnake(snake){
  //   console.log("socket add snake: ", snake);
  //     BOARD.addRemoteSnake(snake.name, snake.x, snake.y, snake.startColor, snake.endColor, snake.tail, snake.size);
  // }
  //
  // function applySnakeDir(snakeDir){
  //   //console.log("socket snake dir: ", snakeDir);
  //   var snake = BOARD.snakes.get(snakeDir.name);
  //   snake.x = snakeDir.x;
  //   snake.y = snakeDir.y;
  //   snake.xspeed = snakeDir.xspeed;
  //   snake.yspeed = snakeDir.yspeed;
  //   BOARD.snakes.set(snakeDir.name, snake);
  // }
  //
  // function applySnakeRespawn(snakeSpawn){
  //   //console.log("snakeRespawn: ", snakeSpawn);
  //   var snake = BOARD.snakes.get(snakeSpawn.name);
  //   snake.createPreviousPosition(this.x, this.y, true, false);
  //   snake.x = snakeSpawn.x;
  //   snake.y = snakeSpawn.y;
  //   snake.createPreviousPosition(this.x, this.y, false, true);
  //   BOARD.snakes.set(snakeDir.name, snake);
  // }

}//end Sockets class function
