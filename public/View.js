function View(){

    this.x = -1;
    this.y = -1;

    this.lastDiffX = 0;
    this.lastDiffY = 0;

    this.xSpeed = 0;
    this.ySpeed = 0;

    this.zoom = 1;

    this.update = function(snake){
        var diffX = snake.x - this.x;
        var diffY = snake.y - this.y;
        var resetAmount = BOARD.cameraHeight * (3/4);
        if(this.x === -1 || this.y == -1) {
            this.x = snake.x;
            this.y = snake.y;
        } else {
            if (diffX < (resetAmount * -1) || resetAmount < diffX ||
                diffY < (resetAmount * -1) || resetAmount < diffY ) {
                //this was a jump across the screen from wrapping or spawn
                //console.log("jump");
                this.x = snake.x - this.lastDiffX;
                this.y = snake.y - this.lastDiffY;
                diffX = snake.x - this.x;
                diffY = snake.y - this.y;
            }
            this.xSpeed = Math.floor(Math.abs(diffX/20));
            this.ySpeed = Math.floor(Math.abs(diffY/20));
            this.x = this.x + (this.xSpeed * Math.sign(diffX));
            this.y = this.y + (this.ySpeed * Math.sign(diffY));
        }
        this.lastDiffX = diffX;
        this.lastDiffY = diffY;
    }
}