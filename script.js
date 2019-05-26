var canvas_container = document.querySelector(".canvas-container");

var slider_population = document.getElementById("slider_population");
var slider_games_visible = document.getElementById("slider_games_visible");
var slider_grid_size = document.getElementById("slider_grid_size");
var slider_hidden_layers = document.getElementById("slider_hidden_layers");
var slider_neurons = document.getElementById("slider_neurons");
var slider_selection_rate = document.getElementById("slider_selection_rate");

var input_population = document.getElementById("input_slider_population");
var input_games_visible = document.getElementById("input_slider_games_visble");
var input_grid_size = document.getElementById("input_slider_grid_size");
var input_hidden_layers = document.getElementById("input_slider_hidden_layers");
var input_slider_neurons = document.getElementById("input_slider_neurons");
var input_selection_rate = document.getElementById(
  "input_slider_selection_rate"
);

var btn_create = document.getElementById("btn_create");
var btn_delete = document.getElementById("btn_delete");
var btn_default = document.getElementById("btn_default");

var btn_restart = document.getElementById("btn_restart");
var btn_start = document.getElementById("btn_start");
var btn_stop = document.getElementById("btn_stop");

var btn_chart = document.getElementById("btn_chart");

var btn_upload = document.getElementById("btn_upload");
var bnt_save = document.getElementById("btn_save");

var radios_speed = document.getElementsByName("speed");

var env = null;
var trainingChart = null;
var playPauseState = "pause";

var speed = 30;
var nb_input_neurons = 11;
var nb_hidden_neurons = 100;
var nb_output_neurons = 3;

/* set tf backend to cpu as we would lose 
  time copying values to the GPU. Net is too
  small to take advantage of GPU compute
*/
tf.setBackend("cpu");

function allDefaultUI() {
  if (
    askUserConfirmation("This is going to reset all parameters to default!")
  ) {
    slider_population.value = 50;
    slider_games_visible.value = 10;
    slider_grid_size.value = 10;
    slider_hidden_layers.value = 1;
    slider_neurons.value = 100;
    slider_selection_rate.value = 10;

    resetChart();

    // Create a new 'input' event
    var event = new Event("input");
    // Dispatch it.
    slider_population.dispatchEvent(event);
    slider_games_visible.dispatchEvent(event);
    slider_grid_size.dispatchEvent(event);
    slider_hidden_layers.dispatchEvent(event);
    slider_neurons.dispatchEvent(event);
    slider_selection_rate.dispatchEvent(event);

    // Set speed to '1x'
    radios_speed[0].checked = "checked";
  }
}

function createGames() {
  // First delete previously created games
  deleteGames();

  if (parseInt(input_games_visible.value) > parseInt(input_population.value)) {
    if (
      askUserConfirmation(
        "Number of visible games can't be > than population size, \
        it's going to be set as equal."
      )
    ) {
      console.log("ok");
      slider_games_visible.value = parseInt(slider_population.value);
      var event = new Event("input");
      // Dispatch it.
      slider_population.dispatchEvent(event);
      slider_games_visible.dispatchEvent(event);
    } else {
      return;
    }
  }

  if (
    (parseInt(input_selection_rate.value) / 100) *
      parseInt(input_population.value) <
    2
  ) {
    if (
      askUserConfirmation(
        "The population size and selection rate you chose can't make 2 parents. \
        Please modify before trying to create a new population."
      )
    ) {
      return;
    } else {
      return;
    }
  }

  var canvases = [];

  // Create the required number of canvas to display games
  for (var i = 0; i < parseInt(input_games_visible.value); i++) {
    var canvas = document.createElement("canvas");
    canvas.id = "canvas_" + String(i);
    if (
      (window.innerHeight - canvas_container.offsetTop - 20) /
        input_games_visible.value <
      90
    ) {
      canvas.height = 90;
    } else {
      canvas.height =
        (window.innerHeight - canvas_container.offsetTop - 20) /
        input_games_visible.value;
    }
    canvas.width = canvas.height;
    canvas_container.appendChild(canvas);
    canvases.push(canvas);
  }

  env = new Environment(
    canvases,
    parseInt(input_grid_size.value),
    parseInt(input_grid_size.value),
    1,
    1,
    "DF",
    parseInt(input_population.value), // populationSize
    parseInt(input_selection_rate.value), // selectionPerCentage
    5, // stepSizeParameter
    0.01, // mutationProb
    speed,
    nb_input_neurons,
    parseInt(input_slider_neurons.value),
    nb_output_neurons,
    500,
    playPauseState,
    [1, 0.5] // Constants
  );
  env.update(0);

  createTrainingChart();

  // Call nn every seconds
  window.setInterval(function() {
    //updateChart(env.getCurrGenID(), env.getCurrGenHighestScore());
  }, 5000);
}

function createTrainingChart() {
  var ctx = document.getElementById("training-chart").getContext("2d");
  trainingChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [0],
      datasets: [
        {
          data: [],
          label: "Best score",
          borderColor: "#3e95cd",
          fill: false
        },
        {
          data: [],
          label: "Current score",
          borderColor: "#FC1616",
          fill: false
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: "Best score per generation"
      }
    }
  });
}

