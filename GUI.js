function Menu(){
  this.startOfGame = false;
  this.config = false;
  this.baseSize = 10;
  this.liveButtons = new Map();
  this.player = 0;

  this.guiState = function(state){
    //set called gui to true
    //set all other guis to false
  }
  this.drawGUI = function(){
    this.liveButtons.clear();
    if(this.startOfGame){
      /*Start Menu Canvas*/
      fill(5,13,16);
      rect(0,0,width,height); //Start Menu Background
      textSize(50);
      fill(24,202,230);
      stroke (52,96,141);
      var textString = "Welcome To TRON!";
      var stringWidth = textWidth(textString);
      text(textString, ((width/2)-(stringWidth/2)), (height/2));
      // console.log(stringWidth);

      //create start Button
      var startButtonKey = this.createTextButton("Start", 0.5, 0.55, 3, function(){
          this.startOfGame = false;
          BOARD.resetSnakes();
        }.bind(this)
      );

      //create config Button
      var configButton = this.createTextButton("Settings", 0.1, 0.1, 3, function(){
        this.startOfGame = false;
        this.config = true;
      }.bind(this)
      );


    }//end this.startOfGame

    if(this.config){
      /*Config GUI Canvas*/
      fill(5,13,16);
      rect(0,0,width,height); //Start Menu Background
      textSize(50);
      fill(24,202,230);
      stroke (52,96,141);
      var textString = "Settings";
      var stringWidth = textWidth(textString);
      text(textString, ((width/2)-(stringWidth/2)), (100));
      // console.log(stringWidth);

      //create back Button
      var backButton = this.createTextButton("Back", 0.1, 0.1, 3, function(){
        this.startOfGame = true;
        this.config = false;
      }.bind(this)
      );

      //create P1 Button
      var player1Button = this.createTextButton("P 1", 0.35, 0.3, 1, function(){
        this.player = 0;
        console.log(this.player);
      }.bind(this)
      );

      //create P2 Button
      var player2Button = this.createTextButton("P 2", 0.65, 0.3, 1, function(){
        this.player = 1;
        console.log(this.player);
      }.bind(this)
      );

    this.createText("P"+ (this.player + 1) +" selected", .5, .25, 2);

      //create color Button
      var colorButton = this.createTextButton("Change Color", 0.5, 0.5, 3, function(){
        // this.startOfGame = true;
        this.config = true;
        BOARD.snakes[this.player].chngColor();
      }.bind(this)
      );
    }

}//end drawGUI

//createTextButton(String, relativeWidth, relativeHeight, size)
this.createTextButton = function(string, relX, relY, scale, callBack){
  var hit = false;
  textSize(this.baseSize*scale);
  var stringWidth = textWidth(string);
  var marginWidth = 20;
  var marginHeight = 20;
  var recWidth = stringWidth + marginWidth;
  var recHeight = textSize() + marginHeight;
  var recX = Math.round((width * relX) - (recWidth/2));
  var recY = Math.round((height * relY) - (recHeight/2));

  var roundness = 5;
  var textX = recX + (marginWidth/2);
  var textY = recY + textSize() + (marginHeight/4);
  stroke (0,0,0);
  rect(recX,recY,recWidth,recHeight,roundness);
  fill(255, 255, 255);
  text(string,textX,textY);

  var buttonClicked = function(){
    //see if the mouse is in the rect
    var hit = collidePointRect(mouseX,mouseY,recX,recY,recWidth,recHeight);
    if(hit){
      console.log(string, ' button clicked');
      callBack();
    }
  }

  var buttonKey = recX.toString() + recY.toString();
  this.liveButtons.set(buttonKey, buttonClicked);
  return buttonKey;
} //end createTextButton

this.createText = function(textString, relX, relY, scale){
  textSize(this.baseSize*scale);
  var stringWidth = textWidth(textString);
  var textX = (width*relX)-(stringWidth/2);
  var textY = (height*relY)+(textSize()/2);
  fill(24,202,230);
  stroke (52,96,141);
  console.log(textX,textY);
  text(textString, textX, textY);
}

this.checkClicks = function(){
  //console.log(this.liveButtons);
  this.liveButtons.forEach(function(value){
    value();
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
