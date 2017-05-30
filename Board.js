function Board(){
	this.canvasWidth = 600;
	this.canvasHeight = 600;
	this.matrix = [];


	function init(){
		createCanvas(this.canvasWidth,this.canvasHeight);
	}
}//end board