function Menu(){
  this.startOfGame = false;

  this.drawGUI = function(){
    if(this.startOfGame){
      /*Start Menu Canvas*/
      fill(5,13,16);
      rect(0,0,BOARD.canvasHeight,BOARD.canvasWidth); //Start Menu Background
      textSize(50);
      fill(24,202,230);
      stroke (52,96,141);
      var textString = "Welcome To TRON!";
      text(textString, 80, 200);

      rect(((BOARD.canvasHeight/2)-50),(BOARD.canvasWidth/2),60,30); //Start Button
      textSize(25);
      fill(255, 255, 255);
      stroke (0,0,0);
      var textString = "Start";
      text(textString,((BOARD.canvasHeight/2)-47),(BOARD.canvasWidth/2)+25);

    }
  this.checkClicks = function(){
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
