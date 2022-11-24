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
        isHint: false,
        showCount: 0,
        markedCount: 0,
        startTime: 0,
        secsPassed: 0,
        LIVES: gLevels[level].MAX_LIVES,
        hints: 3,
        safeClicks: 3
    }
    updateBarStats()
    gBoard = createBoard()
    gGame.isOn = true

    initLives(gGame)
    renderBoard(gBoard, boardClassName, 'cellClicked')
    initHints(gGame)
    initActions()
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

function restartGame() {
    if (gGame.isOn) gameOver()
    newGame(gGame.level)
}

function newGame(gameLevel, firstInit = false) {
    if (!firstInit && gGame.isOn) gameOver()
    changeSmiley(NORMAL)
    initGame(gameLevel)
    if (gLevelsMenu) toggleLevelsMenu()
}

function minesBoardReCheck(board) {
    setMinesNegsCount(board)
    updateHtmlCells(board)
}

// When first movei is done - start game : create mines , count time and render values to element table
function firstMove(i, j) {

    const firstPos = { i, j }
    if (gSevenBOOM) {
        sevenBOOM(gBoard)
        gSevenBOOM = false
    }
    else {
        if (gPlaceManually.done) gPlaceManually.done = false
        else createMines(gBoard, firstPos)
    }
    minesBoardReCheck(gBoard)
    
    printConsoleBoard(gBoard)
    initTime()

    getDOMElementByClass("seven-boom").style.disabled = false
}

// ---------------------- Cells Click / Mark  ----------------------------------- //
function cellClicked(elTd, i, j) {

    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return

    // Special behaviors
    if (gPlaceManually.state === STATE_PLACE) return createMineManually(gBoard, { i, j })
    if (gGame.showCount === 0) firstMove(i, j)
    if (gMegaHintState) {
        if (gMegaHintCells.length < 2) {
            markCell(elTd, i, j)
            gMegaHintCells.push({ i, j })
            if(gMegaHintCells.length === 2) {
                clearPlacingMarks(gMegaHintCells)
                megaHintCells(gBoard,gMegaHintCells)
                gMegaHintState = false
            }
            return
        }
    }
    if (gHintMode) {
        getHint(gBoard, i, j)
        return
    }



    if (!gBoard[i][j].isMine) {
        changeSmiley(NORMAL)
        var action = { type: expandShow(gBoard, i, j), pos: { i, j } }
        addAction(action)
        if (checkGameOver(gBoard)) playerWin()
    }
    else {
        flagCell(gBoard, i, j)
        renderLostLive()
        gGame.LIVES--
        if (gGame.LIVES === 0) playerLost()
        else {
            var action = { type: MINE_CLICK, pos: { i, j } }
            addAction(action)
            changeSmiley(STEP_MINE)
        }
    }
    updateBarStats()
}
function onClickedRight(ev, elTd, i, j) {
    ev.preventDefault()
    if (gBoard[i][j].isShown) return
    markCell(elTd, i, j)
}
function markCell(elTd, i, j, safeClickOverride = false) {
    if (!safeClickOverride && gSafeClickMode) return
    elTd.classList.toggle('marked')

    if (gBoard[i][j].isMarked) gGame.markedCount--
    else gGame.markedCount++

    gBoard[i][j].isMarked = !gBoard[i][j].isMarked

    updateBarStats()
}



// --------------- Reveal & Unreveal of Cell & Model of cell ----------------------
function flagCell(board, i, j) {
    revealCell(board, i, j)
    revealModel(board, i, j)
}
function revealCell(board, i, j) {
    var elTd = getDOMElementByPos(i, j)
    var elSpan = elTd.querySelector('span')

    elTd.classList.add('revealed')
    elSpan.style.display = 'block'

    elTd.classList.add(getCellClass(board[i][j]))
}
function revealModel(board, i, j) {
    board[i][j].isShown = true
    gGame.showCount++
}


function unFlagCell(board, i, j) {
    unRevealCell(board, i, j)
    unRevealModel(board, i, j)
}
function unRevealCell(board, i, j) {
    var elTd = getDOMElementByPos(i, j)
    var elSpan = elTd.querySelector('span')

    elTd.classList.remove('revealed')
    elSpan.style.display = 'none'

    elTd.classList.remove(getCellClass(board[i][j]))
}
function unRevealModel(board, i, j) {
    board[i][j].isShown = false
    gGame.showCount--
}


// When no mines around hitted cell - show all neighbors who are not mines around
function expandShow(board, i, j) {
    flagCell(board, i, j)
    if (board[i][j].minesAroundCount > 0) return CELL_CLICK
    var pos = { i, j }
    var negs = getNeighbors(board, pos)
    for (var idx = 0; idx < negs.length; idx++) {
        if (!board[negs[idx].i][negs[idx].j].isShown) expandShow(board, negs[idx].i, negs[idx].j)
    }
    return EXPANDED_SHOW
}
function unExpandShow(board, i, j) {
    console.log(i, j)
    unFlagCell(board, i, j)
    if (board[i][j].minesAroundCount > 0) return
    var pos = { i, j }
    var negs = getNeighbors(board, pos)
    for (var idx = 0; idx < negs.length; idx++) {
        if (board[negs[idx].i][negs[idx].j].isShown) unExpandShow(board, negs[idx].i, negs[idx].j)
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

// When Player Wins
function playerWin() {
    changeSmiley(VICTORY)
    addRecord(gGame)
    updateRecords(gGame.level)
    gameOver()
}

// When Player loses
function playerLost() {
    changeSmiley(DEAD_MINE)
    gameOver()
}

// --------------------- Update bar stats -----------------------
//----------------------------------------------------------------



//                  time is updated in time.js with personal function called by interval
function updateBarStats() {
    var elBar = getDOMElementByClass("showed")
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




// gets board cell Model- returns class type: mine, empty or mine nearby
function getCellClass(cellData) {
    var newClass = ''
    if (cellData.isMine) newClass = 'mine'
    else if (cellData.minesAroundCount === 0) newClass = 'empty'
    else newClass = 'mine-Nearby'

    return newClass
}

function clearPlacingMarks(locs){
    for(var i=0; i<locs.length; i++) {
        const cell = { i: locs[i].i , j : locs[i].j }
        markCell(getDOMElementByPos(cell.i, cell.j), cell.i, cell.j)
    }
}