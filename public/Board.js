function Board(){
    //canvas stuff
    this.sceneWidth = null;
    this.sceneHeight = null;
    this.canvas = null;

    //cameraStuff
    this.cameraWidth = null;
    this.cameraHeight = null;
    this.cameraZoom = 1;

    //board stuff
    this.paused = false;
    this.background = null;
    this.currentPowerUp = null;
    var img;
    //img = loadImage('/assets/emptyPowerUp.png');

    //snake stuff
    this.snakes = new Map();
    this.powerUps = [];
    this.snakeGoal = null;

    //space for stuff
    this.boarder = 3;
    this.hud = 230;

    var that = this;

    this.init = function() {
        console.log("BOARD.init() Called");

        if(SETTINGS) {
            var totalHeight = Math.round((window.innerHeight - this.hud - (this.boarder * 2))
                    / SETTINGS.GAMEGRIDSCALE) * SETTINGS.GAMEGRIDSCALE;
            var totalWidth = Math.round((window.innerWidth - (this.boarder * 2))
                    / SETTINGS.GAMEGRIDSCALE) * SETTINGS.GAMEGRIDSCALE;
            var ratioW = totalWidth / 16;
            var ratioH = totalHeight / 9;
            var multiplier = Math.min(ratioW, ratioH);
            this.cameraWidth = Math.floor(16 * multiplier);
            this.cameraHeight = Math.floor(9 * multiplier);
        } else {
            this.cameraWidth = 800;
            this.cameraHeight = 450;
        }


        if(FIRSTPERSON){
            this.sceneWidth = this.cameraWidth * 3;
            this.sceneHeight = this.cameraHeight  * 3;
        } else {
            this.sceneWidth = this.cameraWidth;
            this.sceneHeight = this.cameraHeight;
        }

        // console.log("BOARD init: FIRSTPERSON, cameraWH, sceneWH ",FIRSTPERSON,
        // 	this.cameraWidth, this.cameraHeight, this.sceneWidth, this.sceneHeight);



        this.canvas = createCanvas(this.cameraWidth, this.cameraHeight);
        this.canvas.parent('CanvasContainer');
        document.getElementById("CanvasContainer").setAttribute('style',
            "width: "+this.cameraWidth+"px; "+
            "height: "+this.cameraHeight+"px; "+
            "min-width: "+(this.cameraWidth+(this.boarder*2))+"px; "+
            "min-height: "+(this.cameraHeight+(this.boarder*2))+"px; "+
            "border-style: solid; "+
            "border-color: #18CAE6;"+
            "border-width: "+this.boarder+"px; "
            //+ "border:1px solid #000000;"
        );
        document.getElementById("Stats").setAttribute('style',
          "width: "+this.cameraWidth+"px; "+
          "min-width: "+(this.cameraWidth+(this.boarder*2))+"px; "+
          "left: 0; "+
          "right: 0; "+
          "margin: auto;"
        );
        document.getElementById("TopGrid").setAttribute('style',
          "width: "+this.cameraWidth+"px; "+
          "min-width: "+(this.cameraWidth+(this.boarder*2))+"px; "+
          "left: 0; "+
          "right: 0; "+
          "margin: auto;"
        );
        this.createBackground();
        GUI.recalculateGui();
        this.scaleBOARD();
    };

    this.checkControls = function(){
        this.snakes.get(SOCKET.id).checkControls();
    };

    this.updateSnakes = function(){
        if(GUI.currentState === "gameRunning"){
            //updateSnakes
            this.snakes.forEach(function(snake){
                snake.update();
            });
        }//guiState is gameRunning
    };

    this.showSnakes = function(){
        this.snakes.forEach(function(snake){
            if(FIRSTPERSON) {
                for (var y = -1; y <= 1; y++) {
                    var h = that.cameraHeight * y;
                    for (var x = -1; x <= 1; x++) {
                        var w = that.cameraWidth * x;
                        snake.show(w, h);
                    }//for columns
                }//for rows
            } else {
                snake.show();
            }

        });
    };

    this.showPowerUps = function(){
        this.powerUps.forEach(function(powerUp){
          //console.log("THIS IS POWERUP", powerUp);
            if(FIRSTPERSON) {
                for (var y = -1; y <= 1; y++) {
                    var h = that.cameraHeight * y;
                    for (var x = -1; x <= 1; x++) {
                        var w = that.cameraWidth * x;

                        fill(255, 255, 255);
                        stroke(255, 255, 255);
                        strokeWeight(Math.ceil(powerUp.size / 10));
                        rect(powerUp.x + w, powerUp.y + h, (powerUp.size), powerUp.size);
                    }//for columns
                }//for rows
            } else {
                fill(powerUp.color[0],powerUp.color[1],powerUp.color[2]);
                stroke(255, 255, 0);
                strokeWeight(Math.ceil(powerUp.size / 10));
                rect(powerUp.x, powerUp.y, (powerUp.size), powerUp.size);
            }
        });
    };

    this.createBackground = function(){
        //console.log("RAWBACKGROUDIMG: ", RAWBACKGROUDIMG);
        if(this.background == null ||
            this.background.width != this.sceneWidth ||
            this.background.height != this.sceneHeight) {
            var img = RAWBACKGROUDIMG;
            var newImageWidth = this.sceneWidth;
            var newImageHeight = this.sceneHeight;
            var newImage = new p5.Image(newImageWidth, newImageHeight);

            //console.log("createBackground scene: ", width, height, "img: ",newImageWidth, newImageHeight);

            var widthRatio = Math.floor(newImageWidth / img.width);
            var remainingWidth = (newImageWidth / img.width) - widthRatio;
            var heightRatio = Math.floor(newImageHeight / img.height);
            var remainingHeight = (newImageHeight / img.height) - heightRatio;

            for (var h = 0; h < heightRatio; h++) {
                //draw full row
                for (var w = 0; w < widthRatio; w++) {
                    //full image
                    newImage.copy(img, 0, 0, img.width, img.height,
                        img.width * w, img.height * h, img.width, img.height);
                }
                //remaining of row
                if (remainingWidth > 0) {
                    newImage.copy(img, 0, 0, img.width * remainingWidth, img.height,
                        img.width * widthRatio, img.height * h, img.width * remainingWidth, img.height);
                }
                //end draw full row
            }
            //draw last partial row
            if (remainingHeight > 0) {
                for (var w = 0; w < widthRatio; w++) {
                    //full image
                    newImage.copy(img, 0, 0, img.width, img.height * remainingHeight,
                        img.width * w, img.height * h, img.width, img.height * remainingHeight);
                }
                //remaing of row
                if (remainingWidth > 0) {
                    newImage.copy(img, 0, 0, img.width * remainingWidth, img.height * remainingHeight,
                        img.width * widthRatio, img.height * heightRatio, img.width * remainingWidth, img.height * remainingHeight);
                }
            }

            this.background = newImage;
            //console.log("Finished creating background: ", this.background);
        }


    };//end create background

    this.scaleBOARD = function(){
        if(MAZE && SETTINGS) {
            MAZE = CURRENTGAMESTATE.mazeLines.lines;
            MAZE = MAZE.map(function (l) {
                var lx1 = (l.x1 / SETTINGS.WIDTH) * that.cameraWidth;
                var lx2 = (l.x2 / SETTINGS.WIDTH) * that.cameraWidth;
                var ly1 = (l.y1 / SETTINGS.HEIGHT) * that.cameraHeight;
                var ly2 = (l.y2 / SETTINGS.HEIGHT) * that.cameraHeight;
                return {
                    x1: lx1,
                    y1: ly1,
                    x2: lx2,
                    y2: ly2,
                    color: l.color
                };
            });
        }// make sure MAZE and SETTINGS are not null
        if(SETTINGS) {
            this.snakes.forEach(function (snake) {
                snake.scaleSnake();
            });

            if(CURRENTGAMESTATE && this.powerUps.length > 0) {
                this.powerUps = CURRENTGAMESTATE.powerUps.powerUps;
                //console.log("BEFORE: ", BOARD.powerUps[0]);
                this.powerUps.forEach(function (powerUp) {
                    powerUp.x = (powerUp.x / SETTINGS.WIDTH) * that.cameraWidth;
                    powerUp.y = (powerUp.y / SETTINGS.HEIGHT) * that.cameraHeight;
                    //scaled.size = Math.round((scaled.size / SETTINGS.WIDTH) * that.cameraWidth);
                });
                //console.log("AFTER: ", this.powerUps[0]);
            }


        } // make sure SETTINGS is not null
    };

    this.show = function(){
        background(color(0,0,0));
        if(this.background){
            if(FIRSTPERSON) {
                image(this.background, -this.cameraWidth / 2, -this.cameraHeight / 2,
                    this.sceneWidth, this.sceneHeight);
            } else {
                background(this.background);
            }
        }//if image is loaded

        if(this.currentPowerUp){
            this.currentPowerUp = null;
        }
        else {

            //copy(img,0,0, img.width, img.height, (this.cameraWidth-45), 25, 20, 20);
            //tint(255,127)
        }//Power up shown

        if(MAZE && SETTINGS) {
            if(FIRSTPERSON) {
                for (var y = -1; y <= 1; y++) {
                    var h = this.cameraHeight * y;
                    for (var x = -1; x <= 1; x++) {
                        var w = this.cameraWidth * x;
                        MAZE.forEach(function (l) {
                            //console.log(l);
                            var wallColor = color(l.color[0], l.color[1], l.color[2]);
                            //var wallColor = color((100+(50*x)+(50*y)),(100+(50*x)+(50*y)),(100+(50*x)+(50*y)));
                            stroke(wallColor);
                            strokeWeight(5);
                            line(l.x1 + w, l.y1 + h, l.x2 + w, l.y2 + h);
                        });

                    }//for columns
                }//for rows
            } else {
                MAZE.forEach(function (l) {
                    //console.log(l);
                    var wallColor = color(l.color[0], l.color[1], l.color[2]);
                    stroke(wallColor);
                    strokeWeight(5);
                    line(l.x1, l.y1, l.x2, l.y2);
                });
            }
        }//if MAZE is generated

        if(this.snakeGoal){
            //scale snake goal
            var goalX = Math.round((this.snakeGoal.x / SETTINGS.WIDTH) * that.cameraWidth);
            var goalY = Math.round((this.snakeGoal.y / SETTINGS.WIDTH) * that.cameraWidth);
            var goalSize = Math.round((this.snakeGoal.size / SETTINGS.WIDTH) * that.cameraWidth);

            fill(255,0,0);
            stroke(0, 0, 255);
            strokeWeight(goalSize/5);
            rect(goalX, goalY, goalSize, goalSize);

        }
    }


}//end board
