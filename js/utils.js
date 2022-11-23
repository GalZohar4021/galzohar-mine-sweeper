'use strict'

function renderBoard(mat, selector, clickFunc) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className}" onclick="${clickFunc}(${i},${j})" 
            oncontextmenu="markCell(event,this,${i},${j})">${getSpannedVal(EMPTY)}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}
function getDOMElementByClass(className) {
    return document.querySelector('.' + className)
}
function getClassName(posTD) {
    return `cell-${posTD.i}-${posTD.j}`
}
function getDOMElementByPos(i, j) {
    return document.querySelector('.' + `cell-${i}-${j}`)
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function compareLocations(loc1, loc2) {
    return (loc1.i === loc2.i && loc1.j === loc2.j)
}

// Returns array of locations of cells which contains given value (val)
function getCellsByVal(board, val) {
    var cells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].type === val) cells.push({ i, j })
        }
    }
    return cells
}

// INPUT of board game and position
// OUTPUT position neighbors who are inbounds of board - max 8 available
function getNeighbors(board, pos) {
    var neighbors = []
    var currPos
    var rowIdx = pos.i
    var colIdx = pos.j
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            currPos = { i, j }
            if (inBounds(board, currPos)) neighbors.push(currPos)
        }
    }
    return neighbors
}

// Checks is position is in board bounds or not
function inBounds(board, pos) {
    return (pos.i >= 0 && pos.i < board.length && pos.j >= 0 && pos.j < board[pos.i].length)
}


function getRandomLocations(board, randLength) {
    var locs = []
    var counter = 0
    while (counter < randLength) {
        var i = getRandomIntInclusive(0, board.length - 1)
        var j = getRandomIntInclusive(0, board[i].length - 1)
        const loc = { i, j }
        if (inBounds(board, loc) && getIndexOfLocations(locs, loc) === -1) {
            locs.push(loc)
            counter++
        }
    }
    return locs
}

// Gets array of locations and search location in the array
// RETURNS the index of the location or -1 if not found
function getIndexOfLocations(locs, location) {
    for (var i = 0; i < locs.length; i++) {
        if (compareLocations(locs[i], location)) return i
    }
    return -1
}

// Return string of value bitween <span> HTML tags
function getSpannedVal(val) {
    return `<span>${val}</span>`
}