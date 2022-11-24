'use strict'
var gSafeClickMode

function safeClick() {
    if (gGame.isOn === false) return
    if (gGame.safeClicks === 0) return
    gSafeClickMode = true
    gGame.safeClicks--
    var elButtons = getDOMElementByClass('btns')
    elButtons.querySelector('span').innerText = gGame.safeClicks
    markSafe()
}

function markSafe() {
    var cells = getEmptyCells(gBoard)
    if (cells.length === 0) return
    var idx = getRandomIntInclusive(0, cells.length - 1)
    var i = cells[idx].i
    var j = cells[idx].j
    var elTd = getDOMElementByPos(i, j)
    markCell(elTd, i, j, true)
    changeSmiley(HELMET)
    setTimeout(unMarkSafe, 3000, elTd, i, j)
}
function unMarkSafe(elTd, i, j) {
    gSafeClickMode = false
    changeSmiley(NORMAL)
    markCell(elTd, i, j)
}
// Returns array of locations of cells which contains given value (val)
function getEmptyCells(board) {
    var cells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine && !board[i][j].isShown) cells.push({ i, j })
        }
    }
    return cells
}