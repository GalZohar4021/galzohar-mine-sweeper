var smileys = ['img/smiley-normal.png','img/smiley-victory.webp','img/smiley-mine.jpg','img/smiley-dead.jpg']

const STEP_MINE = 'STEP ON MINE'
const DEAD_MINE = 'DEAD FROM MINE'
const VICTORY = 'VICTORY'
const NORMAL = 'Normal'

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
    }
    elSmiley.alt = reason
    
}