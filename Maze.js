// Depth-first search
// Recursive backtracker
// https://en.wikipedia.org/wiki/Maze_generation_algorithm
module.exports = Maze;
function Maze(cellWidth, width, height, walls){
  console.log("CreateMaze: cellWidth, width, height, walls: ",
    cellWidth,width, height, walls);

this.w = cellWidth;
this.cols = Math.floor(width/this.w);
this.rows = Math.floor(height/this.w);
this.grid = [];
this.lines = new Map();
this.current = null;
this.stack = [];
this.finished = false;
this.knockOutWalls = walls;

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
                if (this.knockOutWalls) {
                    this.grid[i].knockoutRandomWall();
                    this.grid[i].removeOuterWalls();
                }
                this.grid[i].getLines().forEach(function (line) {
                    var key = line.x1.toString() + line.y1.toString() + line.x2.toString() + line.y2.toString();
                    line['key'] = key;
                    this.lines.set(line.key, line);
                }.bind(this));
            }
            var output = [];
            this.lines.forEach(function(line){
              var newLine = {
                x1: line.x1,
                  y1: line.y1,
                  x2: line.x2,
                  y2: line.y2
              };
              output.push(newLine);
            });
            console.log("Finished making maze: ", this.lines.size, " Lines");
            return output;
        }//game finished
    } //until finished
};


this.index = function(i, j) {
  if (i < 0 || j < 0 || i > this.cols-1 || j > this.rows-1) {
    return -1;
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
        var r = Math.floor(Math.random(0, neighbors.length));
        // for(var i=0; i<neighbors.length; i++){
        //   if(i != r){
        //     var cellKey = neighbors[r].i.toString() + neighbors[r].j.toString();
        //      maze.stack.set(cellKey,neighbors[r]);
        //    }
        // }
        return neighbors[r];
      } else {
        return undefined;
      }
    }; //end checkNeighbors

    this.knockoutRandomWall = function(){
      var r = Math.floor(Math.random(0, 4));
      var attempts = 10;
      while(!this.walls[r] && attempts>0){
        r = Math.floor(Math.random(0, 4));
        attempts--;
      }
      this.walls[r] = false;
    };

    this.removeOuterWalls = function(){
      var top    = maze.grid[maze.index(this.i, this.j -1)];
      var right  = maze.grid[maze.index(this.i+1, this.j)];
      var bottom = maze.grid[maze.index(this.i, this.j+1)];
      var left   = maze.grid[maze.index(this.i-1, this.j)];

      if(top == null){
        this.walls[0] = false;
      }
      if(right == null){
        this.walls[1] = false;
      }
      if(bottom == null){
        this.walls[2] = false;
      }
      if(left == null){
        this.walls[3] = false;
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
