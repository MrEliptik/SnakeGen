var slider_games = document.getElementById("slider_games");
var input_games = document.getElementById("input_slider_games");
var canvas_container = document.querySelector(".canvas-container");
var btn_create = document.getElementById("btn_create");

var games = [];

//var game = new Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, "DF", true); // default mode, display on
//var game = new Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, "DF", false); // default mode, display off
//var game = new Game( 12, 12, 100, 100, 100, canvas.getContext("2d"), 1, 1, "DF", true); // default mode, display on, small size
//var game = new Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, "SP"); // sprite mode [BROKEN]

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

function createGames() {
  for (var i = 0; i < input_games.value; i++) {
    var canvas = document.createElement("canvas");
    canvas.id = "canvas_" + String(i);
    canvas.width = 100;
    canvas.height = 100;
    canvas_container.appendChild(canvas);

    games.push(
      new Game(12, 12, 100, 100, 100, canvas.getContext("2d"), 1, 1, "DF", true)
    );
  }
}

// Add an event listener from the keyboard
document.addEventListener(
  "keyup",
  event => {
    const key = event.keyCode;

    if (key == "38") {
      game.update(0, "up");
    } else if (key == "40") {
      game.update(0, "down");
    } else if (key == "37") {
      game.update(0, "left");
    } else if (key == "39") {
      game.update(0, "right");
    }
  },
  false
);

window.addEventListener(
  "resize",
  e => {
    //console.log(canvas_container.offsetWidth);

    //canvas.width = canvas_container.offsetWidth;
    //canvas.height = canvas_container.offsetHeight;

    canvas.width = (document.documentElement.clientWidth * 2) / 3;
    canvas.height = (document.documentElement.clientHeight * 2) / 3;

    games.forEach(game => {
      if (game.display) {
        game.draw();
      }
    });
  },
  false
);

slider_games.addEventListener("change", () => {
  input_games.value = slider_games.value;
});

btn_create.addEventListener("click", () => {
  createGames();
});
