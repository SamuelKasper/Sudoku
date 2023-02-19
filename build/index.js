"use strict";
window.onload = function () {
    init();
};
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];
function init() {
    var _a;
    // Create number panel
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i.toString();
        number.innerText = i.toString();
        number.addEventListener("click", selectNr);
        number.classList.add("numbers");
        (_a = document.getElementById("numberSpace")) === null || _a === void 0 ? void 0 : _a.append(number);
    }
    // Create board
    let gameArea = document.getElementById("gameArea");
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + c.toString();
            tile.innerText = grid[r][c].toString();
            tile.classList.add("tile");
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
            if (gameArea != null)
                gameArea.append(tile);
        }
    }
    // Solve Button
    let solveBtn = document.getElementById("solve");
    solveBtn === null || solveBtn === void 0 ? void 0 : solveBtn.addEventListener("click", solveHandler);
    // Generate a new Sudoku
    generateSudoku();
}
// Select number from number panel
let selection;
function selectNr() {
    if (selection != null) {
        selection.classList.remove("selection");
    }
    selection = this;
    selection.classList.add("selection");
}
// Put selected number into the board
function setTile() {
    if (selection) {
        // If field has white / no background, put or change number
        if (this.style.backgroundColor == "white") {
            // Put input into field
            this.innerText = selection.id;
            // Check if input is possible and color the wrong ones red
            let y = parseInt(Array.from(this.id)[0]);
            let x = parseInt(Array.from(this.id)[1]);
            if (!(possible(y, x, parseInt(selection.id)))) {
                this.style.color = "red";
                mistakes++;
                document.getElementById("mistakes").innerText = "Fehler: " + mistakes;
            }
            else {
                this.style.color = "black";
            }
            // Put input to grid
            grid[y][x] = parseInt(selection.id);
            // Check if all fields are filled
            if (emptyFieldsLeft()) {
                if (sudokuSolved()) {
                    document.getElementById("gamestate").innerText = "Status: gelöst";
                }
            }
        }
        else {
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
            }
            else {
                i--;
            }
        }
        else {
            i--;
        }
    }
    // Solve puzzle and save in variable
    solve();
    // Remove some of the tiles
    for (let i = 0; i < 40; i++) {
        let x = Math.floor((Math.random() * 9));
        let y = Math.floor((Math.random() * 9));
        // If position is empty and possible by rules set number
        if (grid[y][x] != 0) {
            grid[y][x] = 0;
        }
        else {
            i--;
        }
    }
    // Print on GUI
    printOnGrid();
}
// Check if number (n) is possible at specific place (y,x)
function possible(y, x, n) {
    for (let i = 0; i < 9; i++) {
        if (grid[y][i] == n) {
            return false;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (grid[i][x] == n) {
            return false;
        }
    }
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
            if (tile.style.color == "red" || tile.style.backgroundColor == "white") {
                tile.style.color = "black";
                grid[r][c] = 0;
            }
        }
    }
    solve();
    printOnGrid();
    document.getElementById("gamestate").innerText = "Status: lösung anzeigen";
}
// Solve puzzle by backtracking
function solve() {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            // Search for emtpy position in grid
            if (grid[y][x] == 0) {
                for (let n = 1; n <= 9; n++) {
                    if (possible(y, x, n)) {
                        grid[y][x] = n;
                        solve();
                        if (emptyFieldsLeft()) {
                            return grid;
                        }
                        else {
                            grid[y][x] = 0;
                        }
                    }
                }
                return;
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
            tile.innerText = grid[r][c].toString();
            // replace zeros and color the rest
            if (tile.innerText == "0") {
                tile.innerText = "";
            }
            else {
                tile.style.backgroundColor = "whitesmoke";
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
            if (tile.style.color == "red") {
                solved = false;
            }
        }
    }
    return solved;
}
