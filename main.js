var STEREO = true;

var texture, material;
var camera, scene, renderer;
var controls;
var sections = [];
var sectionOffset = 0;
var position = 0;
var lastTime = window.performance.now();
var lastGamepadBtns = 0;

init();
animate();

function newSection(forceSection) {
  var section = new Section(material, forceSection);
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
  material = new THREE.MeshBasicMaterial( { map: texture } );
  material.side = THREE.DoubleSide;

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
  camera.rotation.x = Math.PI;
  camera.position.x = -0.5;
  camera.position.y = -0.5;
  camera.position.z = 4;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0, 5, 10);

  newSection(0);
  newSection(0);
  newSection();
  newSection();

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
  checkControls();

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


