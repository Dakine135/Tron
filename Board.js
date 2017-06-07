function Board(){
	//canvas stuff
	this.canvasWidth = 600;
	this.canvasHeight = 600;
	this.background = 50;
	this.canvas;

	//board stuff
	this.paused = false;

	//snake stuff
	this.snakes = new Map();


	this.init = function() {
		this.canvas = createCanvas(this.canvasWidth,this.canvasHeight);
		createCanvas(this.canvasWidth,this.canvasHeight);
		this.canvas.parent('CanvasContainer');
		document.getElementById("canvasWidthBox").value = width;
	  document.getElementById("canvasHeightBox").value = height;
	}

	this.startMenuSnakes = function(){
		var snake1Name = BOARD.addSnake("gui1", UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW,
				color(194, 254, 34), color(235, 29, 99), 400, 10);
		var snake2Name = BOARD.addSnake("gui2",87, 83, 65, 68,
				color(28, 20, 242), color(252, 14, 30), 400, 10);
		BOARD.snakes.get(snake1Name).dir(1,1);
		BOARD.snakes.get(snake1Name).chngColor();
		BOARD.snakes.get(snake2Name).chngColor();
		BOARD.snakes.get(snake2Name).dir(-1,1);
	}

	this.boardUpdate = function() {
		// background(50);
		this.snakes.forEach(function(s){
			s.update();
		});
		this.checkForCollisions();
	}//end boardUpdate

	this.resetBoard = function() {
		this.deleteSnakes();
		var snake1Name = BOARD.addSnake("Player1", UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW,
				color(194, 254, 34), color(235, 29, 99), 400, 10);
		var snake2Name = BOARD.addSnake("Player2",87, 83, 65, 68,
				color(28, 20, 242), color(252, 14, 30), 400, 10);
	}//end RestBoard

	//function to apply canvas size from input boxes
	this.canvasSize = function() {
	    var x = document.getElementById("canvasSizeform");
	    this.canvasWidth = x.elements[0].value;
	    this.canvasHeight = x.elements[1].value;
	    this.init();
	}

	//Makes the canvas as big at the current browser window can handle
	this.setCanvasToWindow = function(){
		this.canvasWidth = Math.round((window.innerWidth - 35)/GAMEGRIDSCALE)*GAMEGRIDSCALE;
		this.canvasHeight = Math.round((window.innerHeight - 180)/GAMEGRIDSCALE)*GAMEGRIDSCALE;
		this.init();
	}

//pause and un-pause the game
	this.pause = function(){
		if(this.paused){
			console.log("Game Resumed");
			document.getElementById("pauseButton").innerHTML = "Pause";
			this.paused = false;
		}else{
			console.log("Game Paused");
			document.getElementById("pauseButton").innerHTML = "Resume";
			this.paused = true;
		}
		this.snakes.forEach(function(snake,snakeName){
			snake.pause();
		});
	}//end pause

	/*
		Snake related stuff
	*/
	this.addSnake = function(snakeName,upButton, downButton, leftButton, rightButton, startColor, endColor, tailLength, size){
		var s = new Snake(snakeName, upButton, downButton, leftButton, rightButton, startColor, endColor, tailLength, size);
		s.intializeTailColor();
		this.snakes.set(snakeName,s);
		return snakeName;
	}

	this.checkControls = function(){
		this.snakes.forEach(function(snake,snakeName){
			snake.checkControls();
		});
	}

	this.showSnakes = function(){
		this.snakes.forEach(function(snake,snakeName){
			snake.show();
		});
	}

	this.resetSnakes = function(){
		this.snakes.forEach(function(snake,snakeName){
			snake.reset();
		});
	}

	this.deleteSnakes = function(){
		this.snakes.clear();
	}

	//random starting position based on secions partitioned by number of snakes total
  // this.setStartingPositions = function(){
  //   var partitions = BOARD.snakes.length;
  //   var lengthOfEachpartition = width/partitions;
	// 	for(var i=0; i<this.snakes.length; i++){
	// 		var x = 0; //todo
	// 	}
  // }//end setStartingPositions

	this.checkForCollisions = function(){
		//check if snakes run into tails (self and others)
		for(var snakeHeadKey of this.snakes.keys()){
			var snakeHead = this.snakes.get(snakeHeadKey);
			for(var snakeTailKey of this.snakes.keys()){
				if(snakeHeadKey != snakeTailKey){ //dont check collision with self
					var snakeTail = this.snakes.get(snakeTailKey);
					var collision = snakeHead.checkCollisionWithTail(snakeTail.tail);
			    if(collision != null){
						// console.log(collision);
						var amountCut = snakeTail.cutTail(collision);
						snakeTail.chngTail(-1*amountCut);
						snakeHead.chngTail(amountCut);
						//console.log(amountCut);
			    }
				}//check if itself

		  }//othersnake loop
		}//selfsnake loop

		//TODO check collision on walls of maze

	}// checkForCollisions


}//end board
