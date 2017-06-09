function editSnake(){
  this.snake;

  //colorChanger
  this.startColorR;
  this.startColorG;
  this.startColorB;

  this.endColorR;
  this.endColorG;
  this.endColorB;

  this.buttonCalledFrom;

  this.startX = 300;
  this.startY = 300;
  this.verticleSpaceing = 20;


  this.setSnake = function(snake, snakeButton){
    this.snake = snake;
    this.buttonCalledFrom = snakeButton;

    if(this.startColorR == null){
      this.startColorR = createSlider(0, 255, snake.startColor.levels[0], 1);
      this.startColorG = createSlider(0, 255, snake.startColor.levels[1], 1);
      this.startColorB = createSlider(0, 255, snake.startColor.levels[2], 1);

      this.endColorR = createSlider(0, 255, snake.endColor.levels[0], 1);
      this.endColorG = createSlider(0, 255, snake.endColor.levels[1], 1);
      this.endColorB = createSlider(0, 255, snake.endColor.levels[2], 1);
    } else {
      this.startColorR.value(snake.startColor.levels[0]);
      this.startColorG.value(snake.startColor.levels[1]);
      this.startColorB.value(snake.startColor.levels[2]);

      this.endColorR.value(snake.endColor.levels[0]);
      this.endColorG.value(snake.endColor.levels[1]);
      this.endColorB.value(snake.endColor.levels[2]);
    }
  }//end setSnake

  this.reset = function(){
    this.startColorR = null;
    this.startColorG = null;
    this.startColorB = null;

    this.endColorR = null;
    this.endColorG = null;
    this.endColorB = null;
  }


  this.show = function(){
    //slider.style('width', '80px');
    var veriticleSpace = 0;
    this.startColorR.position(this.startX, this.startY + veriticleSpace);
    //text("Start Red", this.startX - 100, this.startY + veriticleSpace);
    veriticleSpace = veriticleSpace + this.verticleSpaceing;
    this.startColorG.position(this.startX, this.startY + veriticleSpace);
    veriticleSpace = veriticleSpace + this.verticleSpaceing;
    this.startColorB.position(this.startX, this.startY + veriticleSpace);

    veriticleSpace = veriticleSpace + this.verticleSpaceing + 20;

    this.endColorR.position(this.startX, this.startY + veriticleSpace);
    veriticleSpace = veriticleSpace + this.verticleSpaceing;
    this.endColorG.position(this.startX, this.startY + veriticleSpace);
    veriticleSpace = veriticleSpace + this.verticleSpaceing;
    this.endColorB.position(this.startX, this.startY + veriticleSpace);

    //update snake's color
    this.snake.startColor = color(this.startColorR.value(), this.startColorG.value(), this.startColorB.value());
    this.snake.endColor = color(this.endColorR.value(), this.endColorG.value(), this.endColorB.value());
    this.snake.intializeTailColor();

    //callback to currently selected button to update color
    this.buttonCalledFrom.textColor = this.snake.startColor;
    this.buttonCalledFrom.buttonColor = this.snake.endColor;
    this.buttonCalledFrom.strokeColor = this.snake.startColor;

  }


}//end EditSnake
