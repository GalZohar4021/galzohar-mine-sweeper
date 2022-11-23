var gRecords

function initRecords(levelsCount) {
    gRecords = []
    for(var i=0; i<levelsCount; i++) {
        gRecords[i]= []
    }
}
function addRecord(game) {
    console.log(game)
    if(gRecords[game.level] === undefined) gRecords[game.level] = []
    gRecords[game.level].push(game)
    console.log(gRecords[game.level])
}
