var canvas = document.getElementById("canvas");

var game = new Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, "DF") // default mode
//var game = new Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, "SP") // sprite mode [BROKEN]

/* 
    3 inputs : right, front, left
    100 neurons : hidden layer
    3 outputs : right, forward, left
*/
var nn = new NeuralNetwork(3, 100, 3)

// Call nn every seconds
window.setInterval(function(){
    console.log(game.getSnakesPosition())
    nn.predict()
}, 1000);

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
