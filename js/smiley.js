'use strict'
var smileys = [
    'img/smiley-normal.png',
    'img/smiley-victory.webp',
    'img/smiley-mine.jpg',
    'img/smiley-dead.jpg',
    'img/smiley-hint.png',
    'img/smiley-helmet.jpg'
]


const STEP_MINE = 'STEP ON MINE'
const DEAD_MINE = 'DEAD FROM MINE'
const VICTORY = 'VICTORY'
const NORMAL = 'Normal'
const HINT = 'HINT'
const HELMET = 'HELMET'

function changeSmiley(reason) {
    var elSmiley = getDOMElementByClass("smiley")
    switch(reason) {
        case NORMAL:
            elSmiley.src = smileys[0]
            break
        case VICTORY:
            elSmiley.src = smileys[1]
            break
        case STEP_MINE:
            elSmiley.src = smileys[2]
            break
        case DEAD_MINE:
            elSmiley.src = smileys[3]
            break
        case HINT:
            elSmiley.src = smileys[4]
            break
        case HELMET:
            elSmiley.src = smileys[5]
            break
    }
    elSmiley.alt = reason
    
}