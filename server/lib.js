var LIB = require('./lib.js');

exports.randomInt = function(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

exports.dist = function(x1, y1, x2, y2){
    var xs = 0;
    var ys = 0;

    xs = x2 - x1;
    xs = xs * xs;

    ys = y2 - y1;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
    // return Math.sqrt(Math.pow((x2-x1), 2)+Math.pow((y2-y1), 2));
};

exports.collidePointLine = function(px,py,x1,y1,x2,y2, buffer){
    // get distance from the point to the two ends of the line
    //var d1 = Math.sqrt(Math.pow((px-x1), 2)+Math.pow((py-y1), 2));
    //var d2 = Math.sqrt(Math.pow((px-x2), 2)+Math.pow((py-y2), 2));
    var d1 = LIB.dist(px, py, x1, y1);
    var d2 = LIB.dist(px, py, y1, y2);
    // get the length of the line
    var lineLen = LIB.dist(x1,y1,x2,y2);

    // if the two distances are equal to the line's length, the point is on the line!
    // note we use the buffer here to give a range, rather than one #
    if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
        return true;
    }
    return false;
};//end collidePointLine

exports.collideLineLine = function(x1, y1, x2, y2, x3, y3, x4, y4) {

    var intersection;

    // calculate the distance to intersection point
    var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

        // calc the point where the lines meet
        var intersectionX = x1 + (uA * (x2-x1));
        var intersectionY = y1 + (uA * (y2-y1));

        intersection = {
            "x": intersectionX,
            "y": intersectionY,
            hit: true
        };
        return intersection;
    }

    intersection = {
        "x":null,
        "y":null,
        hit: false
    };
    return intersection;

}; //end collideLineLine
