// Depth-first search
// Recursive backtracker
// https://en.wikipedia.org/wiki/Maze_generation_algorithm
module.exports = Maze;
var hash = require('object-hash');
function Maze(cellWidth, width, height, RemoveWallsChance, removeLoneWalls, leaveWallEdge){
  console.log("CreateMaze: cellWidth, width, height, RemoveWallsChance, removeLoneWalls, leaveWallEdge: ",
    cellWidth,width, height, RemoveWallsChance, removeLoneWalls, leaveWallEdge);

this.w = cellWidth;
this.cols = Math.floor(width/this.w);
this.rows = Math.floor(height/this.w);
this.grid = [];
this.lines = new Map();
this.current = null;
this.stack = [];
this.finished = false;
this.knockOutWalls = RemoveWallsChance;
this.removeLoneWalls = removeLoneWalls;
this.leaveWallEdge = leaveWallEdge;

this.generateMaze = function() {
    for (var j = 0; j < this.rows; j++) {
        for (var i = 0; i < this.cols; i++) {
            var cell = new Cell(i, j, this);
            this.grid.push(cell);
        }
    }
    this.current = this.grid[0];

    while (!this.finished) {
        this.current.visited = true;
        var next = this.current.checkNeighbors();
        if (next) {
            next.visited = true;
            this.stack.push(this.current);
            this.removeWalls(this.current, next);
            this.current = next;
        } else if (this.stack.length > 0) {
            this.current = this.stack.pop();
        } else {
            this.finished = true;
            for (var i = 0; i < this.grid.length; i++) {
                if (this.knockOutWalls > 0) {
                    this.grid[i].knockoutRandomWall(this.knockOutWalls);
                    this.grid[i].removeOuterWalls(this.leaveWallEdge);
                }
                this.grid[i].getLines().forEach(function (line) {
                    line['key'] = line.x1.toString() + line.y1.toString() + line.x2.toString() + line.y2.toString();
                    this.lines.set(line.key, line);
                }.bind(this));
            }
            if(this.removeLoneWalls) this.removeSingleWalls();
            var output = {
                hash: "",
                lines: []
            };
            this.lines.forEach(function(line){
              //console.log("line: ", line);
              var newLine = {
                x1: line.x1,
                  y1: line.y1,
                  x2: line.x2,
                  y2: line.y2,
                  color: [4,255,239]
              };
              //console.log("newline: ", newLine);
              output.lines.push(newLine);
            });
            console.log("Finished making maze: ", this.lines.size, " Lines");
            console.log("num of cells: ", this.grid.length);
            output.hash = hash(output.lines);
            console.log("mazeHash: ", output.hash);
            return output;
        }//game finished
    } //until finished
};

this.removeSingleWalls = function(){
    var lines = Array.from(this.lines.values());
    //console.log(lines);
    var index = 0;
    while(index < lines.length){
        //check if connected line, aka, another line with same xy (start or end)
        var currLine = lines[index];
        var subIndex = 0;
        var foundLink = false;
        while(subIndex < lines.length && !foundLink){
            var checkLine = lines[subIndex];
            if(index === subIndex){
                //dont check
            } else if((currLine.x1 === checkLine.x1 && currLine.y1 === checkLine.y1) ||
                      (currLine.x1 === checkLine.x2 && currLine.y1 === checkLine.y2) ||
                      (currLine.x2 === checkLine.x1 && currLine.y2 === checkLine.y1) ||
                      (currLine.x2 === checkLine.x2 && currLine.y2 === checkLine.y2) ){
                //then the lines meet
                foundLink = true;
            }
            subIndex++;
        }//sub index loop
        if(!foundLink){
            this.lines.delete(currLine.key);
            lines = Array.from(this.lines.values());
        }else index++;
    }//main loop
}; // end removeSingleWalls


this.index = function(i, j) {
  if (i < 0 || j < 0 || i > this.cols-1 || j > this.rows-1) {
    return null;
  }
  return i + j * this.cols;
};


this.removeWalls = function(a, b) {
    var x = a.i - b.i;
    if (x === 1) {
      a.walls[3] = false;
      b.walls[1] = false;
    } else if (x === -1) {
      a.walls[1] = false;
      b.walls[3] = false;
    }
    var y = a.j - b.j;
    if (y === 1) {
      a.walls[0] = false;
      b.walls[2] = false;
    } else if (y === -1) {
      a.walls[2] = false;
      b.walls[0] = false;
    }
  };

  // this.checkCollisionWithWalls = function(snake){
  //   var output = null;
  //   var lines = this.lines.value;
  //   this.lines.forEach(function(l){
  //       hit = collidePointLine(snake.x, snake.y, l.x1, l.y1, l.x2, l.y2, snake.size/4);
  //       if(hit){
  //         // console.log(l.key);
  //          output = l;
  //          return output;
  //        }
  //   });
  //   return output;
  // };


  function Cell(i, j, maze) {

    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbors = function() {
      var neighbors = [];
      var top    = maze.grid[maze.index(this.i, this.j -1)];
      var right  = maze.grid[maze.index(this.i+1, this.j)];
      var bottom = maze.grid[maze.index(this.i, this.j+1)];
      var left   = maze.grid[maze.index(this.i-1, this.j)];

      // console.log(top,right,bottom,left);

      if (top && !top.visited) {
        neighbors.push(top);
      }
      if (right && !right.visited) {
        neighbors.push(right);
      }
      if (bottom && !bottom.visited) {
        neighbors.push(bottom);
      }
      if (left && !left.visited) {
        neighbors.push(left);
      }

      // console.log(neighbors);

      if (neighbors.length > 0) {
        var r = Math.floor(Math.random() * neighbors.length);
        return neighbors[r];
      } else {
        return undefined;
      }
    }; //end checkNeighbors

    this.knockoutRandomWall = function(number){
      var r = Math.floor(Math.random() * 4);
      var attempts = number;
      while(attempts>0){
        this.walls[r] = false;
        r = Math.floor(Math.random() * 4);
        attempts--;
      }
    };

    this.removeOuterWalls = function(wallBool){
      var top    = maze.grid[maze.index(this.i, this.j -1)];
      var right  = maze.grid[maze.index(this.i+1, this.j)];
      var bottom = maze.grid[maze.index(this.i, this.j+1)];
      var left   = maze.grid[maze.index(this.i-1, this.j)];

      if(top == null){
        this.walls[0] = wallBool;
      }
      if(right == null){
        this.walls[1] = wallBool;
      }
      if(bottom == null){
        this.walls[2] = wallBool;
      }
      if(left == null){
        this.walls[3] = wallBool;
      }
    };

    // this.highlight = function() {
    //   var x = this.i*maze.w;
    //   var y = this.j*maze.w;
    //   noStroke();
    //   fill(0, 0, 255, 100);
    //   rect(x, y, maze.w, maze.w);
    // };

    this.getLines = function(){
      var x = this.i*maze.w;
      var y = this.j*maze.w;
      var w = maze.w;
      var lines = [];
      if (this.walls[0]) {
        lines.push({x1:x, y1:y, x2:x+w, y2:y});
      }
      if (this.walls[1]) {
        lines.push({x1:x+w, y1:y, x2:x+w, y2:y+w});
      }
      if (this.walls[2]) {
        lines.push({x1:x, y1:y+w, x2:x+w, y2:y+w});
      }
      if (this.walls[3]) {
        lines.push({x1:x, y1:y, x2:x, y2:y+w});
      }
      return lines;
    };//end getLines
  }//end cell class

    return this.generateMaze();
}//end Maze class
