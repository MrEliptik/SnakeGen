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

var r_navbar_title_sections = document.querySelectorAll('.navbar-section .title');

var btn_create = document.getElementById("btn_create");
var btn_delete = document.getElementById("btn_delete");
var btn_default = document.getElementById("btn_default");

var btn_restart = document.getElementById("btn_restart");
var btn_start = document.getElementById("btn_start");
var btn_stop = document.getElementById("btn_stop");

var btn_chart = document.getElementById("btn_chart");

var btn_upload = document.getElementById("btn_upload");
var bnt_save = document.getElementById("btn_save");

var btn_timelapse = document.getElementById("btn_timelapse");

var radios_speed = document.getElementsByName("speed");

var li_gen_high_score = document.getElementById("gen_high_score");
var li_agents_alive = document.getElementById("agents_alive");
var li_gen_id = document.getElementById("gen_id");

var env = null;
var trainingChart = null;
var playPauseState = "pause";
var isTimelapsing = false;
var timelapse_interval = null;

var speed = 30;
var nb_input_neurons = 11;
var nb_hidden_neurons = 100;
var nb_output_neurons = 3;

var chart_first_init = true;

/* set tf backend to cpu as we would lose 
  time copying values to the GPU. Net is too
  small to take advantage of GPU compute
*/
tf.setBackend("cpu");

window.setInterval(() => {
  if (env != null) {
    var highestscore = env.getCurrScore();
    var agentsAlive = env.getAgentsAlive();
    var genID = env.getCurrGenID();

    li_gen_high_score.innerText = "Generation's highest score: " + String(highestscore);
    li_agents_alive.innerText = "Agents alive: " + String(agentsAlive)
    li_gen_id.innerText = "Generation ID: " + String(genID);

  }
}, 500);

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

    /* Create a new 'input' event to update
      the inputs */
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

  createEnv();

  createTrainingChart();
}

function createEnv(weights = null) {
  var canvases = [];

  if (weights != null) {
    if (weights.length < parseInt(input_games_visible.value)) {
      input_games_visible.value = weights.length;
    }
    if (weights.length < parseInt(input_population.value)) {
      input_population.value = weights.length;
    }
  }

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
    [1, 0.5], // Constants
    weights
  );
  env.update(0);

}

function createTrainingChart() {
  if (computedStyle(document.querySelector(".training-chart-wrapper"), "display") == "none") {
    return;
  }
  else {
    chart_first_init = false;
  }
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
        },
        {
          data: [],
          label: "Mean score",
          borderColor: "#85fc16",
          fill: false
        }
      ]
    },
    options: {
      legend: {
        display: true
      },
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
        text: "Best score per generation"
      }
    }
  });
}

