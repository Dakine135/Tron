function TextButton(string, relX, relY, scale, textColor, buttonColor, strokeColor, callBack){
  // console.log("create TextButton: ",string, relX, relY, scale, textColor, buttonColor, strokeColor, callBack);
    //constants
    this.baseSize = 10;
    this.roundness = 5;
    this.marginWidth = 20;
    this.marginHeight = 20;

    //colors
    this.textColor = textColor;
    this.buttonColor = buttonColor;
    this.strokeColor = strokeColor;

    this.string = string;
    this.scale = scale;
    textSize(this.baseSize*this.scale);
    this.stringHeight = textSize();
    this.stringWidth = textWidth(this.string);
    this.recWidth = this.stringWidth + this.marginWidth;
    this.recHeight = this.stringHeight + this.marginHeight;
    this.recX = Math.round((width * relX) - (this.recWidth/2));
    this.recY = Math.round((height * relY) - (this.recHeight/2));

    this.textX = this.recX + (this.marginWidth/2);
    this.textY = this.recY + this.stringHeight + (this.marginHeight/4);

    this.key = this.string + this.recX.toString() + this.recY.toString();

    this.clicked = function(){
      //see if the mouse is in the rect
      var hit = collidePointRect(mouseX, mouseY, this.recX, this.recY, this.recWidth, this.recHeight);
      if(hit){
        console.log(this.key, ' button clicked');
        callBack();
      }
    }

    this.changeScale = function(scale){
      this.scale = scale;
      textSize(this.baseSize*this.scale);
      this.stringHeight = textSize();
      this.stringWidth = textWidth(this.string);
      this.recHeight = this.stringHeight + this.marginHeight;
      this.recWidth = this.stringWidth + this.marginWidth;
      this.textY = this.recY + this.stringHeight + (this.marginHeight/4);
    }

    GUI.liveButtons.set(this.key, this);

    this.show = function(){
      stroke(this.strokeColor);
      strokeWeight(1);
      fill(this.buttonColor);
      rect(this.recX, this.recY, this.recWidth, this.recHeight, this.roundness);
      fill(this.textColor);
      textSize(this.stringHeight);
      text(this.string, this.textX, this.textY);
    }

}//end TextButton
