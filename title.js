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

if ('xr' in navigator) {
  if (navigator.xr.supportsSessionMode)
    navigator.xr.supportsSessionMode('immersive-vr').then(() => {
      STEREO = false;
      USE_GYRO = false;
      initGame();
    });
  else
    navigator.xr.supportsSession('immersive-vr').then(() => {
      STEREO = false;
      USE_GYRO = false;
      initGame();
    });
} else if ('getVRDisplays' in navigator) {
  navigator.getVRDisplays().then(x => {
    if (x.length==0) return;
    // We have VR displays - skip this!
    STEREO = false;
    USE_GYRO = false;
    initGame();
  })
}
