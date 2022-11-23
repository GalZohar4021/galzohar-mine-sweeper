'use strict'
const EMPTY = ' '

// DOM Class
const boardClassName = '.board-container'

var gScores = []

// Model
var gBoard = []
var gGame

function onInit() {

    //  Board set background and set it to cover div size
    var board = getDOMElementByClass(boardClassName.substring(1))
    board.style.backgroundImage = "url('img/boom.png')"
    board.style.backgroundRepeat = "no-repeat"
    board.style.backgroundSize = "cover"

    initLevels()
    newGame(0, true)
    initRecords(gLevels[gGame.level].length)
}

function initGame(level = 0) {
    gGame = {
        level: level,
        inOn: false,
        showCount: 0,
        markedCount: 0,
        startTime : 0,
        secsPassed: 0,
        LIVES : gLevels[level].MAX_LIVES
    }
    updateBarStats()
    gBoard = createBoard()
    gGame.isOn = true
    renderBoard(gBoard, boardClassName, 'cellClicked')
}

function createBoard() {
    var board = []
    for (var i = 0; i < gLevels[gGame.level].BOARD_ROWS; i++) {
        board.push([])
        for (var j = 0; j < gLevels[gGame.level].BOARD_COLS; j++) {
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

function restart() {
    if(gGame.isOn) gameOver()
    newGame(gGame.level)
}

function newGame(gameLevel, firstInit = false) {
    if(!firstInit && gGame.isOn) gameOver()
    changeSmiley(NORMAL)
    initGame(gameLevel)
    if(gLevelsMenu) toggleLevelsMenu()
}

function playerLost() {
    changeSmiley(DEAD_MINE)
    gameOver()
}


// When first movei is done - start game : create mines , count time and render values to element table
function firstMove(i , j) {
    const firstPos = { i, j }
    createMines(gBoard, firstPos)
    setMinesNegsCount(gBoard)
    updateHtmlCells(gBoard)
    printConsoleBoard(gBoard)
    initTime()
}

// ---------------------- Cells Click / Mark / reveals ----------------------------------- //
function cellClicked(i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return

    if (!gBoard[i][j].isMine) {
        if (gGame.showCount === 0) firstMove(i , j)
        changeSmiley(NORMAL)
        expandShow(gBoard, i, j)
        if (checkGameOver(gBoard)) {
            changeSmiley(VICTORY)
            gameOver()
        }
    }
    else {
        revealCell(gBoard, i, j)
        gGame.LIVES--
        if (gGame.LIVES === 0) {
            playerLost()
        }
        else changeSmiley(STEP_MINE)
    }
    updateBarStats()
}
function markCell(ev, elTd, i, j) {
    ev.preventDefault()
    if (gBoard[i][j].isShown) return
    elTd.classList.toggle('marked')
    if(gBoard[i][j].isMarked) gGame.markedCount--
    else gGame.markedCount++
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked

    updateBarStats()
}
function revealCell(board, i, j) {
    var elTd = getDOMElementByPos(i, j)
    var elSpan = elTd.querySelector('span')

    elTd.classList.add('revealed')
    elSpan.style.display = 'block'

    var cellData = board[i][j]
    board[i][j].isShown = true
    gGame.showCount++

    var newClass = ''
    if (cellData.isMine) newClass = 'mine'
    else if (cellData.minesAroundCount === 0) newClass = 'empty'
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


// ------------------ Game Over -------------------- //
function checkGameOver(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            if (!currCell.isMine && !currCell.isShown) return false
        }
    }
    return true
}

function gameOver() {
    gGame.isOn = false
    clearTime()
}


// --------------------- Update bar stats -----------------------
//                  time is updated in time.js with personal function called by interval
function updateBarStats() {
    var elBar = getDOMElementByClass("lives")
    elBar.querySelector('span').innerText = gGame.LIVES

    elBar = getDOMElementByClass("showed")
    elBar.querySelector('span').innerText = gGame.showCount

    elBar = getDOMElementByClass("count-marked")
    elBar.querySelector('span').innerText = gGame.markedCount
}

// ------------------ print board to console ---------------------
function printConsoleBoard(board) {
    var boardLog = []
    for (var i = 0; i < gLevels[gGame.level].BOARD_ROWS; i++) {
        boardLog.push([])
        for (var j = 0; j < gLevels[gGame.level].BOARD_COLS; j++) {
            boardLog[i][j] = (board[i][j].isMine) ? (MINE) : (board[i][j].minesAroundCount)
        }
    }
    console.table(boardLog)
}

// ------------------- Update table element cells values ----------
function updateCellText(i, j, newText) {
    var elTd = getDOMElementByPos(i, j)
    var elSpan = elTd.querySelector('span')
    elSpan.innerText = newText
}

function updateHtmlCells(board) {
    var cellData = ''
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) cellData = MINE
            else if (board[i][j].minesAroundCount > 0) cellData = board[i][j].minesAroundCount
            else cellData = EMPTY
            updateCellText(i, j, cellData)
        }
    }
}
// ---------------------------------------------