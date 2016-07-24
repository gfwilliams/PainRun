var svg = document.getElementById("svg");
var svgDoc = svg.contentDocument;
svgDoc.getElementById("fullscreen").addEventListener('click', function() {
  STEREO = false;
  USE_GYRO = false;
  svg.remove();
  init();
});
svgDoc.getElementById("cardboard_gyro").addEventListener('click', function() {
  STEREO = true;
  STEREO_SEP = 0.3;
  USE_GYRO = true;
  svg.remove();
  init();
});
svgDoc.getElementById("cardboard_nogyro").addEventListener('click', function() {
  STEREO = true;
  STEREO_SEP = 0.3;
  USE_GYRO = false;
  svg.remove();
  init();
});
svgDoc.getElementById("crosseyed").addEventListener('click', function() {
  STEREO = true;
  STEREO_SEP = -0.1;
  USE_GYRO = false;
  svg.remove();
  init();
});
