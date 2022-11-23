`use strict`
const MINE = '💣'

function createMines(board) {
    var locs = getRandomLocations(board, gLevel.MINES)
    for (var i = 0; i < locs.length; i++) {
        createMine(board, locs[i])
    }
}

function createMine(board, loc) {
    var mine = {
        location: loc
    }
    board[loc.i][loc.j].isMine = true
}
function updateNearbyMines(board) {
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