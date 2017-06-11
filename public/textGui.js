function createText(textString, relX, relY, scale, textColor, strokeColor){
  //constants
  this.baseSize = 10;

  //colors
  this.textColor = textColor;
  this.strokeColor = strokeColor;

  textSize(this.baseSize*scale);
  this.string = textString;
  this.stringHeight = textSize();
  this.stringWidth = textWidth(this.string);
  this.textX = (width*relX) - (this.stringWidth/2);
  this.textY = (height*relY)+(this.stringHeight/2);
  this.key = this.string + this.textX.toString() + this.textY.toString();

  GUI.liveText.set(this.key, this);

  this.recalculatePosition = function(){
    this.textX = (width*relX) - (this.stringWidth/2);
    this.textY = (height*relY)+(this.stringHeight/2);
    this.key = this.string + this.textX.toString() + this.textY.toString();
  }

  this.show = function(){
    fill(this.textColor);
    stroke(this.strokeColor);
    textSize(this.stringHeight);
    text(this.string, this.textX, this.textY);
  }

}
