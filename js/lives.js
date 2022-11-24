'use strict'
function initLives(game) {
    clearLives()
    for (var i = 1; i <= game.LIVES; i++) {
        const className = `live live-${i}`
        const strHTML = `<img class="${className}"
         src="img/live.jpg"/>\n`
        renderLiveIcon(strHTML)
    }
}
function addLive() {
    const className = `live live-${gGame.LIVES}`
    const strHTML = `<img class="${className}"
        src="img/live.jpg"/>\n`
    renderLiveIcon(strHTML)
}
function clearLives(){
    var lives = document.querySelectorAll('.live')
    for(var i=0; i<lives.length; i++) {
        lives[i].remove()
    }
}
function renderLiveIcon(liveHTML) {
    var elLivesBox = getDOMElementByClass("lives-box")
    elLivesBox.innerHTML += liveHTML
}
function renderLostLive() {
    const className = `live-${gGame.LIVES}`
    var elLive = getDOMElementByClass(className)
    elLive.remove()
}
