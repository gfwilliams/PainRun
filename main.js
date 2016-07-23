var STEREO = true;

var texture;
var camera, scene, renderer;
var controls;
var sections = [];
var sectionOffset = 0;
var position = 0;
var lastTime = window.performance.now();
var lastGamepadBtns = 0;

init();
animate();

function newSection() {
  var section = new Section(texture);
  section.sectionStart = sectionOffset;
  section.sectionEnd = sectionOffset + section.sectionLength;
  section.group.position.z = section.sectionStart;
  sectionOffset += section.sectionLength;
  scene.add(section.group);
  section.start();
  sections.push(section);
}

function init() {
  texture = new THREE.TextureLoader().load( 'border.png' );


  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
  camera.rotation.x = Math.PI;
  camera.position.x = -0.5;
  camera.position.y = -0.5;
  camera.position.z = 4;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0, 5, 10);

  for (var i=0;i<3;i++) newSection();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  if (STEREO) {
    effect = new THREE.StereoEffect( renderer ); 
    effect.eyeSeparation = 0.4;
    effect.setSize( window.innerWidth, window.innerHeight );
  }

  //

  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'keydown', onKeyDown, false );
  window.addEventListener('deviceorientation', setOrientationControls, true);
  window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});
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

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  if (STEREO) 
    effect.setSize( window.innerWidth, window.innerHeight );
  else
    renderer.setSize( window.innerWidth, window.innerHeight );
  
}

// Move camera
function mv(p) {
  new TWEEN.Tween(camera.position).to(p, 500).start();
}

function onKeyDown(e) {
  console.log(e.keyCode);



  switch(e.keyCode) {
    case 37: mv({x:-0.5}); break; // l
    case 39: mv({x:0.5}); break; // r
    case 38: mv({y:-0.5}); break; // u
    case 40: mv({y:0.5}); break; // d
  };
}



function checkGamepad() {
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
  } else if (navigator.getGamepads && navigator.getGamepads()) {
    var gp = navigator.getGamepads()[0];
    if (!gp) return;
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
    var threshMax = 0.3;
    var threshMin = 0.1;
    if (btns&1) {
      if (v.y<threshMin) btns &= ~1;
    } else {
      if (v.y>threshMax) btns |= 1;
    }
    if (btns&4) {
      if (v.y>-threshMin) btns &= ~4;
    } else {
      if (v.y<threshMax) btns |= 4;
    }
  }
  var newBtn = btns & ~lastGamepadBtns;
  if (newBtn&1) mv({y:0.5});
  if (newBtn&2) mv({x:0.5});
  if (newBtn&4) mv({x:-0.5});
  if (newBtn&8) mv({y:-0.5});
  lastGamepadBtns = btns;
}

function animate() {

  checkGamepad();

  // update timing
  var time = window.performance.now();
  var timeDiff = time - lastTime;
  lastTime = time;

  TWEEN.update();
  
  position += 4*timeDiff/1000;
  camera.position.z = position;
  if (controls)
    controls.update(timeDiff);

  // now remove old sections
  if (position > sections[0].sectionEnd) {
    scene.remove(sections[0].group);
    sections.shift();
    newSection();
  }

  // collision
  var directionVector = new THREE.Vector3(0,0,-1);
  var ray = new THREE.Raycaster( camera.position, directionVector );
  var collisionResults = ray.intersectObjects( scene.children, true);
  var collisionDists = [];
  collisionResults.forEach(function(c) {
    if (collisionDists.indexOf(c.distance)<0)
      collisionDists.push(c.distance);
  });
  if (collisionDists.length&1) {
    console.log("Oops!");
  }


  requestAnimationFrame( animate );
  if (STEREO) 
    effect.render( scene, camera );
  else
    renderer.render( scene, camera );
}
