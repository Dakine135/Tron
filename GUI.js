function Menu(){
  this.startOfGame = false;
  this.config = false;
  this.baseSize = 10;
  this.liveButtons = new Map();

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
      }

    }//end this.startOfGame
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

this.createText = function(){

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
