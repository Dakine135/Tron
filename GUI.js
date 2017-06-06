function Menu(){
  //states
  this.startOfGame = false;
  this.config = false;
  this.gameRunning = false;

  //buttons and text
  this.liveButtons = new Map();
  this.liveText = new Map();

  //internal
  this.player = 0;
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
        var welcomeText = new createText("Welcome To TRON!", 0.5, 0.45, 5, this.buttonColor, this.strokeColor);
        var startButton = new TextButton("Start", 0.5, 0.55, 3,
            this.textColor, this.buttonColor, this.strokeColor, function(){
              this.guiState("gameRunning");
              BOARD.resetBoard();
          }.bind(this));

        var configButton = new TextButton("Settings", 0.1, 0.1, 3,
            this.textColor, this.buttonColor, this.strokeColor, function(){
              this.guiState("config");
          }.bind(this));
        break;

      case "config":
        this.config = true;
        var settingsText = new createText("Settings", 0.5, 0.45, 5, this.buttonColor, this.strokeColor);

        var backButton = new TextButton("Back", 0.1, 0.1, 3, this.textColor, this.buttonColor, this.strokeColor, function(){

          //this.guiState("startOfGame");
        }.bind(this));

        var player1Button = new TextButton("P 1", 0.35, 0.3, 1, this.textColor, this.buttonColor, this.strokeColor, function(){

        }.bind(this));

        var player2Button = new TextButton("P 2", 0.65, 0.3, 1, this.textColor, this.buttonColor, this.strokeColor, function(){

        }.bind(this));

        var playerSelectedText = new createText("P"+ (this.player + 1) +" selected", .5, .25, 2, this.buttonColor, this.strokeColor);

        var colorButton = new TextButton("Change Color", 0.5, 0.5, 3, this.textColor, this.buttonColor, this.strokeColor, function(){

        }.bind(this));
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

    this.liveButtons.forEach(function(button){
      button.show();
    })

    this.liveText.forEach(function(text){
      text.show();
    })

}//end drawGUI

this.checkClicks = function(){
  //console.log(this.liveButtons);
  this.liveButtons.forEach(function(button){
    button.clicked();
  });
}//end check Clicks

  //Start Menu Snake Movement
  // this.introSnake = function() {
  //   s.x = width * 0.7;
	//   s.y = 20;
	//   s.maxTailLength = 500;
  //   s.size = 10;
  //   s.speedScale = 3;
  //   s.dir(1,1);
  // }//end snake intro

} // end class Menu
