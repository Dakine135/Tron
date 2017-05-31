function Menu(){
  this.startOfGame = false;
  this.baseSize = 10;

  this.drawGUI = function(){
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

      //Start Button
      this.createTextButton("Start", 0.5, 0.55, 3);

    }
}

//createTextButton(String, relativeWidth, relativeHeight, size)
this.createTextButton = function(string, relX, relY, scale){
  var hit = false;
  textSize(this.baseSize*scale);
  var stringWidth = textWidth(string);
  var marginWidth = 20;
  var marginHeight = 20;
  var recWidth = stringWidth + marginWidth;
  var recHeight = textSize() + marginHeight;
  var recX = (width * relX) - (recWidth/2);
  var recY = (height * relY) - (recHeight/2);

  var roundness = 5;
  var textX = recX + (marginWidth/2);
  var textY = recY + textSize() + (marginHeight/4);
  stroke (0,0,0);
  rect(recX,recY,recWidth,recHeight,roundness);
  fill(255, 255, 255);
  text(string,textX,textY);
}

this.checkClicks = function(){
  if(this.startOfGame){
  // if(mouseX >= ((width/2)-10) && mouseX <= ((width/2)+10) && (mouseY >= ((height/2)-10))
  // && mouseY <= ((height/2)+10)){
  this.startOfGame = false;
  s.reset();
  console.log("Exit Start GUI");
  }
}

  //Start Menu Snake Movement
  this.introSnake = function() {
    s.x = width * 0.7;
	  s.y = 20;
	  s.maxTailLength = 500;
    s.size = 10;
    s.speedScale = 3;
    s.dir(1,1);
  }//end snake intro

}
