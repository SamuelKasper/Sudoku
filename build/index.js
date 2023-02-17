"use strict";
window.onload = function () {
    init();
};
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
/*let grid = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 1, 4, 3, 6, 5, 8, 9, 7],
    [3, 6, 7, 8, 9, 1, 2, 4, 5],
    [5, 9, 8, 2, 4, 7, 3, 6, 1],
    [6, 3, 2, 5, 1, 4, 0, 0, 0],
    [8, 7, 5, 9, 3, 2, 0, 0, 0],
    [9, 4, 1, 6, 7, 8, 0, 0, 0]];*/
/*let grid = [
    [1, 0, 0, 4, 0, 0, 7, 8, 9],
    [4, 0, 6, 0, 0, 0, 1, 0, 3],
    [0, 8, 9, 1, 0, 3, 0, 0, 6],
    [2, 1, 0, 3, 6, 0, 0, 0, 7],
    [3, 0, 0, 8, 0, 1, 2, 4, 0],
    [0, 9, 8, 0, 4, 0, 3, 6, 1],
    [6, 0, 2, 5, 0, 4, 0, 0, 0],
    [0, 0, 5, 0, 0, 2, 6, 0, 0],
    [0, 4, 1, 6, 0, 8, 5, 0, 0]];*/
function init() {
    var _a;
    // Generate Grid
    let amountNumbers = 40;
    for (let i = 0; i < amountNumbers; i++) {
        let nr = Math.floor((Math.random() * 9) + 1);
        let x = Math.floor((Math.random() * 9));
        let y = Math.floor((Math.random() * 9));
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
    // Create number panel
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i.toString();
        number.innerText = i.toString();
        number.addEventListener("click", selectNr);
        number.classList.add("numbers");
        (_a = document.getElementById("numbers")) === null || _a === void 0 ? void 0 : _a.append(number);
    }
    // Create board
    let gameArea = document.getElementById("gameArea");
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + c.toString();
            tile.innerText = grid[r][c].toString();
            if (tile.innerText == "0") {
                tile.classList.add("tileEmpty");
                tile.innerText = "";
            }
            else {
                tile.classList.add("tile");
            }
            tile.addEventListener("click", selectTile);
            if (gameArea != null)
                gameArea.append(tile);
        }
    }
    // Solve Button
    let solveBtn = document.getElementById("solve");
    solveBtn === null || solveBtn === void 0 ? void 0 : solveBtn.addEventListener("click", solve);
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
function selectTile() {
    if (selection) {
        if (this.innerText != "") {
            return;
        }
        this.innerText = selection.id;
    }
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
// Solve puzzle by backtracking
function solve() {
    console.log("solving");
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (grid[y][x] == 0) {
                for (let n = 1; n <= 9; n++) {
                    if (possible(y, x, n)) {
                        grid[y][x] = n;
                        solve();
                        grid[y][x] = 0;
                    }
                }
                return;
            }
        }
    }
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r + "" + c);
            tile.innerText = grid[r][c].toString();
        }
    }
}
console.log("done");
