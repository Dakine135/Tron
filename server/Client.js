module.exports = Client;
var CONFIG = require('./Config.js');
var GLOBALS = require('./Globals');
function Client(key, snake){
    this.key = key;
    var keySplit = key.split('');
    this.name = ""+keySplit[0]+keySplit[1]+keySplit[2]+keySplit[3]+keySplit[4]+keySplit[5];
    this.connectedAt = new Date();
    this.score = CONFIG.snakeDefaults.STARTSCORE;
    this.snake = snake;
    this.currentPowerUp = null;
    this.pings = [];
    this.avgPing = 10;

    this.startingScore = CONFIG.snakeDefaults.STARTSCORE;
    this.reset = function(){
        this.score = this.startingScore;
    };

    this.updatePing = function(pongTime, pingTime){
        var ping = Math.abs(pongTime - pingTime);
        if(this.pings.length < 30) {
            this.pings.push(ping);
        } else {
            var calculateAverage = 0;
            this.pings.forEach(function(ping){ calculateAverage = calculateAverage + ping});
            calculateAverage = Math.round(calculateAverage / this.pings.length);
            this.pings = [];
            this.avgPing = Math.round((calculateAverage + this.avgPing) / 2);
        }
    };

    this.package = function(){
      var packagedClient = {
          key: this.key,
          name: this.name,
          score: this.score,
          ping: this.avgPing
      };
      return packagedClient;
    }

}//end Client
