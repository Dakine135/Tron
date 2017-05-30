function Board(){
	this.canvasWidth = 600;
	this.canvasHeight = 600;
	this.background = 50;
	this.canvas;
	this.matrix = [];


	this.init = function() {
		this.canvas = createCanvas(this.canvasWidth,this.canvasHeight);
		this.canvas.parent('CanvasContainer');
		background(this.background);
	}

	//function to apply canvas size from input boxes
	function canvasSize() {
	    var x = document.getElementById("canvasSizeform");
	    var canvasWidthForm = x.elements[0].value;
	    var canvasHeightForm = x.elements[1].value;
	    createCanvas(canvasWidth,canvasHeight);
	}

	//Makes the canvas as big at the current browser window can handle
	function setCanvasToWindow(){
		window.innerHeight;
		window.innerWidth;
		createCanvas((windowWidth - 35),(windowHeight - 230));
	}

}//end board
