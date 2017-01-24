var STEREO = true;
var STEREO_SEP = -0.4;
var USE_GYRO = false;

var materials;
var camera, scene, group, renderer;
var controls;
var sections = [];
var sectionOffset = 0;
var position = 0;
var lastTime = window.performance.now();
var lastGamepadBtns = 0;
var score = 0;
var gameRunning = false;

var spritey; // game over text

function resetGame() {
  while (sections.length) {
    group.remove(sections[0].group);
    sections.shift();
  }
  if (spritey) {
    group.remove(spritey);
    spritey = undefined;
  }
  position = 0;
  sectionOffset = 0;
  mv({x:0,y:0});
}

function newGame() {
  score = 0;
  gameRunning = true;

  newSection(0);
  newSection(0);
  newSection();
}

function stopGame() {
  console.log("STOPPED GAME");
  resetGame();
  gameRunning = false;

  var canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  var context = canvas.getContext('2d');
  context.textAlign = "center";
  context.strokeStyle = "white";
  context.fillStyle = "white";
  context.font = "48px Arial";
  context.fillText( "Game Over!", 128, 48);
  context.font = "32px Arial";
  context.fillText( "Score: "+Math.round(score*10), 128, 96);
  context.font = "24px Arial";
  context.fillText( "(Click to restart)", 128, 128);
  var texture = mapC = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  var spriteMaterial = new THREE.MeshBasicMaterial( { map: texture, color: 0xffffff } );
  spriteMaterial.side = THREE.DoubleSide;
  var geo = new THREE.PlaneGeometry( -2, 1 );
  spritey = new THREE.Mesh( geo, spriteMaterial );
  spritey.position.set(0,0,3);
  group.add( spritey );
}


function newSection(forceSection) {
  var section = new Section(forceSection);
  section.sectionStart = sectionOffset;
  section.sectionEnd = sectionOffset + section.sectionLength;
  section.group.position.z = section.sectionStart;
  sectionOffset += section.sectionLength;
  group.add(section.group);
  setTimeout(function() {
    section.start();
  }, 500);
  sections.push(section);
}

function init() {
  document.getElementsByTagName("body")[0].overflow = "hidden";

  materials = {
    sq : new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'border.png' ) } ),
    circ : new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'bordercirc.png' ) } )
  };
  for (var i in materials)
    materials[i].side = THREE.DoubleSide;

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );

  group = new THREE.Group();
  group.rotation.y = Math.PI;
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0, 5, 10);
  scene.add(group);

  resetGame();
  newGame();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  if (STEREO) {
    effect = new THREE.StereoEffect( renderer );
    effect.eyeSeparation = STEREO_SEP;
    effect.setSize( window.innerWidth, window.innerHeight );
  }

  //
  setupControls();
  setupWindow();

  // kick off first frame
  animate();
}

function animate() {

  // update timing
  var time = window.performance.now();
  var timeDiff = time - lastTime;
  lastTime = time;
  if (timeDiff>100) timeDiff=100; // in case paused
  if (controls)
    controls.update(timeDiff);
  checkControls();
  TWEEN.update();

  if (gameRunning) {
    score += timeDiff/1000;

    position += (1+score/100)*4*timeDiff/1000;

    // now remove old sections
    if (position > sections[0].sectionEnd) {
      group.remove(sections[0].group);
      sections.shift();
      newSection();
    }

    camera.position.z = -position;
    // collision
    var directionVector = new THREE.Vector3(0,0,-1);
    var ray = new THREE.Raycaster( camera.position, directionVector );
    var collisionResults = ray.intersectObjects( group.children, true);
    var collisionDists = [];
    collisionResults.forEach(function(c) {
      if (collisionDists.indexOf(c.distance)<0)
        collisionDists.push(c.distance);
    });
    if (collisionDists.length&1) {
      console.log("Collision! "+collisionDists.length+" at "+position);
      if (position>2) stopGame();
    }
  } else {
    camera.position.z = -position;
  }
  if (spritey) {
    spritey.rotation.x = Math.sin(time / 400)/10;
    spritey.rotation.y = Math.sin(time / 567)/10;
  }


  requestAnimationFrame( animate );
  if (STEREO)
    effect.render( scene, camera );
  else
    renderer.render( scene, camera );
}
