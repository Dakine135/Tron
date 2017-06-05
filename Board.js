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
	this.snakes = [];


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
			s.pause();
		}else{
			console.log("Game Paused");
			document.getElementById("pauseButton").innerHTML = "Resume";
			this.paused = true;
			s.pause();
		}
	}//end pause

	/*
		Snake related stuff
	*/
	this.addSnake = function(snakeName,upButton, downButton, leftButton, rightButton, startColor, endColor){
		var s = new Snake(snakeName, upButton, downButton, leftButton, rightButton, startColor, endColor);
		s.intializeTailColor();
		this.snakes.push(s);
	}

	this.checkControls = function(){
		this.snakes.forEach(function(s){
			s.checkControls();
		});
	}

	this.showSnakes = function(){
		this.snakes.forEach(function(s){
			s.show();
		});
	}

	this.resetSnakes = function(){
		this.snakes.forEach(function(s){
			s.reset();
		});
	}

	//random starting position based on secions partitioned by number of snakes total
  this.setStartingPositions = function(){
    var partitions = BOARD.snakes.length;
    var lengthOfEachpartition = width/partitions;
		for(var i=0; i<this.snakes.length; i++){
			var x = 0; //todo
		}
  }//end setStartingPositions

	this.checkForCollisions = function(){
		//console.log("dist / currTailLength: ", this.snakes[0].currTailLength, " / ", this.snakes[0].tail.length);
		//check if snakes run into tails (self and others)
		for(var snakeHeadIndex = 0; snakeHeadIndex<this.snakes.length; snakeHeadIndex++){
			//collision with self
			var snakeHead = this.snakes[snakeHeadIndex];
			for(var snakeTailIndex = 0; snakeTailIndex<this.snakes.length; snakeTailIndex++){
				var snakeTail = this.snakes[snakeTailIndex];
				var collisionAt = snakeHead.checkCollisionWithTail(snakeTail.tail);
		    if(collisionAt > 0){
					//console.log(collisionAt);
		      // this.snakes[otherSnake].tail[collisionAt].color = color(255,255,255);
					this.snakes[snakeTailIndex].cutTail(collisionAt);
		    }
		  }//othersnake loop
		}//selfsnake loop
	}// checkForCollisions


}//end board
