'use strict'
var gRecords

function initRecords(levelsCount) {
    gRecords = []
    for (var i = 0; i < levelsCount; i++) {
        gRecords[i] = []
    }
}
function addRecord(game) {
    console.log(game)
    if (gRecords[game.level] === undefined) {
        gRecords[game.level] = game
    }
    else if (gRecords[game.level].secsPassed > game.secsPassed) {
        gRecords[game.level] = game
        console.log(gRecords[game.level])
    }
}
function getRecord(lvl) {
    if(gRecords[lvl] === undefined) return 'NO RECORD'
    var rec = gRecords[lvl]
    var strRec = `Time Finished: ${rec.secsPassed}\nHints used: ${(3 - rec.hints)}\n
    Life lost: ${gLevels[lvl].MAX_LIVES-rec.LIVES}\nSuper Clicker used: ${3 - rec.safeClicks}
    `
    return strRec
}
function updateRecords(level) {
    var elRecBox = getDOMElementByClass("best-record")
    elRecBox.querySelector("span").innerText = level + 1
    elRecBox.querySelector("h2").innerText = getRecord(level)
}