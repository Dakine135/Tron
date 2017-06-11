function Socket(){

  this.socket = io();
  var currentWindow = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  this.socket.emit('getCanvasSize', currentWindow);
  this.socket.on('mouse', socketMouseClick);
  this.socket.on('getCanvasSize', socketCanvasSize);


  function socketCanvasSize(serverWindow){
    console.log("socketSetCanvasSize: ", serverWindow);
    BOARD.setCanvasSize(serverWindow.width, serverWindow.height);
    MAZE = new Maze(GAMEGRIDSCALE, color(44, 53, 241, 100), true, true);
    GUI.recalculateGui();
  }

  function socketMouseClick(mouseClick){
    console.log("socket mouseClick: ", mouseClick);
  }

  this.checkClicks = function(){
    var data = {
      x: mouseX,
      y: mouseY
    }
    this.socket.emit('mouse', data);
  }

}//end Sockets class function
