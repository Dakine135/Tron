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
    SNAKETAIL: 800,
    SNAKESIZE: 15,
    SNAKESPEEDSCALE: 3,
    STARTSCORE: 10
};
module.exports = Config;