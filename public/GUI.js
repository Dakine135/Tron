function Menu(){
  //states
  this.currentState = "startOfGame";
  this.startOfGame = false;
  this.config = false;
  this.gameRunning = false;
  this.gamePaused = false;

  //buttons and text
  this.liveButtons = new Map();
  this.liveText = new Map();

  //internal
  this.selectedSnake = null;
  this.snakeEditor = new editSnake();
  this.strokeColor = color(0,0,0);
  this.buttonColor = color(24,202,230);
  this.textColor = color(255, 255, 255);

  this.guiState = function(state){
    if(this.currentState != state) console.log("GuiState: ", state);
    this.liveButtons.clear();
    this.liveText.clear();
    this.snakeEditor.reset();
    this.startOfGame = false;
    this.config = false;
    this.gameRunning = false;

    //TextButton(string, relX, relY, scale, textColor, buttonColor, strokeColor, callBack)
    switch(state){
      case "startOfGame":
        this.startOfGame = true;
        this.currentState = "startOfGame";
        var welcomeText = new createText("Welcome To FrameRate!", 0.5, 0.4, 5,
            this.buttonColor, this.strokeColor);
        var startButton = new TextButton("Start", 0.5, 0.6, 3,
            this.textColor, this.buttonColor, this.strokeColor, function(){
              SOCKET.changeGuiState("gameRunning");
          }.bind(this));
        var configButton = new TextButton("Settings", 0.9, 0.1, 3,
            this.textColor, this.buttonColor, this.strokeColor, function(){
                SOCKET.changeGuiState("config");
          }.bind(this));
        break;

      case "config":
        this.config = true;
        this.currentState = "config";
        var settingsText = new createText("Settings", 0.5, 0.2, 5,
          this.buttonColor, this.strokeColor);

        var backButton = new TextButton("Back", 0.1, 0.1, 3,
          this.textColor, this.buttonColor, this.strokeColor, function(){
                SOCKET.changeGuiState("startOfGame");
        }.bind(this));

        var playerSelectedText = new createText("No Player selected", 0.5, 0.3, 2,
          this.buttonColor, this.strokeColor);

        var startXLocation = 0.4;
        var snakeButtons = [];
        var startScale = 2;
        BOARD.snakes.forEach(function(snake){
            var snakeButton = new TextButton(snake.name, startXLocation, 0.4, 2,
              snake.startColor, snake.endColor, snake.startColor, function(){

                for(var i=0;i<snakeButtons.length;i++) snakeButtons[i].changeScale(startScale);
                this.selectedSnake = snake.name;
                playerSelectedText.string = "Player "+this.selectedSnake+" Selected";
                snakeButton.changeScale(startScale*2);

                this.snakeEditor.setSnake(snake, snakeButton);

            }.bind(this));
            snakeButtons.push(snakeButton);
            startXLocation = startXLocation + 0.2;
        }.bind(this));//for each snake

        // var colorButton = new TextButton("Change Color", 0.5, 0.5, 3,
        //   this.textColor, this.buttonColor, this.strokeColor, function(){
        //
        // }.bind(this));
        break;

      case "gameRunning":
        this.gameRunning = true;
        this.currentState = "gameRunning";
          // var ScoreText = new createText("Score", 0.5, 0.03, 5,
          //     this.buttonColor, this.strokeColor);
        break;

      case "paused":
      this.gamePaused = true;
      this.currentState = "paused";
        var gamePausedText = new createText("Game Paused", 0.5, 0.5, 5,
          this.buttonColor, this.strokeColor);
        break;
    }


  };//end guiState

    this.pause = function () {
      if(this.currentState != "paused") {
          SOCKET.changeGuiState("paused");
          document.getElementById("pauseButton").innerHTML = "Resume";
      } else {
          SOCKET.changeGuiState("resume");
          document.getElementById("pauseButton").innerHTML = "Pause";
      }
    };

  this.drawGUI = function(){

    if(!this.gameRunning){
      fill(5,13,16);
      rect(0,0,width,height); //Start Menu Background
    }

    if(this.config && this.selectedSnake){
      this.snakeEditor.show();
    }

    this.liveButtons.forEach(function(button){
      button.show();
    });

    this.liveText.forEach(function(text){
      text.show();
    });

  };//end drawGUI

  this.recalculateGui = function(){
    this.liveButtons.forEach(function(button){
      button.recalculatePosition();
    });
    this.liveText.forEach(function(text){
      text.recalculatePosition();
    });
    this.guiState(this.currentState);
  };




  this.checkClicks = function(){
    //console.log(this.liveButtons);
    this.liveButtons.forEach(function(button){
      button.clicked();
    });
  };//end check Clicks

} // end class Menu
