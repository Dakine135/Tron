module.exports = GameState;
function GameState(frame, MAZELINES, CLIENTSETTINGS){
    this.frame = frame;
    this.time = new Date().getTime();
    this.mazeLines = MAZELINES;
    this.clientSettings = CLIENTSETTINGS;
    this.guiState = "startOfGame";
    this.previousState = this.guiState;
    this.snakes = new Map();

    this.addSnake = function(snake){
        snake.chngColorRandom();
        snake.intializeTailColor();
        //snake.spawn();
        this.snakes.set(snake.name, snake);
    };

    this.removeSnake = function(snakeName){
        if(this.snakes.has(snakeName)) {
            this.snakes.delete(snakeName);
        }
    };

    this.updateSnakeDir = function(snakeName, x, y){
      var snake = this.snakes.get(snakeName);
      snake.dir(x,y);
      this.snakes.set(snakeName, snake);
    };

    this.updateGuiState = function(guiState){
        if(guiState == "paused"){
            this.previousState = this.guiState;
            this.guiState = guiState;
        } else if(guiState == "resume"){
            this.guiState = this.previousState;
        } else{
            this.guiState = guiState;
        }

    };

    this.update = function(frame) {
        this.frame = frame;
        //this.time = new Date().getTime();

        if(this.guiState == "gameRunning"){
            //updateSnakes
            this.snakes.forEach(function(snake){
                snake.update();
            });
        }//guiState is gameRunning
    };

    this.package = function(NUMPLAYERSCONNECTED){
        var gameState = {
            frame: this.frame,
            time: new Date().getTime(),
            guiState: this.guiState,
            mazeLines: this.mazeLines,
            settings: this.clientSettings,
            playersConnected: NUMPLAYERSCONNECTED
        };
        gameState['snakes'] = Array.from(this.snakes.values());

        return gameState;
    };

}//end GameState class