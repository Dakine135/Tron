function Socket(){

  this.socket = io();
  this.id = this.socket.id;
  this.startTime = new Date().getTime();
  this.currentTick = 0;
  this.previousTick = 0;
  this.packetCount = 0;

  this.guiState = "startOfGame";

  this.mazeHash = "";
  this.settingsHash = "";

  var that = this;

  //outgoing

  //incomming
  this.socket.on('updateClients', updateGameState);

  var once = true;
  var times = 0;
  function updateGameState(gameState){
      that.sendPong(gameState.time);
      if(that.id == null) that.id = that.socket.id;
      var myClient;
      gameState.clients.forEach(function(client){
          if(client.key === that.id) myClient = client;
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
        document.getElementById("packets").innerHTML = "PacketCount: " + that.packetCount;
        that.packetCount = 0;
    }
    //if(times < 100){ console.log(that.currentTick, " < ", that.previousTick); times++; }
      that.previousTick = that.currentTick;


        if(myClient) {
            document.getElementById("ping").innerHTML = "Ping: " + myClient.ping;
        }

      document.getElementById("PlayersConnected").innerHTML =
            "Players: " + gameState.clients.length;

        var name = that.id.split('');
      document.getElementById("playerName").innerHTML =
          "You are: " + myClient.name;

        var scoreString = "Scores: \n";
        gameState.clients.forEach(function(client){
            scoreString = scoreString + client.name + ": "+client.score+ "\n";
        });
      document.getElementById("scores").innerHTML = scoreString;


    if(this.mazeHash != gameState.mazeLines.hash){
        this.mazeHash = gameState.mazeLines.hash;
        MAZE = gameState.mazeLines.lines;
        BOARD.scaleBOARD();
    }

    if(this.settingsHash != gameState.settings.hash){
        this.settingsHash = gameState.settings.hash;
      SETTINGS = gameState.settings;
      BOARD.init();
    }

    if(gameState.guiState != this.guiState){
        GUI.guiState(gameState.guiState);
        this.guiState = gameState.guiState;
    }

    //add or update local snakes
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

    //remove local snakes if no longer in gameState
      BOARD.snakes.forEach(function(boardSnake){
          var snakeFound = false;
          gameState.snakes.forEach(function (gameSnake) {
              if(boardSnake.name == gameSnake.name) snakeFound = true;
          });
          if(!snakeFound){
              BOARD.snakes.delete(boardSnake.name);
          }
      });

      BOARD.powerUps = gameState.powerUps;

    if(once) console.log(gameState); once = false;


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
