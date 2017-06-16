function Socket(){

  this.socket = io();
  this.pings = [];
  this.avgPing = 999;

  var that = this;


  var currentWindow = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  //outgoing
  //this.socket.emit('getCanvasSize', currentWindow);
  this.sendGameState = function(newState){
      //this.socket.emit('guiState', newState);
  };
  this.addSnake = function(snake){
    //this.socket.emit('addSnake', snake);
  };
  this.changeSnakeDir = function(name, x, y, xspeed, yspeed){
    // var snakeDir = {
    //     name: name,
    //     x: x,
    //     y: y,
    //     xspeed: xspeed,
    //     yspeed: yspeed
    // };
    // this.socket.emit('snakeDir', snakeDir);
  };
  this.snakeRespawn = function(name, x, y){
    // var snakeSpawn = {
    //   name: name,
    //     x: x,
    //     y: y
    // };
    // this.socket.emit('snakeRespawn', snakeSpawn);
  };

  //incomming
  this.socket.on('updateClients', updateGameState);

  var once = true;
  function updateGameState(gameState){

    //CALCULATE PING
    var time = new Date().getTime();
    var ping = time - gameState.time;
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

    if(!MAZE){
        MAZE = gameState.mazeLines;
        MAZE.forEach(function(line){
          line['color'] = color(4,255,239);
        });
    }

    if(once) console.log(gameState); once = false;

    // console.log("gameState = frame:%s time:%s ping:%s",
    //     gameState.frame, gameState.time, that.avgPing);
  }


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
