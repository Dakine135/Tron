function Board(){
	//canvas stuff
    this.canvasWidth = null;
    this.canvasHeight = null;
	this.canvas = null;

	//board stuff
	this.paused = false;
	this.background = null;

	//snake stuff
	this.snakes = new Map();

    this.powerUps = [];


	this.init = function() {
        var totalHeight = Math.round((window.innerHeight - 150)/SETTINGS.GAMEGRIDSCALE)*SETTINGS.GAMEGRIDSCALE;
        var totalWidth = Math.round((window.innerWidth)/SETTINGS.GAMEGRIDSCALE)*SETTINGS.GAMEGRIDSCALE;
        var ratioW = totalWidth / 16;
		var ratioH = totalHeight / 9;
		var multiplier = Math.min(ratioW, ratioH);
       this.canvasWidth = 16*multiplier;
       this.canvasHeight = 9*multiplier;

        // this.canvasHeight = Math.round((window.innerHeight - 150)/SETTINGS.GAMEGRIDSCALE)*SETTINGS.GAMEGRIDSCALE;
        // this.canvasWidth = this.canvasHeight * (16/9);

		this.canvas = createCanvas(this.canvasWidth, this.canvasHeight);
		this.canvas.parent('CanvasContainer');
        document.getElementById("CanvasContainer").setAttribute('style',
            "width: "+this.canvasWidth+"px; "+
            "height: "+this.canvasHeight+"px; "+
            "min-width: "+this.canvasWidth+"px; "+
            "min-height: "+this.canvasHeight+"px; "
			//+ "border:1px solid #000000;"
        );
        this.createBackground();
        GUI.recalculateGui();
        BOARD.scaleBOARD();
	};

	this.checkControls = function(){
		this.snakes.get(SOCKET.id).checkControls();
	};

	this.showSnakes = function(){
		this.snakes.forEach(function(snake,snakeName){
			snake.show();
		});
	};

	this.showPowerUps = function(){
		this.powerUps.forEach(function(powerUp){
			fill(255,255,255);
			stroke(255,255,255);
			strokeWeight(Math.ceil(powerUp.size / 10));
			rect(powerUp.x, powerUp.y, (powerUp.size), powerUp.size);
		});
	};

	this.createBackground = function(){
	  console.log("createBackground");
	  loadImage('assets/backgroundToRepeat.jpg',function(img){
			//console.log("loaded image: ", img);
	    var newImage = new p5.Image(width,height);
	    //newImage.copy(img,0,0,img.width,img.height,0,0,img.width,img.height);

	    var widthRatio = Math.floor(width / img.width);
	    var remainingWidth = (width / img.width) - widthRatio;
	    var heightRatio = Math.floor(height /img.height);
	    var remainingHeight = (height /img.height) - heightRatio;
	    // console.log(widthRatio, heightRatio);

	    //copy(srcImage,sx,sy,sw,sh,
	    //dx,dy,dw,dh)
	    for(var h=0; h<heightRatio; h++){
	      //draw full row
	      for(var w=0; w<widthRatio; w++){
	        //full image
	        newImage.copy(img,0,0,img.width,img.height,
	          img.width*w,img.height*h,img.width,img.height);
	      }
	      //remaining of row
	      if(remainingWidth > 0){
	        newImage.copy(img,0,0,img.width*remainingWidth,img.height,
	          img.width*widthRatio,img.height*h,img.width*remainingWidth,img.height);
	      }
	      //end draw full row
	    }
	    //draw last partial row
	    if(remainingHeight > 0){
	      for(var w=0; w<widthRatio; w++){
	        //full image
	        newImage.copy(img,0,0,img.width,img.height*remainingHeight,
	          img.width*w,img.height*h,img.width,img.height*remainingHeight);
	      }
	      //remaing of row
	      if(remainingWidth > 0){
	        newImage.copy(img,0,0,img.width*remainingWidth,img.height*remainingHeight,
	          img.width*widthRatio,img.height*heightRatio,img.width*remainingWidth,img.height*remainingHeight);
	      }
	    }

	    this.background = newImage;
	    // BACKGROUNDIMAGE = testImg;
			//console.log("Finished createing background: ", this.background);
	  }.bind(this), function(error){
	    console.log("error createing back: ",error);
	  });

	};//end create background

	this.scaleBOARD = function(){
		if(MAZE && SETTINGS) {
            MAZE = MAZE.map(function (l) {
                //console.log(SETTINGS.WIDTH, SETTINGS.HEIGHT, "==>", width, height);
                var lx1 = Math.round((l.x1 / SETTINGS.WIDTH) * width);
                var lx2 = Math.round((l.x2 / SETTINGS.WIDTH) * width);
                var ly1 = Math.round((l.y1 / SETTINGS.HEIGHT) * height);
                var ly2 = Math.round((l.y2 / SETTINGS.HEIGHT) * height);
                //console.log(l.x1, l.y1, l.x2, l.y2, " ==> ",lx1, ly1, lx2, ly2);
                return {
                    x1: lx1,
                    y1: ly1,
                    x2: lx2,
                    y2: ly2,
                    color: l.color
                };
            });
            this.snakes.forEach(function (snake) {
                snake.scaleSnake();
            });
        }// make sure MAZE and SETTINGS are not null
	};

	this.show = function(){
		if(this.background != null){
	    	background(this.background);
	  	}//if image is loaded
        if(MAZE && SETTINGS) {
            MAZE.forEach(function (l) {
            	//console.log(l);
				var wallColor = color(l.color[0], l.color[1], l.color[2]);
                stroke(wallColor);
                strokeWeight(5);
                line(l.x1, l.y1, l.x2, l.y2);
            });
        }//if MAZE is generated
	}


}//end board
