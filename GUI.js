function Menu(){
  //states
  this.startOfGame = false;
  this.config = false;
  this.gameRunning = false;

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
    console.log("GameState: ", state);
    this.liveButtons.clear();
    this.liveText.clear();
    this.startOfGame = false;
    this.config = false;
    this.gameRunning = false;

    //TextButton(string, relX, relY, scale, textColor, buttonColor, strokeColor, callBack)
    switch(state){
      case "startOfGame":
        this.startOfGame = true;
        var welcomeText = new createText("Welcome To TRON!", 0.5, 0.45, 5,
            this.buttonColor, this.strokeColor);
        var startButton = new TextButton("Start", 0.5, 0.55, 3,
            this.textColor, this.buttonColor, this.strokeColor, function(){
              this.guiState("gameRunning");
              BOARD.resetBoard();
          }.bind(this));
        var configButton = new TextButton("Settings", 0.9, 0.1, 3,
            this.textColor, this.buttonColor, this.strokeColor, function(){
              this.guiState("config");
          }.bind(this));
        break;

      case "config":
        this.config = true;
        var settingsText = new createText("Settings", 0.5, 0.2, 5,
          this.buttonColor, this.strokeColor);

        var backButton = new TextButton("Back", 0.1, 0.1, 3,
          this.textColor, this.buttonColor, this.strokeColor, function(){
            this.guiState("startOfGame");
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
        break;
    }


  }//end guiState

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

  }//end drawGUI




  this.checkClicks = function(){
    //console.log(this.liveButtons);
    this.liveButtons.forEach(function(button){
      button.clicked();
    });
  }//end check Clicks

} // end class Menu
