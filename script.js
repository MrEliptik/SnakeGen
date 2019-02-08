// Include the modules from lib/snake
var lib = require('./libs/snake/src/Game.js');

var canvas = document.getElementById("canvas");
var game = new lib.Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, 1)

// Add an event listener from the keyboard
document.addEventListener('keyup', (event) => {
    const key = event.keyCode;

    if (key == '38') {
        game.update( 0, "up");
        console.log("up");
    }
    else if (key == '40') {
        game.update( 0, "down");
        console.log("down");
    }
    else if (key == '37') {
        game.update( 0, "left");
        console.log("left");
    }
    else if (key == '39') {
        game.update( 0, "right");
        console.log("right");
    }
}, false);

// test
game.draw()