function updateChart(genID, valueScoreMax, valueScore) {
  if (
    trainingChart.data.labels[trainingChart.data.labels.length - 1] == genID
  ) {
    if (trainingChart.data.length > 0) {
      trainingChart.data.datasets[0].data[
        trainingChart.data.length - 1
      ] = valueScoreMax;
      trainingChart.data.datasets[1].data[
        trainingChart.data.length - 1
      ] = valueScore;
    } else {
      trainingChart.data.datasets[0].data.push(valueScoreMax);
      trainingChart.data.datasets[1].data.push(valueScore);
    }
  } else {
    trainingChart.data.datasets[0].data.push(valueScoreMax);
    trainingChart.data.datasets[1].data.push(valueScore);
    trainingChart.data.labels.push(genID);
  }
  trainingChart.update();
}

function resetChart() {
  trainingChart.data.labels = [];
  trainingChart.data.datasets.forEach(dataset => {
    dataset.data = [];
  });
  trainingChart.update();
}

function deleteGames() {
  // Ask for user's confirmation first
  if (env != null) {
    if (
      askUserConfirmation(
        "This is going to delete all the created games, are you sure?"
      )
    ) {
      // Remove canvas from container
      while (canvas_container.firstChild) {
        canvas_container.removeChild(canvas_container.firstChild);
      }

      setStartPauseState("pause");

      resetChart();

      // Empty the games array object
      env = null;
    }
  }
}

function askUserConfirmation(msg) {
  return confirm(msg);
}

function toggleChartDisplay() {
  var chart = document.querySelector(".training-chart-wrapper");
  if (chart.style.display === "none") {
    chart.style.display = "block";
    btn_chart.className = "controls-chart-on";
  } else {
    chart.style.display = "none";
    btn_chart.className = "controls-chart-off";
  }
}

function setStartPauseState(state) {
  if (state == "play") {
    html = '<i class="fas fa-pause"></i>';
    env.setPlayPauseState("play");
    env.update();
    playPauseState = "play";
  } else {
    html = '<i class="fas fa-play"></i>';
    env.setPlayPauseState("pause");
    playPauseState = "pause";
  }
  btn_start.innerHTML = html;
}

function toggleStartPause() {
  var html = "";
  if (env.getPlayPauseState() == "pause") {
    html = '<i class="fas fa-pause"></i>';
    env.setPlayPauseState("play");
    env.update();
    playPauseState = "play";
  } else {
    html = '<i class="fas fa-play"></i>';
    env.setPlayPauseState("pause");
    playPauseState = "pause";
  }
  btn_start.innerHTML = html;
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

function saveModel() {}

function loadModel() {}

// Add an event listener from the keyboard
document.addEventListener(
  "keyup",
  event => {
    const key = event.keyCode;

    if (env == null) return;

    if (key == "38") {
      env.agents.forEach(pop => {
        pop.game.update("up", false);
      });
    } else if (key == "40") {
      env.agents.forEach(pop => {
        pop.game.update("down", false);
      });
    } else if (key == "37") {
      env.agents.forEach(pop => {
        pop.game.update("left", false);
      });
    } else if (key == "39") {
      env.agents.forEach(pop => {
        pop.game.update("right", false);
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

input_population.addEventListener("input", () => {
  slider_population.value = input_population.value;
});

input_games_visible.addEventListener("input", () => {
  slider_games_visible.value = input_games_visible.value;
});

input_grid_size.addEventListener("input", () => {
  slider_grid_size.value = input_grid_size.value;
});

input_hidden_layers.addEventListener("input", () => {
  slider_hidden_layers.value = input_hidden_layers.value;
});

input_slider_neurons.addEventListener("input", () => {
  slider_neurons.value = input_slider_neurons.value;
});

input_selection_rate.addEventListener("input", () => {
  slider_selection_rate.value = input_selection_rate.value;
});

slider_population.addEventListener("input", () => {
  input_population.value = slider_population.value;
});

slider_games_visible.addEventListener("input", () => {
  input_games_visible.value = slider_games_visible.value;
});

slider_grid_size.addEventListener("input", () => {
  input_grid_size.value = slider_grid_size.value;
});

slider_hidden_layers.addEventListener("input", () => {
  input_hidden_layers.value = slider_hidden_layers.value;
});

slider_neurons.addEventListener("input", () => {
  input_slider_neurons.value = slider_neurons.value;
});

slider_selection_rate.addEventListener("input", () => {
  input_selection_rate.value = slider_selection_rate.value;
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

btn_restart.addEventListener("click", () => {});

btn_start.addEventListener("click", () => {
  toggleStartPause();
});

btn_stop.addEventListener("click", () => {});

btn_chart.addEventListener("click", () => {
  toggleChartDisplay();
});

btn_upload.addEventListener("click", () => {
  loadModel();
});

bnt_save.addEventListener("click", () => {
  saveModel();
});

// event sent by Environment when we change generation
window.addEventListener("newgeneration", function(e) {
  //console.log(e.detail.id, e.detail.maxScore, e.detail.score);
  updateChart(e.detail.id, e.detail.maxScore, e.detail.score);
});

for (var i = 0, max = radios_speed.length; i < max; i++) {
  radios_speed[i].onclick = function() {
    speed = parseInt(this.value);
    // Goes from x1, x2, etc.. to 30fps, 60fps...
    speed *= 30;
    env.setSpeed(speed);
  };
}
