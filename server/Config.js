//CONFIG OPTIONS
var Config = {
    WALLREMOVALFACTOR: 4,
    CEARUPSINGLEWALLS: true,
    LEAVEWALLEDGE: false,
    HEIGHT: 50*9,
    WIDTH: 50*16,
    NUMOFCELLS: 20,
    GAMEGRIDSCALE: null,
    TICKSPERSECOND: 30
};
Config.GAMEGRIDSCALE = (Config.WIDTH / Config.NUMOFCELLS);

Config.snakeDefaults = {
    SNAKETAIL: 700,
    SNAKESIZE: 15,
    SNAKESPEEDSCALE: 100,  //pixel positions per second (server "pixels")
    STARTSCORE: 10
};
module.exports = Config;