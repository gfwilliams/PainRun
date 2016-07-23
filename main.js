var camera, scene, renderer;
var sections = [];
var sectionOffset = 0;
var position = 0;
var lastTime = window.performance.now();

init();
animate();

function newSection() {
  var section = new Section();
  section.sectionStart = sectionOffset;
  section.sectionEnd = sectionOffset + section.sectionLength;
  section.group.position.z = section.sectionStart;
  sectionOffset += section.sectionLength;
  scene.add(section.group);
  section.start();
  sections.push(section);
}

function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
  camera.rotation.x = Math.PI;
  camera.position.x = -0.5;
  camera.position.y = -0.5;
  camera.position.z = 4;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0, 10, 15);

  for (var i=0;i<3;i++) newSection();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  //

  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'keydown', onKeyDown, false );
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onKeyDown(e) {
  console.log(e.keyCode);

  function mv(p) {
    new TWEEN.Tween(camera.position).to(p, 500).start();
  }

  switch(e.keyCode) {
    case 37: mv({x:-0.5}); break; // l
    case 39: mv({x:0.5}); break; // r
    case 38: mv({y:-0.5}); break; // u
    case 40: mv({y:0.5}); break; // d
  };
}

function animate() {
  // update timing
  var time = window.performance.now();
  var timeDiff = time - lastTime;
  lastTime = time;

  TWEEN.update();
  
  position += 2*timeDiff/1000;
  camera.position.z = position;

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
  renderer.render( scene, camera );
}
