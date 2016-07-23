// Move camera
function mv(p) {
  new TWEEN.Tween(camera.position).to(p, 500).start();
}

function onKeyDown(e) {
  //console.log(e.keyCode);
  switch(e.keyCode) {
    case 37: mv({x:0.5}); break; // l
    case 39: mv({x:-0.5}); break; // r
    case 38: mv({y:0.5}); break; // u
    case 40: mv({y:-0.5}); break; // d
  };
}

function checkControls() {
  var btns = 0;
  if(navigator.webkitGetGamepads) {
    var gp = navigator.webkitGetGamepads()[0];
    if(gp.buttons[0] == 1) {
      btns |= 1;
    } else if(gp.buttons[1] == 1) {
      btns |= 2;
    } else if(gp.buttons[2] == 1) {
      btns |= 4;
    } else if(gp.buttons[3] == 1) {
      btns |= 8;
    }
  } else if (navigator.getGamepads && navigator.getGamepads()[0]) {
    var gp = navigator.getGamepads()[0];
    if(gp.buttons[0].value > 0 || gp.buttons[0].pressed == true) {
      btns |= 1;
    } else if(gp.buttons[1].value > 0 || gp.buttons[1].pressed == true) {
      btns |= 2;
    } else if(gp.buttons[2].value > 0 || gp.buttons[2].pressed == true) {
      btns |= 4;
    } else if(gp.buttons[3].value > 0 || gp.buttons[3].pressed == true) {
      btns |= 8;
    }
  } else {
    // move based on orientation
    btns = lastGamepadBtns;
    var v = new THREE.Vector3( 0, 0, -1 );
    v.applyQuaternion( camera.quaternion );
    var threshMax = 0.2;
    var threshMin = 0.1;
    if (btns&1) {
      if (v.y<threshMin) btns &= ~1;
    } else {
      if (v.y>threshMax) btns |= 1;
    }
    if (btns&2) {
      if (v.x<threshMin) btns &= ~2;
    } else {
      if (v.x>threshMax) btns |= 2;
    }
    if (btns&4) {
      if (v.x>-threshMin) btns &= ~4;
    } else {
      if (v.x<-threshMax) btns |= 4;
    }
    if (btns&8) {
      if (v.y>-threshMin) btns &= ~8;
    } else {
      if (v.y<-threshMax) btns |= 8;
    }
  }
  var newBtn = btns & ~lastGamepadBtns;
  if (newBtn&1) mv({y:0.5});
  if (newBtn&2) mv({x:0.5});
  if (newBtn&4) mv({x:-0.5});
  if (newBtn&8) mv({y:-0.5});
  lastGamepadBtns = btns;
}

function setOrientationControls(e) {
  if (!e.alpha) {
    return;
  }
  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();
  window.removeEventListener('deviceorientation', setOrientationControls, true);
}


// ---------------------------------------------------------------------------
function setupControls() {
  window.addEventListener( 'keydown', onKeyDown, false );
  window.addEventListener( 'deviceorientation', setOrientationControls, true);
}
