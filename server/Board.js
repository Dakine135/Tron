module.exports = Board;
function Board(){
	//canvas stuff
	this.canvasWidth = Math.round((window.innerWidth - 200)/GAMEGRIDSCALE)*GAMEGRIDSCALE;
	this.canvasHeight = Math.round((window.innerHeight - 300)/GAMEGRIDSCALE)*GAMEGRIDSCALE;
	this.canvas = null;

	//board stuff
	this.paused = false;
	this.background = null;

	//snake stuff
	this.snakes = new Map();


	this.init = function() {
		this.canvas = createCanvas(this.canvasWidth, this.canvasHeight);
		this.canvas.parent('CanvasContainer');
	};

	this.startMenuSnakes = function(){
		var snake1Name = BOARD.addSnake("gui1", UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW,
				color(194, 254, 34), color(235, 29, 99), 400, 10);
		var snake2Name = BOARD.addSnake("gui2",87, 83, 65, 68,
				color(28, 20, 242), color(252, 14, 30), 400, 10);
		BOARD.snakes.get(snake1Name).dir(1,1);
		BOARD.snakes.get(snake1Name).chngColor();
		BOARD.snakes.get(snake2Name).chngColor();
		BOARD.snakes.get(snake2Name).dir(-1,1);
	};

	this.boardUpdate = function() {
		this.snakes.forEach(function(s){
			s.update();
            // var snakeUpdate = {
				// x: s.x,
				// y: s.y
            // };
            // SOCKET.sendSnake(snakeUpdate);
		});
		this.checkForCollisions();
	};//end boardUpdate

	this.resetBoard = function() {
		this.deleteSnakes();
		// var snake1Name = BOARD.addSnake("Player1", UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW,
		// 		color(194, 254, 34), color(235, 29, 99), 400, 15);
		// var snake2Name = BOARD.addSnake("Player2",87, 83, 65, 68,
		// 		color(28, 20, 242), color(252, 14, 30), 400, 15);
	};//end RestBoard

	//function to apply canvas size from input boxes
	this.setCanvasSize = function(inputWidth,inputHeight) {
		console.log("BOARD.setCanvasSize called: ", inputWidth, inputHeight);
		if(width == inputWidth && height == inputHeight){
			console.log("no change in canvas size");
		} else {
            this.canvasWidth = inputWidth;
            this.canvasHeight = inputHeight;
            this.init();
            BOARD.createBackground();
        }
	};

//pause and un-pause the game
	this.pause = function(){
		if(this.paused){
			console.log("Game Resumed");
			GUI.guiState("gameRunning", false);
			document.getElementById("pauseButton").innerHTML = "Pause";
			this.paused = false;
		}else{
			console.log("Game Paused");
			GUI.guiState("paused", false);
			document.getElementById("pauseButton").innerHTML = "Resume";
			this.paused = true;
		}
		this.snakes.forEach(function(snake,snakeName){
			snake.pause();
		});
	};//end pause

	/*
		Snake related stuff
	*/
	this.addSnake = function(snakeName,upButton, downButton, leftButton, rightButton, startColor, endColor, tailLength, size){
		var s = new Snake(snakeName, upButton, downButton, leftButton, rightButton, startColor, endColor, tailLength, size);
		s.intializeTailColor();
		s.spawn();
		this.snakes.set(snakeName,s);
		return snakeName;
	};

    this.addSnakeByForm = function(){
        var snakeName = document.getElementById("snakeName").value;
        var startColor = color(floor(random(0,256)),floor(random(0,256)),floor(random(0,256)));
        var endColor = color(floor(random(0,256)),floor(random(0,256)),floor(random(0,256)));
        this.addSnake(snakeName, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW,
            startColor, endColor, 400, 15);

		var s = this.snakes.get(snakeName);
        var remoteSnake = {
            x:s.x,
            y:s.y,
            name:snakeName,
            startColor: s.startColor,
            endColor: s.endColor,
            tail: s.maxTailLength,
            size: s.size
        };
        SOCKET.addSnake(remoteSnake);
	};

    this.addRemoteSnake = function(snakeName, x, y, startColor, endColor, tail, size){
        var s = new Snake(snakeName, null, null, null, null, startColor, endColor, tail, size);
        console.log("add snake Remote: ", s);
        s.intializeTailColor();
        s.x = x;
        s.y = y;
        this.snakes.set(snakeName,s);
    };

	this.checkControls = function(){
		this.snakes.forEach(function(snake,snakeName){
			snake.checkControls();
		});
	};

	this.resetSnakes = function(){
		this.snakes.forEach(function(snake,snakeName){
			snake.reset();
		});
	};

	this.deleteSnakes = function(){
		this.snakes.clear();
	};

    this.collidePointLine = function(px,py,x1,y1,x2,y2, buffer){
        // get distance from the point to the two ends of the line
        var d1 = Math.sqrt(Math.pow((px-x1), 2)+Math.pow((py-y1), 2));
        var d2 = Math.sqrt(Math.pow((px-x2), 2)+Math.pow((py-y2), 2));

		// get the length of the line
        var lineLen = Math.sqrt(Math.pow((x1-x2), 2)+Math.pow((y1-y2), 2));

		// since floats are so minutely accurate, add a little buffer zone that will give collision
        if (buffer === undefined){ buffer = 0.1; }   // higher # = less accurate

		// if the two distances are equal to the line's length, the point is on the line!
		// note we use the buffer here to give a range, rather than one #
        if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
            return true;
        }
        return false;
    };//end collidePointLine

    this.checkCollisionWithWalls = function(snake){
        var output = null;
        MAZE.forEach(function(l){
            var hit = collidePointLine(snake.x, snake.y, l.x1, l.y1, l.x2, l.y2, snake.size/4);
            if(hit){
                // console.log(l.key);
                output = l;
                return output;
            }
        });
        return output;
    };//end checkCollisionWithWalls


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
						// var amountCut = snakeTail.cutTail(collision);
						// snakeTail.chngTail(-1*amountCut);
						// snakeHead.chngTail(amountCut);
						snakeTail.tail[collision.tail].color = color(255,255,255);
                    	snakeHead.spawn();
			    }
				}//check if itself
		  }//othersnake loop

			if(MAZE){
				var wallHit = this.checkCollisionWithWalls(snakeHead);
				if(wallHit != null){
					//wallHit.color = color(255,255,255);
                    snakeHead.spawn();
					//  console.log("wall Hit");
				 }
		 }//if a maze has been generated


		}//selfsnake loop
	};// checkForCollisions

	// this.createBackground = function(){
	//   console.log("createBackground");
	//   loadImage('assets/backgroundToRepeat.jpg',function(img){
	// 		//console.log("loaded image: ", img);
	//     var newImage = new p5.Image(width,height);
	//     //newImage.copy(img,0,0,img.width,img.height,0,0,img.width,img.height);
    //
	//     var widthRatio = Math.floor(width / img.width);
	//     var remainingWidth = (width / img.width) - widthRatio;
	//     var heightRatio = Math.floor(height /img.height);
	//     var remainingHeight = (height /img.height) - heightRatio;
	//     // console.log(widthRatio, heightRatio);
    //
	//     //copy(srcImage,sx,sy,sw,sh,
	//     //dx,dy,dw,dh)
	//     for(var h=0; h<heightRatio; h++){
	//       //draw full row
	//       for(var w=0; w<widthRatio; w++){
	//         //full image
	//         newImage.copy(img,0,0,img.width,img.height,
	//           img.width*w,img.height*h,img.width,img.height);
	//       }
	//       //remaining of row
	//       if(remainingWidth > 0){
	//         newImage.copy(img,0,0,img.width*remainingWidth,img.height,
	//           img.width*widthRatio,img.height*h,img.width*remainingWidth,img.height);
	//       }
	//       //end draw full row
	//     }
	//     //draw last partial row
	//     if(remainingHeight > 0){
	//       for(var w=0; w<widthRatio; w++){
	//         //full image
	//         newImage.copy(img,0,0,img.width,img.height*remainingHeight,
	//           img.width*w,img.height*h,img.width,img.height*remainingHeight);
	//       }
	//       //remaing of row
	//       if(remainingWidth > 0){
	//         newImage.copy(img,0,0,img.width*remainingWidth,img.height*remainingHeight,
	//           img.width*widthRatio,img.height*heightRatio,img.width*remainingWidth,img.height*remainingHeight);
	//       }
	//     }
    //
	//     // stroke(255);
	//     // strokeWeight(10);
	//     // newImage.line(0,0,500,500);
    //
	//     //idea to draw walls onto a canvas and flatten to image.
	//     //will be more effecient and allow walls to be a texture
	//     // var pPixels;
	//     // var sketch = function(p){
	//     //   p.x = 100;
	//     //   p.y = 100;
	//     //   p.setup = function(){
	//     //     p.createCanvas(100,100);
	//     //     p.noLoop();
	//     //   }
	//     //   p.draw = function(){
	//     //     p.background(p.color(200,30,100));
	//     //     p.fill(p.color(30,100,200));
	//     //     p.rect(20,20,p.width,p.height);
	//     //     p.loadPixels();
	//     //     pPixels = p.pixels;
	//     //   }
	//     //
	//     // }
	//     // var testP5 = new p5(sketch);
	//     // console.log(pPixels);
	//     // var testImg = new p5.Image(100,100);
	//     // testImg.loadPixels();
	//     // testImg.pixels = pPixels;
	//     // testImg.updatePixels();
	//     // console.log(testImg);
	//     // console.log(newImage);
    //
	//     // newImage.mask(testImg);
    //
	//     this.background = newImage;
	//     // BACKGROUNDIMAGE = testImg;
	// 		//console.log("Finished createing background: ", this.background);
	//   }.bind(this), function(error){
	//     console.log("error createing back: ",error);
	//   });
    //
	// };//end create background

	// this.show = function(){
	// 	if(this.background != null){
	//     	background(this.background);
	//   	}//if image is loaded
     //    if(MAZE) {
     //        MAZE.forEach(function (l) {
     //        	//console.log(l);
     //            stroke(l.color);
     //            strokeWeight(GAMEGRIDSCALE / 10);
     //            line(l.x1, l.y1, l.x2, l.y2);
     //        });
     //    }//if MAZE is generated
	// }//end show


}//end board
