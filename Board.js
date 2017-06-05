function Board(){
	//canvas stuff
	this.canvasWidth = 600;
	this.canvasHeight = 600;
	this.background = 50;
	this.canvas;

	//board stuff
	this.matrix = [];
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

	this.boardUpdate = function() {
		background(50);
		this.snakes.forEach(function(s){
			s.update();
		});
		this.checkForCollisions();
	}//end boardUpdate

	this.resetBoard = function() {
	  scl = 10;
	  speed = 0.4;
	  lastX = 0;
	  lastY = 0;
	  lastSpeed = speed;
	  startTime = new Date().getTime();
	  currentTick = 0;
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
		this.canvasWidth = window.innerWidth - 35;
		this.canvasHeight = window.innerHeight - 180;
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
	this.addSnake = function(snakeName,upButton, downButton, leftButton, rightButton, startColor, endColor){
		var s = new Snake(snakeName, upButton, downButton, leftButton, rightButton, startColor, endColor);
		s.intializeTailColor();
		this.snakes.set(snakeName,s);
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
				var snakeTail = this.snakes.get(snakeTailKey);
				var collisionAt = snakeHead.checkCollisionWithTail(snakeTail.tail);
		    if(collisionAt > 0){
					// console.log(collisionAt);
					snakeTail.cutTail(collisionAt);
		    }
		  }//othersnake loop
		}//selfsnake loop
	}// checkForCollisions


}//end board
