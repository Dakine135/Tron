function TextButton(string, relX, relY, scale, textColor, buttonColor, strokeColor, callBack){
    //constants
    this.baseSize = 10;
    this.roundness = 5;
    this.marginWidth = 20;
    this.marginHeight = 20;

    this.string = string;
    textSize(this.baseSize*scale);
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

    GUI.liveButtons.set(this.key, this);

    this.show = function(){
      stroke(strokeColor);
      fill(buttonColor);
      rect(this.recX, this.recY, this.recWidth, this.recHeight, this.roundness);
      fill(textColor);
      textSize(this.stringHeight);
      text(this.string, this.textX, this.textY);
    }

}//end TextButton
