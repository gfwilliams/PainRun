var STEREO = true;

var materials;
var camera, scene, renderer;
var controls;
var sections = [];
var sectionOffset = 0;
var position = 0;
var lastTime = window.performance.now();
var lastGamepadBtns = 0;
var score = 0;
var gameRunning = false;

var spritey; // game over text

init();
animate();

function resetGame() {
  while (sections.length) {
    scene.remove(sections[0].group);
    sections.shift();
  }
  position = 0;
  sectionOffset = 0;
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

  spritey = makeTextSprite( "Game Over!" );
  spritey.position.set(0,0,2);
  scene.add( spritey );

}

function makeTextSprite( message  )
{
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold 64px ";
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	
	context.strokeStyle = "white";
	context.fillStyle = "white";

	context.fillText( message, 0, 64);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture, useScreenCoordinates: false } );
	var sprite = new THREE.Sprite( spriteMaterial );
        
	sprite.scale.set(1,1,1);
	return sprite;	
}



function newSection(forceSection) {
  var section = new Section(forceSection);
  section.sectionStart = sectionOffset; 
  section.sectionEnd = sectionOffset + section.sectionLength;
  section.group.position.z = section.sectionStart;
  sectionOffset += section.sectionLength;
  scene.add(section.group);
  setTimeout(function() {
    section.start();
  }, 500); 
  sections.push(section);
}

function init() {
  materials = {
    sq : new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'border.png' ) } ),
    circ : new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'bordercirc.png' ) } )
  };
  for (var i in materials)
    materials[i].side = THREE.DoubleSide;

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
  camera.rotation.x = Math.PI;
  camera.position.x = -0.5;
  camera.position.y = -0.5;
  camera.position.z = 4;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0, 5, 10);

  resetGame();
  //stopGame();
  newGame();

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
  setupControls();
  setupWindow();
  

}

function animate() {

  if (gameRunning) {
    checkControls();

    // update timing
    var time = window.performance.now();
    var timeDiff = time - lastTime;
    lastTime = time;
    if (timeDiff>100) timeDiff=100; // in case paused
    score += timeDiff/1000;

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
      console.log("Collision! "+collisionDists.length+" at "+position);
     // if (position>2) stopGame();
    }
  }

  requestAnimationFrame( animate );
  if (STEREO) 
    effect.render( scene, camera );
  else
    renderer.render( scene, camera );
}


