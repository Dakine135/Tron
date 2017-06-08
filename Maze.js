// Depth-first search
// Recursive backtracker
// https://en.wikipedia.org/wiki/Maze_generation_algorithm
function Maze(cellWidth){

this.w = cellWidth;
this.cols = floor(width/this.w);
this.rows = floor(height/this.w);
this.grid = [];
this.lines = new Map();
this.current;
// this.stack = new Map();
this.stack = [];
this.finished = false;
this.debugging = false;

for (var   j = 0; j < this.rows; j++) {
  for (var i = 0; i < this.cols; i++) {
    var cell = new Cell(i, j, this);
    this.grid.push(cell);
  }
}

this.current = this.grid[0];

this.show = function() {
  // background(51);
  if(this.debugging && !this.finished){
    for (var i = 0; i < this.grid.length; i++) {
      this.grid[i].show();
    }
  }

  if(this.finished){
    this.lines.forEach(function(l){
        stroke(l.color);
        line(l.x1, l.y1, l.x2, l.y2);
    });
  } else {
    this.current.visited = true;
    if(this.debugging) this.current.highlight();
    var next = this.current.checkNeighbors();
    //console.log(next);
    if (next) {
      next.visited = true;
      this.stack.push(this.current);
      this.removeWalls(this.current, next);
      this.current = next;
    } else if (this.stack.length > 0) {
      // var popStackKey = this.stack.keys().next().value;
      // this.current = this.stack.get(popStackKey);
      // this.stack.delete(popStackKey);
      this.current = this.stack.pop();
    } else {
      this.finished = true;
      for (var i = 0; i < this.grid.length; i++) {
        this.grid[i].getLines().forEach(function(line){
          var key = line.x1.toString() + line.y1.toString() + line.x2.toString() + line.y2.toString();
          line['key'] = key;
          this.lines.set(line.key, line);
        }.bind(this));
      }
      //console.log("finished: ", this.lines.size);
    }//game finished
  } //until finished

  // console.log(this.stack.size);
  // console.log(this.stack.length);

}//end Maze.show()

this.index = function(i, j) {
  if (i < 0 || j < 0 || i > this.cols-1 || j > this.rows-1) {
    return -1;
  }
  return i + j * this.cols;
}


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
  }

  this.checkCollisionWithWalls = function(snake){
    var output = null;
    var lines = this.lines.value
    this.lines.forEach(function(l){
        hit = collidePointLine(snake.x, snake.y, l.x1, l.y1, l.x2, l.y2, snake.size/4);
        if(hit){
          // console.log(l.key);
           output = l;
           return;
         }
    });
    return output;
  }


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
        var r = floor(random(0, neighbors.length));
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
    } //end checkNeighbors

    this.highlight = function() {
      var x = this.i*maze.w;
      var y = this.j*maze.w;
      noStroke();
      fill(0, 0, 255, 100);
      rect(x, y, maze.w, maze.w);
    }

    this.getLines = function(){
      var x = this.i*maze.w;
      var y = this.j*maze.w;
      var w = maze.w;
      var lines = [];
      if (this.walls[0]) {
        lines.push({x1:x, y1:y, x2:x+w, y2:y, color:color(4,255,239)});
      }
      if (this.walls[1]) {
        lines.push({x1:x+w, y1:y, x2:x+w, y2:y+w, color:color(4,255,239)});
      }
      if (this.walls[2]) {
        lines.push({x1:x, y1:y+w, x2:x+w, y2:y+w, color:color(4,255,239)});
      }
      if (this.walls[3]) {
        lines.push({x1:x, y1:y, x2:x, y2:y+w, color:color(4,255,239)});
      }
      return lines;
    }//end getLines

    this.show = function() {
      if(true){ //this.visited
        var x = this.i*maze.w;
        var y = this.j*maze.w;
        stroke(255);
        if (this.walls[0]) {
          line(x    , y    , x + maze.w, y);
        }
        if (this.walls[1]) {
          line(x + maze.w, y    , x + maze.w, y + maze.w);
        }
        if (this.walls[2]) {
          line(x + maze.w, y + maze.w, x    , y + maze.w);
        }
        if (this.walls[3]) {
          line(x    , y + maze.w, x    , y);
        }
      }

      if (this.visited && maze.debugging) {
        noStroke();
        fill(255, 0, 255, 100);
        rect(x, y, maze.w, maze.w);
      }
    }//end show function
  }//end cell class

}//end Maze class
