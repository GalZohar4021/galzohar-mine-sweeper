'use strict'

var darkMode = false

var darkColors = {
    body: "rgb(0, 0, 0)",
    header: 'rgba(4, 44, 120, 0.7)',
    content: 'rgba(4, 44, 120, 0.7)',
    footer: 'rgba(4, 44, 120, 0.7)'
}
var lightColors = {
    body: 'rgb(255, 255, 255)',
    header: 'rgba(4, 44, 120, 0.5)',
    content: 'rgba(4, 44, 120, 0.5)',
    footer: 'rgba(4, 44, 120, 0.5)'
}

function toggleDarkMode(elBtn) {
    
    darkMode = !darkMode
    if (darkMode) {
        elBtn.innerText = 'Light Mode'
        for (var val in darkColors) {
            getDOMElementByClass(val).style.backgroundColor = darkColors[val]
        }
    }
    else {
        elBtn.innerText = 'Dark Mode'
        for (var val in lightColors) {
            getDOMElementByClass(val).style.backgroundColor = lightColors[val]
        }
    }

}