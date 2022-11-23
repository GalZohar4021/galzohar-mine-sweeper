'use strict'
const EMPTY = ' '

// DOM Class
const boardClassName = '.board-container'

// Model
var gBoard = []
var gGame
var gLevel = {
    BOARD_ROWS : 10,
    BOARD_COLS : 12,
    MINES : 10
}

function onInit() {
    initGameVars()
    gBoard = createBoard()
    console.log(gBoard)
    createMines(gBoard)
    gGame.isOn = true
    renderBoard(gBoard, boardClassName, 'cellClicked')
    updateNearbyMines(gBoard)
    updateHtmlCells(gBoard)
}
function initGameVars() {
    gGame = {
        inOn: false,
        showCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
}

function createBoard() {
    var board = []
    for (var i = 0; i < gLevel.BOARD_ROWS; i++) {
        board.push([])
        for (var j = 0; j < gLevel.BOARD_COLS; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isMine: false,
                isShown: false,
                isMarked: false
            }
        }
    }
    return board
}

function cellClicked(i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return

    if (!gBoard[i][j].isMine) expandShow(gBoard, i, j)
    else {
        revealCell(gBoard, i, j)
    }
}
function markCell(ev, elTd, i, j) {
    ev.preventDefault()
    if (gBoard[i][j].isShown) return
    elTd.classList.toggle('marked')
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    return false
}

function updateCellText(i , j , newText) {
    var elTd = getDOMElementByPos(i , j)
    var elSpan = elTd.querySelector('span')
    elSpan.innerText = newText
}
function updateHtmlCells(board) {
    var cellData = ''
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if(board[i][j].isMine) cellData = MINE
            else if(board[i][j].minesAroundCount > 0) cellData = board[i][j].minesAroundCount
            else cellData = EMPTY
            updateCellText(i , j , cellData)
        }
    }
}

function revealCell(board, i, j) {
    var elTd = getDOMElementByPos(i , j)
    var elSpan = elTd.querySelector('span')

    elTd.classList.add('revealed')
    elSpan.style.display = 'block'

    var cellData = board[i][j]
    board[i][j].isShown = true
    gGame.showCount++

    var newClass = ''
    if(cellData.isMine) newClass = 'mine'
    else if(cellData.minesAroundCount === 0) newClass = 'empty'
    else newClass = 'mine-Nearby'

    elTd.classList.add(newClass)
}
function expandShow(board, i, j) {
    revealCell(board, i, j)
    if (board[i][j].minesAroundCount > 0) return


    var pos = { i, j }
    var negs = getNeighbors(board, pos)
    for (var idx = 0; idx < negs.length; idx++) {
        if (!board[negs[idx].i][negs[idx].j].isShown) expandShow(board, negs[idx].i, negs[idx].j)
    }
    return
}