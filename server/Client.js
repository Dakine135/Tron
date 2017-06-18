module.exports = Client;
function Client(key, startScore, snake){
    this.key = key;
    var keySplit = key.split('');
    this.name = ""+keySplit[0]+keySplit[1]+keySplit[2]+keySplit[3]+keySplit[4]+keySplit[5];
    this.connectedAt = new Date();
    this.score = startScore;
    this.snake = snake;

    this.startingScore = startScore;
    this.reset = function(){
        this.score = this.startingScore;
    };

}//end Client