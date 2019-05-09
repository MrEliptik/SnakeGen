var canvas = document.getElementById("canvas");

//var game = new Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, "DF", true) // default mode, display on
//var game = new Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, "DF", false) // default mode, display off
var game = new Game( 12, 12, 100, 100, 100, canvas.getContext("2d"), 1, 1, "DF", true) // default mode, display on, small size
//var game = new Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, "SP") // sprite mode [BROKEN]

   /* 
    3 inputs : right, front, left
    100 neurons : hidden layer
    3 outputs : right, forward, left
    */
   var nn = new NeuralNetwork(11, 100, 3);

   // Call nn every seconds
   /*
   window.setInterval(function() {
     console.log(game.getGrid());
     //nn.predict();
   }, 1000);
   */

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

window.addEventListener("resize", (e) =>{
    var canvas = document.getElementById("canvas");
    var canvas_container = document.querySelector(".canvas");
    //console.log(canvas_container.offsetWidth);

    //canvas.width = canvas_container.offsetWidth;
    //canvas.height = canvas_container.offsetHeight;

    canvas.width = document.documentElement.clientWidth * 2/3;
    canvas.height = document.documentElement.clientHeight * 2/3;
    
    if(game.display){
        game.draw();
    }

}, false);
