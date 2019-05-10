var slider_population = document.getElementById("slider_population");
var slider_games_visible = document.getElementById("slider_games_visible");
var input_population = document.getElementById("input_slider_population");
var input_games_visible = document.getElementById("input_slider_games_visble");
var canvas_container = document.querySelector(".canvas-container");
var btn_create = document.getElementById("btn_create");
var btn_delete = document.getElementById("btn_delete");
var btn_default = document.getElementById("btn_default");
var radios_speed = document.getElementsByName("speed");

var games = [];
var speed = 1;

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

function allDefaultUI() {}

function createGames() {
  // First delete previously created games
  deleteGames();
  var visible = 0;
  for (var i = 0; i < input_population.value; i++) {
    if(visible < input_games_visible.value){
      var canvas = document.createElement("canvas");
      canvas.id = "canvas_" + String(i);
      if(canvas_container.offsetWidth / input_population.value < 90) canvas.width = 90;
      else canvas.width = canvas_container.offsetWidth / input_population.value;
      canvas.height = canvas.width;
      canvas_container.appendChild(canvas);
      games.push(
        new Game(12, 12, canvas.height, canvas.width, canvas, 1, 1, "DF", true)
      );
      visible++;
    }
    else{
      games.push(
        new Game(12, 12, canvas.height, canvas.width, canvas, 1, 1, "DF", false)
      );
    }
    
  }
}

function deleteGames() {
  // Ask for user's confirmation first
  if (games.length > 0) {
    if (
      askUserConfirmation(
        "This is going to delete currently created games, are you sure?"
      )
    ) {
      // Remove canvas from container
      while (canvas_container.firstChild) {
        canvas_container.removeChild(canvas_container.firstChild);
      }
      // Empty the games array object
      games = [];
    }
  }
}

function askUserConfirmation(msg) {
  return confirm(msg);
}

function getSpeedValue() {
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      // do whatever you want with the checked radio
      alert(radios[i].value);

      // only one radio can be logically checked, don't check the rest
      break;
    }
  }
}

// Add an event listener from the keyboard
document.addEventListener(
  "keyup",
  event => {
    const key = event.keyCode;

    if (key == "38") {
      games.forEach(game => {
        game.update(0, "up");
      });
    } else if (key == "40") {
      games.forEach(game => {
        game.update(0, "down");
      });
    } else if (key == "37") {
      games.forEach(game => {
        game.update(0, "left");
      });
    } else if (key == "39") {
      games.forEach(game => {
        game.update(0, "right");
      });
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

    //canvas.width = (document.documentElement.clientWidth * 2) / 3;
    //canvas.height = (document.documentElement.clientHeight * 2) / 3;

    games.forEach(game => {
      if (game.display) {
        game.draw();
      }
    });
  },
  false
);

slider_population.addEventListener("change", () => {
  input_population.value = slider_population.value;
});

slider_games_visible.addEventListener("change", () => {
  input_games_visible.value = slider_games_visible.value;
});

btn_create.addEventListener("click", () => {
  createGames();
});

btn_delete.addEventListener("click", () => {
  deleteGames();
});

btn_default.addEventListener("click", () => {
  allDefaultUI();
});

for (var i = 0, max = radios_speed.length; i < max; i++) {
  radios_speed[i].onclick = function() {
    speed = this.value;
  };
}
