var canvas = document.getElementById("canvas");

var game = new Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, "DF") // default mode
//var game = new Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, "SP") // sprite mode [BROKEN]


// Add an event listener from the keyboard
document.addEventListener('keyup', (event) => {
    const key = event.keyCode;

    if (key == '38') {
        game.update( 0, "up");
    }
    else if (key == '40') {
        game.update( 0, "down");
    }
    else if (key == '37') {
        game.update( 0, "left");
    }
    else if (key == '39') {
        game.update( 0, "right");
    }
}, false);

game.draw();
