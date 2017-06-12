function Socket(){

  this.socket = io();
  var currentWindow = {
    width: window.innerWidth,
    height: window.innerHeight
  }


  //outgoing
  this.socket.emit('getCanvasSize', currentWindow);
  this.sendClicks = function(){
    var data = {
      x: mouseX,
      y: mouseY
    };
    this.socket.emit('mouse', data);
  }.bind(this);
  this.sendGameState = function(newState){
      this.socket.emit('gameState', newState);
  };
  this.sendKeyboard = function(keys){
    this.socket.emit('keyboard', keys);
  };
  this.sendSnake = function(snake){
    this.socket.emit('snake', snake);
  };

  //incomming
  this.socket.on('mouse', socketMouseClick);
  this.socket.on('getCanvasSize', socketCanvasSize);
  this.socket.on('gameState', changeGameState);
  this.socket.on('keyboard', socketKeyPressed);
  this.socket.on('snake', socketUpdateSnake);


  function socketCanvasSize(serverWindow){
    console.log("socketSetCanvasSize: ", serverWindow);
    BOARD.setCanvasSize(serverWindow.width, serverWindow.height);
    MAZE = new Maze(GAMEGRIDSCALE, color(44, 53, 241, 100), true, true);
    GUI.recalculateGui();
  }

  function changeGameState(gameState){
    console.log("socket set gameState: ",gameState);
    GUI.guiState(gameState, true);
  }

  function socketKeyPressed(key){
    console.log("socket key pressed: ", key);
  }

  function socketUpdateSnake(snake){
    //console.log("socket update snake: ", snake);
  }

  function socketMouseClick(mouseClick){
    console.log("socket mouseClick: ", mouseClick);
    // GUI.checkClicks();
  }

}//end Sockets class function
