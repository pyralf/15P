// Get the canvas element
var canvas = document.getElementById('canvas');
// Get our 2D context for drawing
var ctx = canvas.getContext( "2d" );
// Frames-per-second
var FPS = 30;
var cellsize = 100;

function Cell(x, y, row, col, value) {
    this.x = x;
    this.y = y;
    this.row = row;
    this.col = col;
    this.value = value;
    this.selected = false;
    this.canMoveDirection = function(dirRow, dirCol, dryRun) {
         assert((dirRow !== 0 && dirCol === 0
             || (dirRow === 0 && dirCol !== 0)
             && ((dirRow + dirCol) * (dirRow + dirCol) === 1)),
                "dirRow, dirCol: one must be 1, the other 0");
        var canMove = false;
        var newRow = this.row + dirRow;
        var newCol = this.col + dirCol;
        if (newRow < 0 || newRow > size - 1 || newCol < 0 || newCol > size - 1)
            canMove = false;
        else if (board.cells[newRow][newCol].value === 0) {
            canMove = true;
        } else {
            canMove = board.cells[newRow][newCol].canMoveDirection(dirRow, dirCol, dryRun);
        }
        if (canMove && !dryRun) {
            board.cells[newRow][newCol].value = this.value;
            board.cells[newRow][newCol].selected = false;
            this.value = 0;
            this.selected = false;
        }
        return canMove;
    };
    this.canMove = function(dryRun) {
        return this.canMoveDirection(1, 0, dryRun)
            || this.canMoveDirection(-1, 0, dryRun)
            || this.canMoveDirection(0, 1, dryRun)
            || this.canMoveDirection(0, -1, dryRun);
    };
    
    this.draw = function() {
        if (this.value === 0) return;
        ctx.beginPath();
        ctx.fillStyle="white";
        ctx.lineWidth="1";
        ctx.strokeStyle="blue";
        if (this.selected) {
            ctx.lineWidth="3";
            ctx.strokeStyle="red";
        } else if (this.canMove(true)) {
            ctx.fillStyle="gold";
        } 
        ctx.fillRect(this.x, this.y, cellsize, cellsize);
        ctx.rect(this.x, this.y, cellsize, cellsize);
        ctx.stroke();
        ctx.fillStyle="black";
        ctx.font="30px Arial";
        ctx.textAlign = 'center';
        ctx.fillText(this.value, this.x + cellsize / 2, this.y + cellsize / 2 + 10);
        ctx.stroke();
    };
};

function Board(x, y, size, cellsize) {
    this.x = x;
    this.y = y;
    this.size = size;
    
    var initCells = function (x0, y0, size) {
        var cells = [];
        var x = x0;
        var y = y0;
        var count = 0;
        for (var i = 0; i < size; i++) {        
            var row = [];
            for (var j = 0; j < size; j++) {
                row.push(new Cell(x, y, i, j, count++));
                x += cellsize;
            }
            cells.push(row);
            x = x0;
            y += cellsize;
        }
        return cells;
    };
    
    this.cells = initCells(x, y, size);
    
    this.draw = function() {
        // Draw border
        ctx.beginPath();
        ctx.lineWidth="1";
        ctx.strokeStyle="black";
        ctx.rect(this.x, this.y, cellsize * this.size, cellsize * this.size);
        ctx.stroke();
        // Draw cells
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                this.cells[i][j].draw();
            }
        }
    };
};

// Game loop draw function
function draw() {
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    board.draw();
}

// Game loop update function
function update() {
    
}

function tick() {
    draw();
    update();
}
    
 function getMousePos(canvas, e) {
    // IE doesn't always have e here
    e = e || window.event;
    var rect = canvas.getBoundingClientRect();
    var clientX =  e.clientX || e.pageX;
    var clientY =  e.clientY || e.pageY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }    
      
// Mouse button pressed
window.onmousedown = function(e) {
    document.getElementById( "output" ).innerHTML = "down";
    var mousePos = getMousePos(canvas, e);
    for (var i = 0; i < board.size; i++) {    
        for (var j = 0; j < board.size; j++) {
            if (mousePos.x >= board.cells[i][j].x && board.cells[i][j].x + cellsize >= mousePos.x
                && mousePos.y >= board.cells[i][j].y && board.cells[i][j].y + cellsize >= mousePos.y) {
                board.cells[i][j].selected = true;
                board.cells[i][j].canMove(false);
            } else {
                board.cells[i][j].selected = false;
            }
        }
    }
};

// Mouse button released
window.onmouseup = function( e ) {
    document.getElementById( "output" ).innerHTML = "up";
};

// Mouse gone wild!
window.onmousemove = function( e ) {
    var mousePos = getMousePos(canvas, e);
    document.getElementById( "x" ).innerHTML = mousePos.x;
    document.getElementById( "y" ).innerHTML = mousePos.y;;
};

function test() {
    assert(false, "somethings wrong");
}

var size = 4;
var board = new Board(0, 0, size, cellsize);
setInterval( tick, 1000 / FPS );