window.onload = function () {
    init();
}

// Globals
let selection: HTMLDivElement;
let mistakes = 0;
let grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]];

// Create Sudoku board, numbers and solve button
function init() {
    // Create number panel
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i.toString();
        number.innerText = i.toString();
        number.addEventListener("click", selectNr)
        number.classList.add("numbers");
        document.getElementById("numberSpace")!.append(number)
    }

    // Create board
    let gameArea = document.getElementById("gameArea");
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + c.toString();
            tile.innerText = grid[r][c].toString();
            tile.classList.add("tile");
            // Set background color for empty tiles
            if (tile.innerText == "0") {
                tile.style.backgroundColor = "white";
            }
            // Create border lines
            if (r == 2 || r == 5) {
                tile.classList.add("horizLine");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertLine");
            }
            // Add eventlistener
            tile.addEventListener("click", setTile);
            gameArea!.append(tile);
        }
    }

    // Solve Button
    let solveBtn = document.getElementById("solve");
    solveBtn?.addEventListener("click", solveHandler);

    // Generate a new Sudoku
    generateSudoku();
}

// Select number from number panel
function selectNr(this: HTMLDivElement) {
    if (selection != null) {
        selection.classList.remove("selection");
    }
    selection = this;
    selection.classList.add("selection");
}

// Put selected number to GUI
function setTile(this: HTMLDivElement) {
    if (selection) {
        // If field has white / no background, put or change number
        if (this.style.backgroundColor == "white") {
            let y: number = parseInt(Array.from(this.id)[0]);
            let x: number = parseInt(Array.from(this.id)[1]);
   
            // Check if input is possible and color the wrong ones red
            if(!(possible(y,x,parseInt(selection.id)))){
                this.style.color = "red";
                mistakes++;
                document.getElementById("mistakes")!.innerText = "Fehler: " + mistakes;
            }else{
                this.style.color = "black";
            }

            // Set number to GUI and grid
            this.innerText = selection.id;
            grid[y][x] = parseInt(selection.id);

            // Update the red tiles
            updateRedTiles();

            // Check if game is over
            if (emptyFieldsLeft()) {
                if (sudokuSolved()) {
                    document.getElementById("gamestate")!.innerText = "Status: gelöst";
                }
            }
        } else {
            // No number is selected
            return;
        }

    }
}

// Generates new sudoku puzzle
function generateSudoku() {
    // Generate Grid
    // Add random factor for generating a grid
    for (let i = 0; i < 2; i++) {
        let nr = Math.floor((Math.random() * 9) + 1);
        let x = Math.floor((Math.random() * 9));
        let y = Math.floor((Math.random() * 9));
        // If position is empty and possible by rules set number
        if (grid[y][x] == 0) {
            if (possible(y, x, nr)) {
                grid[y][x] = nr;
            } else {
                i--;
            }
        } else {
            i--;
        }
    }
    // Solve puzzle and save in variable
    solve();

    // Remove some of the tiles / set amound of missing tiles
    for (let i = 0; i < 40; i++) {
        let x = Math.floor((Math.random() * 9));
        let y = Math.floor((Math.random() * 9));
        // If position is empty and possible by rules set number
        if (grid[y][x] != 0) {
            grid[y][x] = 0;
        } else {
            i--;
        }
    }

    // Print on GUI
    printOnGrid();
}

// Check if number (n) is possible at specific place (y,x)
function possible(y: number, x: number, n: number) {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (grid[y][i] == n || grid[i][x] == n) {
            return false;
        }
    }

    // Check square
    let x0 = Math.floor(x / 3) * 3;
    let y0 = Math.floor(y / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[y0 + i][x0 + j] == n) {
                return false;
            }
        }
    }
    return true;
}

// Calls functions to solve the puzzle
function solveHandler() {
    // Remove possible wrong inputs
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r + "" + c);
            if (tile!.style.backgroundColor == "white") {
                tile!.style.color = "black";
                grid[r][c] = 0;
            }
        }
    }
    solve();
    printOnGrid();
    document.getElementById("gamestate")!.innerText = "Status: lösung anzeigen"
}

// Solve puzzle by backtracking
function solve() {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            // Search for emtpy position in grid
            if (grid[y][x] == 0) {
                for (let n = 1; n <= 9; n++) {
                    // Check if number is possible at (y,x) and set it
                    if (possible(y, x, n)) {
                        grid[y][x] = n;
                        solve();
                        if (emptyFieldsLeft()) {
                            return grid;
                        } else {
                            grid[y][x] = 0;
                        }
                    }
                } return;
            }
        }
    }
}

// Checks if there are empty fields
function emptyFieldsLeft() {
    let ans = true;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] == 0) {
                ans = false;
            }
        }
    }
    return ans;
}

// Prints the grid variable on the GUI
function printOnGrid() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r + "" + c);
            tile!.innerText = grid[r][c].toString();
            // replace zeros and color the rest
            if (tile!.innerText == "0") {
                tile!.innerText = "";
            } else {
                tile!.style.backgroundColor = "whitesmoke";
            }
        }
    }
}

// Checks if sudoku is solved correctly
function sudokuSolved() {
    let solved = true;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r + "" + c);
            if (tile!.style.color == "red") {
                solved = false;
            }
        }
    }
    return solved;
}

// Checks the red tiles if they are valid and updates them
function updateRedTiles() {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let tile = document.getElementById(y.toString() + x.toString())
            if (tile!.style.color == "red" && tile!.style.backgroundColor == "white") {
                // save number to variable
                let numberToCheck = tile!.innerText;
                // remove number from grid, to check if the number would there be possible
                grid[y][x] = 0;
                // check if possible and set the number again with the correct color
                if(possible(y,x,parseInt(numberToCheck))){
                    tile!.style.color = "black";
                    grid[y][x] = parseInt(numberToCheck);
                }else{
                    tile!.style.color = "red";
                    grid[y][x] = parseInt(numberToCheck);
                }
            }
        }
    }
}