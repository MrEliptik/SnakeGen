var canvas_container = document.querySelector(".canvas-container");

var slider_population = document.getElementById("slider_population");
var slider_games_visible = document.getElementById("slider_games_visible");
var slider_grid_size = document.getElementById("slider_grid_size");
var slider_hidden_layers = document.getElementById("slider_hidden_layers");
var slider_neurons = document.getElementById("slider_neurons");

var input_population = document.getElementById("input_slider_population");
var input_games_visible = document.getElementById("input_slider_games_visble");
var input_grid_size = document.getElementById("input_slider_grid_size");
var input_hidden_layers = document.getElementById("input_slider_hidden_layers");
var input_slider_neurons = document.getElementById("input_slider_neurons");

var btn_create = document.getElementById("btn_create");
var btn_delete = document.getElementById("btn_delete");
var btn_default = document.getElementById("btn_default");

var radios_speed = document.getElementsByName("speed");

var env = null;
var speed = 1;
var nb_input_neurons = 3;
var nb_hidden_neurons = 100;
var nb_output_neurons = 3;
/* 
    11 inputs : right, front, left
    100 neurons : hidden layer
    3 outputs : right, forward, left
    */
//var nn = new NeuralNetwork(11, 100, 3);

//var nn = new NeuralNetwork(3, 100, 3);

// Call nn every seconds

window.setInterval(function() {
  /*
  games.forEach(game => {
    var grid = games[0].getGrid();
    var snakeState = games[0].getSnakeState();

    var los = calculateLinesOfSight(grid, snakeState['position'], snakeState['orientation']);
    out = nn.predict(los);

    // '...' is the spread operator and in ECMA6
    // corresponds to the apply() method

    max = Math.max(...out);

    if (out[0] == max) {
      game.update(0, "down");
    }
    else if (out[1] == max) {
      game.update(0, "right");
    }
    else if (out[2] == max) {
      game.update(0, "left");
    }
  });
  */
}, 1000);

function allDefaultUI() {
  if (
    askUserConfirmation("This is going to reset all parameters to default!")
  ) {
    slider_population.value = 50;
    slider_games_visible.value = 10;
    slider_grid_size.value = 10;

    // Create a new 'change' event
    var event = new Event("change");
    // Dispatch it.
    slider_population.dispatchEvent(event);
    slider_games_visible.dispatchEvent(event);
    slider_grid_size.dispatchEvent(event);

    // Set speed to '1x'
    radios_speed[0].checked = "checked";
  }
}

function createGames() {
  // First delete previously created games
  deleteGames();

  if (input_games_visible.value > input_population.value) {
    if (
      askUserConfirmation(
        "Number of visible games can't be > than population size, \
        it's going to be set as equal."
      )
    ) {
      input_games_visible.value = input_population.value;
    } else {
      return;
    }
  }

  var canvases = [];

  // Create the required number of canvas to display games
  for(var i = 0; i < input_games_visible.value; i++) {
    var canvas = document.createElement("canvas");
    canvas.id = "canvas_" + String(i);
    if (canvas_container.offsetWidth / input_games_visible.value < 90) {
      canvas.width = 90;
    } else {
      canvas.width = canvas_container.offsetWidth / input_games_visible.value;
    }
    canvas.height = canvas.width;
    canvas_container.appendChild(canvas);
    canvases.push(canvas);
  }

  env = new Environment(
    canvases,
    input_grid_size.value,
    input_grid_size.value,
    1,
    1,
    "DF",
    input_population.value,
    100,
    speed,
    nb_input_neurons,
    parseInt(input_slider_neurons.value),
    nb_output_neurons,
    100,
  );
}

function deleteGames() {
  // Ask for user's confirmation first
  if (env != null) {
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
      env = null;
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

function testyTest() {
  var grid = games[0].getGrid();
  var snakeState = games[0].getSnakeState();

  console.log(
    calculateLinesOfSight(
      grid,
      snakeState["position"],
      snakeState["orientation"]
    )
  );
}

/**
 * Returns an array of LOS from the snake's perspective
 * @param {grid} - The game's grid
 * @param {position} - Tuple for the snake's positon
 * @param {orientation} - Snake's head's orientation = 'up' or 'left' or 'right' or 'down'
 * @returns {linesOfSight} - Array of LOS [up, left, right]
 */
function calculateLinesOfSight(grid, position, orientation) {
  this.position = position;
  this.orientation = orientation;
  this.grid = grid;

  var linesOfSight = [];

  function frontLineOfSight() {
    var i = this.position[0];
    var j = this.position[1];
    var distance = 0;
    do {
      distance += 1;

      if (this.orientation == "down") {
        j += 1;
      } else if (this.orientation == "up") {
        j -= 1;
      } else if (this.orientation == "left") {
        i -= 1;
      } else if (this.orientation == "right") {
        i += 1;
      }
    } while (i in this.grid && j in this.grid[i]);
    return distance - 1;
  }

  function leftLineOfSight() {
    var i = this.position[0];
    var j = this.position[1];
    var distance = 0;
    do {
      distance += 1;

      if (this.orientation == "down") {
        i += 1;
      } else if (this.orientation == "up") {
        i -= 1;
      } else if (this.orientation == "left") {
        j += 1;
      } else if (this.orientation == "right") {
        j -= 1;
      }
    } while (i in this.grid && j in this.grid[i]);
    return distance - 1;
  }

  function rightLineOfSight() {
    var i = this.position[0];
    var j = this.position[1];
    var distance = 0;
    do {
      distance += 1;

      if (this.orientation == "down") {
        i -= 1;
      } else if (this.orientation == "up") {
        i += 1;
      } else if (this.orientation == "left") {
        j -= 1;
      } else if (this.orientation == "right") {
        j += 1;
      }
    } while (i in this.grid && j in this.grid[i]);
    return distance - 1;
  }

  linesOfSight[0] = frontLineOfSight();
  linesOfSight[1] = leftLineOfSight();
  linesOfSight[2] = rightLineOfSight();

  return linesOfSight;
}

/**
 * Returns an array of COS from the snake's perspective
 * @param {grid} - The game's grid
 * @param {position} - Tuple for the snake's positon
 * @param {orientation} - Snake's head's orientation = 'up' or 'left' or 'right' or 'down'
 * @returns {conesOfSight} - Array of COS [left, front_left, front_right, right]
 */
function calculateConesOfSight(grid, position, orientation) {
  this.position = position;
  this.orientation = orientation;
  this.grid = grid;

  var conesOfSight = [];

  for (var i = 0; i < this.grid.length; i++) {
    var row = this.grid[i];
    for (var j = 0; j < row.length; j++) {}
  }
  return conesOfSight;
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

    testyTest();
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

    /*
    games.forEach(game => {
      if (game.display) {
        game.draw();
      }
    });
    */
  },
  false
);

slider_population.addEventListener("change", () => {
  input_population.value = slider_population.value;
});

slider_games_visible.addEventListener("change", () => {
  input_games_visible.value = slider_games_visible.value;
});

slider_grid_size.addEventListener("change", () => {
  input_grid_size.value = slider_grid_size.value;
});

slider_hidden_layers.addEventListener("change", () => {
  input_hidden_layers.value = slider_hidden_layers.value;
});

slider_neurons.addEventListener("change", () => {
  input_slider_neurons.value = slider_neurons.value;
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
