var svg = document.getElementById("svg");
var svgDoc = svg.contentDocument;

function initGame() {
  svg.remove();
  svg = undefined;
  init();
}

svgDoc.getElementById("fullscreen").addEventListener('click', function() {
  STEREO = false;
  USE_GYRO = false;
  initGame();
});
svgDoc.getElementById("cardboard_gyro").addEventListener('click', function() {
  STEREO = true;
  STEREO_SEP = 0.3;
  USE_GYRO = true;
  initGame();
});
svgDoc.getElementById("cardboard_nogyro").addEventListener('click', function() {
  STEREO = true;
  STEREO_SEP = 0.3;
  USE_GYRO = false;
  initGame();
});
svgDoc.getElementById("crosseyed").addEventListener('click', function() {
  STEREO = true;
  STEREO_SEP = -0.1;
  USE_GYRO = false;
  initGame();
});
