'use strict'
var gHintMode = false
var gMegaHintUsed = false
var gMegaHintState = false

var gMegaHintCells = []
function initHints(game) {
    gHintMode = false
    gMegaHintUsed = false
    gMegaHintCells = []
    clearHints()
    for (var i = 1; i <= game.hints; i++) {
        const className = `hint hint-${i}`
        const strHTML = `<img onclick="useHint()" class="${className}"
         src="img/hint.webp"/>\n`
        renderHintIcon(strHTML)
    }
}
function megaHint() {
    if (gMegaHintUsed) return
    if (gMegaHintState) return
    gMegaHintUsed = true
    gMegaHintState = true
}
function megaHintCells(board, cells) {
    var minI = cells[0].i
    var minJ = cells[0].j
    var maxI = cells[1].i
    var maxJ = cells[1].j
    var hCells = []
    for (var i = minI; i <= maxI; i++) {
        for (var j = minJ; j <= maxJ; j++) {
            hCells.push({ i, j })
        }
    }
    console.log(hCells)
    hintCells(gBoard,hCells)
    setTimeout(unhintCells, 3000, board, hCells)
}

function clearHints() {
    var hints = document.querySelectorAll('.hint')
    for (var i = 0; i < hints.length; i++) {
        hints[i].remove()
    }
}
function useHint() {
    if (gGame.hints === 0) return
    if (gGame.showCount === 0) return
    if (gSafeClickMode) return
    usedHintRender()
    gGame.hints--
    gHintMode = true
    changeSmiley(HINT)
}

function usedHintRender() {
    const className = `hint-${gGame.hints}`
    var elHint = getDOMElementByClass(className)
    elHint.remove()
}

function renderHintIcon(hintHTML) {
    var elHintsBox = getDOMElementByClass("hints-box")
    elHintsBox.innerHTML += hintHTML
}

// ------------------ Hint of cell & cell model and unhint them ------------------

function getHint(board, i, j) {
    const cell = { i, j }
    var negs = getNeighbors(board, cell)
    negs.push(cell)

    hintCells(board, negs)
    setTimeout(unhintCells, 1000, board, negs)
}

function hintCells(board, cells) {
    for (var i = 0; i < cells.length; i++) {
        hintCell(board[cells[i].i][cells[i].j], cells[i])
        cells[i].isHint = true
    }
}

function hintCell(cellModel, cell) {
    var elTd = getDOMElementByPos(cell.i, cell.j)
    var elSpan = elTd.querySelector('span')

    elTd.classList.add('hint')
    elSpan.style.display = 'block'

}

function unhintCells(board, cells) {
    for (var i = 0; i < cells.length; i++) {
        unhintCell(board, cells[i])
        cells[i].isHint = false
    }
    changeSmiley(NORMAL)
    gHintMode = false
}

function unhintCell(board, cell) {
    var elTd = getDOMElementByPos(cell.i, cell.j)
    var elSpan = elTd.querySelector('span')

    elTd.classList.remove('hint')
    if (!board[cell.i][cell.j].isShown) elSpan.style.display = 'none'
}