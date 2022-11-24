'use strict'
var gLevels
var gLevelsMenu = false
function initLevels() {
    const LEVELS = 4
    // Instead of reading input - given default levels
    var levelsSizes = [4, 8, 12, 18]
    var levelsMines = [2, 14, 32, 78]
    var levelsLives = [1, 3, 3, 4]
    gLevels = []

    for (var i = 0; i < LEVELS; i++) {
        const level = {
            BOARD_ROWS: levelsSizes[i],
            BOARD_COLS: levelsSizes[i],
            MINES: levelsMines[i],
            MAX_LIVES: levelsLives[i]
        }
        gLevels.push(level)
    }
    renderMenu()
}
function renderMenu() {
    var btnHTML
    var elMenu = getDOMElementByClass("menu")
    for (var i = 0; i < gLevels.length; i++) {
        btnHTML = `<button onclick="chooseLevel(${i})">Level ${i + 1}</button>`
        elMenu.innerHTML += btnHTML
    }
}
function chooseLevel(level) {
    updateRecords(level)
    newGame(level)
}

function getGameLevel() {
    return gGame.level
}

function toggleLevelsMenu() {
    var elMenu = getDOMElementByClass("menu")
    elMenu.style.display = (gLevelsMenu)?('none'):('inline-flex')
    gLevelsMenu = !gLevelsMenu
}