function updateChart(genID, valueScoreMax, valueScore, valueMeanScore) {
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
      trainingChart.data.datasets[2].data[
        trainingChart.data.length - 1
      ] = valueMeanScore;
    } else {
      trainingChart.data.datasets[0].data.push(valueScoreMax);
      trainingChart.data.datasets[1].data.push(valueScore);
      trainingChart.data.datasets[2].data.push(valueMeanScore); 
    }
  } else {
    trainingChart.data.datasets[0].data.push(valueScoreMax);
    trainingChart.data.datasets[1].data.push(valueScore);
    trainingChart.data.datasets[2].data.push(valueMeanScore);
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
  /*
  var chart = document.querySelector(".training-chart-wrapper");
  if (computedStyle(chart, "display") == "none") {
    chart.style.display = "block";
    btn_chart.className = "controls-chart-on";
    if (chart_first_init) {
      createTrainingChart();
    }
  } else {
    chart.style.display = "none";
    btn_chart.className = "controls-chart-off";
  }*/
  var infos = document.querySelector(".training-info");
  if (computedStyle(infos, "display") == "none") {
    infos.style.display = "grid";
    btn_chart.className = "controls-chart-on";
    if (chart_first_init) {
      createTrainingChart();
    }
  } else {
    infos.style.display = "none";
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

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function saveModel(which = 'all') {
  console.log('Saving weights..');
  var json_weights = [];
  env.agents.forEach(agent => {
    json_weights.push({
      'input_weights': agent.nn.input_weights.arraySync(),
      'output_weights': agent.nn.output_weights.arraySync()
    });
  });
  download(JSON.stringify(json_weights), 'weights.json', 'application/json');
}

function loadModel() {
  if (
    askUserConfirmation(
      "This is going to everride all current nn weights, are you sure?"
    )
  ) {
    // generate a click on the hidden input file
    // this will start the file browsing process
    document.getElementById('weight_file').click();
  }
}
// Called when the user has selected a json file
function handleFileSelect(e) {
  file = e.target.files[0];
  // clear files to allow next upload
  e.target.value = '';
  fr = new FileReader();
  fr.onload = receivedText;
  fr.readAsText(file);

  function receivedText(e) {
    let lines = e.target.result;
    // Contains the whole generation's weights
    var agents_weights = JSON.parse(lines);
    loadWeightsToAgents(agents_weights);
  }
}

// This function willl try to load the weights
// read from the file into the agents
function loadWeightsToAgents(weights) {
  if (env == null) {
    if (
      askUserConfirmation(
        "No environment is created. Would you like to create one with the weights you selected?"
      )
    ) {
      createEnv(weights);
      createTrainingChart();
    }
  }
  else {
    deleteGames();
    resetChart();
    createEnv(weights);
  }
}

function toggleSection(elem) {
  // Select second child of parent (or neighbor)
  if (elem.parentNode.children[1].style.display === "none") {
    elem.parentNode.children[1].style.display = "block";

    elem.innerHTML = elem.innerHTML.replace('+', '-');
  } else {
    elem.parentNode.children[1].style.display = "none";
    elem.innerHTML = elem.innerHTML.replace('-', '+');
  }
}

// Get the style that was set by css
var computedStyle = function (el, style) {
  var cs;
  if (typeof el.currentStyle != 'undefined') {
    cs = el.currentStyle;
  }
  else {
    cs = document.defaultView.getComputedStyle(el, null);
  }
  return cs[style];
}

function report() {
  let region = document.querySelector("body"); // whole screen
  html2canvas(region, {
    onrendered: function (canvas) {
      let pngUrl = canvas.toDataURL(); // png in dataURL format
      
      // DISPLAY
      /*
      let img = document.querySelector(".screen");
      img.src = pngUrl;
      */

      var data = atob(pngUrl.substring("data:image/png;base64,".length)),
        asArray = new Uint8Array(data.length);

      for (var i = 0, len = data.length; i < len; ++i) {
        asArray[i] = data.charCodeAt(i);
      }

      download(asArray.buffer, 'screen.png', 'image/png');
    },
  });
}

function toggleTimelapse(){
  if(isTimelapsing){
    let html = `Timelapse <i class="fas fa-play"></i>`;
    btn_timelapse.innerHTML = html;
    btn_timelapse.className = "timelapse-off";
    isTimelapsing = false;
    clearInterval(timelapse_interval);
  }
  else{
    let html = `Timelapse <i class="fas fa-stop"></i>`;
    btn_timelapse.innerHTML = html;
    btn_timelapse.className = "timelapse-on";
    isTimelapsing = true;
    timelapse_interval = setInterval(report, 3000);
  }
}

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

btn_restart.addEventListener("click", () => {

});

btn_start.addEventListener("click", () => {
  toggleStartPause();
});

btn_stop.addEventListener("click", () => { });

btn_chart.addEventListener("click", () => {
  toggleChartDisplay();
});

btn_upload.addEventListener("click", () => {
  loadModel();
});

bnt_save.addEventListener("click", () => {
  saveModel();
});

btn_timelapse.addEventListener("click", () => {
  toggleTimelapse();
});

// event sent by Environment when we change generation
window.addEventListener("newgeneration", function (e) {
  //console.log(e.detail.id, e.detail.maxScore, e.detail.score);
  updateChart(e.detail.id, e.detail.maxScore, e.detail.score, e.detail.meanScore);
});

// Listener for invisible input file
document.getElementById('weight_file').addEventListener('change', handleFileSelect, false);

r_navbar_title_sections.forEach(section => {
  section.addEventListener('click', (e) => {
    toggleSection(e.currentTarget);
  });
});

// Listener for the radio buttons
for (var i = 0, max = radios_speed.length; i < max; i++) {
  radios_speed[i].onclick = function () {
    speed = parseInt(this.value);
    // Goes from x1, x2, etc.. to 30fps, 60fps...
    speed *= 30;
    env.setSpeed(speed);
  };
}
