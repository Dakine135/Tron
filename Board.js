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
	this.addSnake = function(upButton,downButton,leftButton,rightButton){
		var s = new Snake(upButton,downButton,leftButton,rightButton);
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




}//end board
