function Socket(){

  this.socket = io();


  var currentWindow = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  //outgoing
  this.socket.emit('getCanvasSize', currentWindow);
  this.sendGameState = function(newState){
      this.socket.emit('guiState', newState);
  };
  this.addSnake = function(snake){
    this.socket.emit('addSnake', snake);
  };
  this.changeSnakeDir = function(name, xspeed, yspeed){
    var snakeDir = {
        name: name,
        xspeed: xspeed,
        yspeed: yspeed
    };
    this.socket.emit('snakeDir', snakeDir);
  };

  //incomming
  this.socket.on('getCanvasSize', socketCanvasSize);
  this.socket.on('guiState', changeGuiState);
  // this.socket.on('keyboard', socketKeyPressed);
  this.socket.on('addSnake', socketAddSnake);
  this.socket.on('snakeDir', applySnakeDir);


  function socketCanvasSize(serverWindow){
    console.log("socketSetCanvasSize: ", serverWindow);
    BOARD.setCanvasSize(serverWindow.width, serverWindow.height);
    //MAZE = new Maze(GAMEGRIDSCALE, color(44, 53, 241, 100), true, true);
    MAZE = serverWindow.mazeLines;
    MAZE.forEach(function(line){
      line['color'] = color(4,255,239);
    });
    console.log("mazelines: ", serverWindow.mazeLines);
    GUI.recalculateGui();
  }

  function changeGuiState(guiState){
    console.log("socket set gameState: ",guiState);
    GUI.guiState(guiState, true);
  }

  // function socketKeyPressed(key){
  //   console.log("socket key pressed: ", key);
  // }
  //
  function socketAddSnake(snake){
    console.log("socket add snake: ", snake);
      BOARD.addRemoteSnake(snake.name, snake.x, snake.y, snake.startColor, snake.endColor, snake.tail, snake.size);
  }

  function applySnakeDir(snakeDir){
    //console.log("socket snake dir: ", snakeDir);
    var snake = BOARD.snakes.get(snakeDir.name);
    snake.xspeed = snakeDir.xspeed;
    snake.yspeed = snakeDir.yspeed;
    BOARD.snakes.set(snakeDir.name, snake);
  }

}//end Sockets class function
