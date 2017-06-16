module.exports = GameState;
function GameState(frame, MAZELINES){
    this.frame = frame;
    this.time = new Date().getTime();
    this.mazeLines = MAZELINES;
    this.snakes = new Map();

    this.addSnake = function(snake){
        this.snakes.set(snake.name, snake);
    };

    this.removeSnake = function(snakeName){
        this.snakes.delete(snakeName);
    };

    this.update = function(frame) {
        this.frame = frame;
        this.time = new Date().getTime();

        //updateSnakes
        this.snakes.forEach(function(snake){
           snake.update();
        });
    };

    this.package = function(){
        var gameState = {
            frame: this.frame,
            time: this.time,
            mazeLines: this.mazeLines
        };
        gameState['snakes'] = Array.from(this.snakes.values());

        return gameState;
    };

}//end GameState class