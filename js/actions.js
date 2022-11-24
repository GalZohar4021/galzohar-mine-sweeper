'use strict'

var gActions

const CELL_CLICK = 'CELL_CLICK'
const EXPANDED_SHOW = 'EXPANDED_SHOW'
const MINE_CLICK = 'MINE_CLICK'

function initActions() {
    gActions = []
}

function addAction(action) {
    gActions.push(action)
}

function undoAction() {
    if (!gGame.isOn) return
    if (gActions.length === 0) return
    revertAction(gActions.pop())
}

function revertAction(action) {
    console.log(action)
    var i = action.pos.i
    var j = action.pos.j
    const cellModel = gBoard[i][j]
    if (action.type === EXPANDED_SHOW) {
        unExpandShow(gBoard, i, j)
    }
    else {
        unFlagCell(gBoard, i, j)
        if (action.type === MINE_CLICK) {
            gGame.LIVES++
            addLive()
        }
    }
    if (gActions.length === 0) return
    if(isLastActionMine()) changeSmiley(STEP_MINE)
    else changeSmiley(NORMAL)
}
    
function isLastActionMine(){
    return (gActions[gActions.length-1].type === MINE_CLICK)
}