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


	this.init = function() {
        this.canvasWidth = Math.round((window.innerWidth - 50)/SETTINGS.GAMEGRIDSCALE)*SETTINGS.GAMEGRIDSCALE;
        this.canvasHeight = Math.round((window.innerHeight - 100)/SETTINGS.GAMEGRIDSCALE)*SETTINGS.GAMEGRIDSCALE;
		this.canvas = createCanvas(this.canvasWidth, this.canvasHeight);
		this.canvas.parent('CanvasContainer');
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
        MAZE = MAZE.map(function(l){
            var scaleW = this.width / SETTINGS.WIDTH;
            var scaleH = this.height / SETTINGS.HEIGHT;
            var lx1 = Math.ceil(l.x1*scaleW);
            var ly1 = Math.ceil(l.y1*scaleH);
            var lx2 = Math.ceil(l.x2*scaleW);
            var ly2 = Math.ceil(l.y2*scaleH);
            return {
                x1: lx1,
				y1: ly1,
				x2: lx2,
				y2: ly2,
				color: l.color
			};
        });
        this.snakes.forEach(function(snake){
			snake.scaleSnake();
        });
	};

	this.show = function(){
		if(this.background != null){
	    	background(this.background);
	  	}//if image is loaded
        if(MAZE && SETTINGS) {
            MAZE.forEach(function (l) {
            	//console.log(l);
                stroke(l.color);
                strokeWeight(SETTINGS.GAMEGRIDSCALE / 10);
                line(l.x1, l.y1, l.x2, l.y2);
            });
        }//if MAZE is generated
	}


}//end board
