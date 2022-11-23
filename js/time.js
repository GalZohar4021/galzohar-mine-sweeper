
var gTimeInterval

function initTime() {
    gGame.secsPassed = 0
    var d = new Date()
    gGame.startTime = d.getTime()
    gTimeInterval = setInterval(checkTime,80)
}


function checkTime() {
    var d = new Date()
    gGame.secsPassed = ((d.getTime() - gGame.startTime)/1000).toFixed(2)
    updateTimeBar()
}
function updateTimeBar() {
    var elBar = getDOMElementByClass("time")
    elBar.querySelector('span').innerText = gGame.secsPassed + ' sec'
}
function clearTime() {
    clearInterval(gTimeInterval)
    gGame.startTime = 0
    addRecord(gGame)
}
