// Get the canvas element
var canvas = document.getElementById('canvas');
// Get our 2D context for drawing
var ctx = canvas.getContext( "2d" );
// Frames-per-second
var FPS = 30;
var cellsize = 100;

function Cell(x, y, width, height, row, col, value) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.value = value;
    this.selected = false;
    this.row = row;
    this.col = col;
    this.canMove = function() {
        if (this.row > 0) {
            neiborRow = this.row - 1;
            if (board.cells[neiborRow][col].value === 0)
                return {row: neiborRow, col: col};
        }
        if (this.row < board.size - 1) {
            neiborRow = this.row + 1;
            if (board.cells[neiborRow][col].value === 0)
                return {row: neiborRow, col: col};
        }
        if (this.col > 0) {
            neiborCol = this.col - 1;
            if (board.cells[row][neiborCol].value === 0)
                return {row: row, col: neiborCol};
        }
        if (this.col < board.size - 1) {
            neiborCol = this.col + 1;
            if (board.cells[row][neiborCol].value === 0)
                return {row: row, col: neiborCol};
        }
        return null;
    };
    
    this.draw = function() {
        if (this.value === 0) return;
        ctx.beginPath();
        if (this.selected) {
            ctx.lineWidth="3";
            ctx.strokeStyle="red";
        } else if (this.canMove() !== null) {
            ctx.lineWidth="3";
            ctx.strokeStyle="yellow";
        } else {
            ctx.lineWidth="1";
            ctx.strokeStyle="blue";
        }
        ctx.rect(this.x, this.y, this.width, this.height);
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
                row.push(new Cell(x, y, cellsize, cellsize, i, j, count++));
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
    var moved = false;
    for (var i = 0; i < board.size; i++) {    
        for (var j = 0; j < board.size; j++) {
            if (!moved
                && mousePos.x >= board.cells[i][j].x && board.cells[i][j].x + board.cells[i][j].width >= mousePos.x
                && mousePos.y >= board.cells[i][j].y && board.cells[i][j].y + board.cells[i][j].height >= mousePos.y) {
                board.cells[i][j].selected = true;
                movePos = board.cells[i][j].canMove();
                if (movePos !== null) {
                    board.cells[movePos.row][movePos.col].value = board.cells[i][j].value;
                    board.cells[movePos.row][movePos.col].selected = false;
                    board.cells[i][j].value = 0;
                    board.cells[i][j].selected = false;
                    moved = true;
                }
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

var board = new Board(0, 0, 4, cellsize);
setInterval( tick, 1000 / FPS );