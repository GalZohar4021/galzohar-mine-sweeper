`use strict`
const MINE = '💣'
const STATE_IDLE = 'IDLE'
const STATE_PLACE = 'PLACE'
var gSevenBOOM = false
var gPlaceManually = { state: STATE_IDLE, done: false }
var gMines = []

function createMines(board, firstPos) {
    gMines = []
    var locs = getRandomLocations(board, gLevels[gGame.level].MINES, firstPos)
    for (var i = 0; i < locs.length; i++) {
        createMine(board, locs[i])
    }
}
function mineExterminator() {
    var locs = []
    for (var count = 0; count < 3; count++) {
        var idx = getRandomIntInclusive(0, gMines.length - 1)
        var i = gMines[idx].i
        var j = gMines[idx].j
        if (gBoard[i][j].isShown) {
            count = (count > 0) ? (count - 1) : 0
            continue
        }
        locs.push(gMines[idx])
        markCell(getDOMElementByPos(i, j), i, j)
        gMines.splice(idx, 1)

        gBoard[i][j].isMine = false

    }
    minesBoardReCheck(gBoard)
    setTimeout(clearPlacingMarks, 3000, locs)
}
function setManualPlacing(elBtn) {
    if (gPlaceManually.state === STATE_IDLE) {
        gPlaceManually.state = STATE_PLACE
        gPlaceManually.done = false
        gMines = []
        elBtn.innerText = 'Press when done'
        restartGame()
    }
    else {
        gPlaceManually.state = STATE_IDLE
        gPlaceManually.done = true
        elBtn.innerText = 'Restart & Place Mines Manual'
        clearPlacingMarks(gMines)
    }
}

function createMineManually(board, cell) {
    board[cell.i][cell.j].isMine = true
    gMines.push(cell)
    markCell(getDOMElementByPos(cell.i, cell.j), cell.i, cell.j)
}
function createMine(board, loc) {
    board[loc.i][loc.j].isMine = true
    gMines.push(loc)
}
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) continue
            board[i][j].minesAroundCount = countNearbyMines(board, { i, j })
        }
    }
}
function countNearbyMines(board, pos) {
    var neighbors = getNeighbors(board, pos)
    var count = 0
    for (var i = 0; i < neighbors.length; i++) {
        const currPos = neighbors[i]
        if (board[currPos.i][currPos.j].isMine) count++
    }
    return count

}

function restartSevenBoom(elBtn) {
    elBtn.style.disabled = true
    gSevenBOOM = true
    restartGame()
}

function sevenBOOM(board) {
    gMines = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const idx = (i * board[i].length) + j
            if (idx === 0) continue
            if (containsChar(idx, '7') || (idx % 7) === 0) createMine(board, { i, j })
        }
    }
}
function containsChar(val, char) {
    let str = '' + val
    return (str.indexOf(char) !== -1)
}