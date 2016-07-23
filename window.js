function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  if (STEREO) 
    effect.setSize( window.innerWidth, window.innerHeight );
  else
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function fullscreen() {
  var container = renderer.domElement;
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}

// ---------------------------------------------------------------------------
function setupWindow() {
  renderer.domElement.addEventListener('click', fullscreen, false);
  window.addEventListener( 'resize', onWindowResize, false );
}
