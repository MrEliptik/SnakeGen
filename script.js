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

var btn_restart = document.getElementById("btn_restart");
var btn_start = document.getElementById("btn_start");
var btn_stop = document.getElementById("btn_stop");

var btn_chart = document.getElementById("btn_chart");

var radios_speed = document.getElementsByName("speed");

var env = null;
var trainingChart = null;
var playPauseState = "pause";

var speed = 30;
var nb_input_neurons = 11;
var nb_hidden_neurons = 100;
var nb_output_neurons = 3;

function testChartJS(){
  trainingChart.data.datasets.forEach((dataset) => {
      dataset.data.push(Math.floor(Math.random() * 500) + 1);
  });
  trainingChart.data.labels.push(trainingChart.data.labels[trainingChart.data.labels.length-1]+1);
  trainingChart.update();
}

function testyTest(){
  var a = new Agent(10, 10, null, null, null, 1, 1, 'df', false, 1, 11, 100, 3);
  a.step();
}

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

  if (parseInt(input_games_visible.value) > parseInt(input_population.value)) {
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
  for(var i = 0; i < parseInt(input_games_visible.value); i++) {
    var canvas = document.createElement("canvas");
    canvas.id = "canvas_" + String(i);
    if ((window.innerHeight - canvas_container.offsetTop - 20) / input_games_visible.value < 90) {
      canvas.height = 90;
    } else {
      canvas.height = (window.innerHeight - canvas_container.offsetTop - 20) / input_games_visible.value;
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
    100,                              // selectionPerCentage
    5,                                // stepSizeParameter
    0.01,                                 // mutationProb
    speed,
    nb_input_neurons,
    parseInt(input_slider_neurons.value),
    nb_output_neurons,
    300,
    "pause"
  );
  env.update(0);

  createTrainingChart();

  // Call nn every seconds
  window.setInterval(function() {
    updateChart(env.getCurrGenID(), env.getCurrGenHighestScore());
  }, 5000);
}

function createTrainingChart(){
  var ctx = document.getElementById('training-chart').getContext('2d');
  trainingChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [0],
      datasets: [{ 
          data: [],
          label: "Best score",
          borderColor: "#3e95cd",
          fill: false
        }]
    },
    options: {
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Best score per generation'
      }
    }
  });
}

function updateChart(genID, value){
  console.log(genID, value);
  if(trainingChart.data.labels[trainingChart.data.labels.length-1] == genID){
    trainingChart.data.datasets.forEach((dataset) => {
      if(trainingChart.data.length > 0){
        dataset.data[trainingChart.data.length-1] = value;
      }
      else{
        dataset.data.push(value);
      }
    });
  }
  else{
    trainingChart.data.datasets.forEach((dataset) => {
      dataset.data.push(value);
    });
    trainingChart.data.labels.push(genID);
  }
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
      // Empty the games array object
      env = null;
    }
  }
}

function askUserConfirmation(msg) {
  return confirm(msg);
}

function toggleChartDisplay(){
  var chart = document.querySelector(".training-chart-wrapper");
  if (chart.style.display === "none") {
    chart.style.display = "block";
    btn_chart.className = 'controls-chart-on';
  } else {
    chart.style.display = "none";
    btn_chart.className = 'controls-chart-off';
  }
}

function toggleStartPause(){
  var html = '';
  if(env.getPlayPauseState() == "pause"){
    html = '<i class="fas fa-pause"></i>';
    env.setPlayPauseState("play");
    env.update();
  }
  else{
    html = '<i class="fas fa-play"></i>';
    env.setPlayPauseState("pause");
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

// Add an event listener from the keyboard
document.addEventListener(
  "keyup",
  event => {
    const key = event.keyCode;

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

btn_restart.addEventListener("click", () => {

});

btn_start.addEventListener("click", () => {
  toggleStartPause();
});

btn_stop.addEventListener("click", () => {

});

btn_chart.addEventListener("click", () => {
  toggleChartDisplay();
});

for (var i = 0, max = radios_speed.length; i < max; i++) {
  radios_speed[i].onclick = function() {
    speed = parseInt(this.value);
    // Goes from x1, x2, etc.. to 30fps, 60fps...
    speed *= 30;
    env.setSpeed(speed);
  };
}
