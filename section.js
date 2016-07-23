function Section() {
  var section = this;
  this.group = new THREE.Object3D();
  this.tweens = [];
  
  var texture = new THREE.TextureLoader().load( 'crate.gif' );
  var geometry = new THREE.BoxBufferGeometry( 1, 1, 1);
  var material = new THREE.MeshBasicMaterial( { map: texture } );
  material.side = THREE.DoubleSide;

  var tweener = function() {
    var mesh = this;
    var p = { 
      x: mesh.position.x,
      y: mesh.position.y,
      z: mesh.position.z,
      rx: mesh.rotation.x,
      ry: mesh.rotation.y,
      rz: mesh.rotation.z,
    };
    var t = new TWEEN.Tween(p);
    t.onUpdate(function(){
      mesh.position.x = p.x;
      mesh.position.y = p.y;
      mesh.position.z = p.z;
      mesh.rotation.x = Math.PI*p.rx*2;
      mesh.rotation.y = Math.PI*p.ry*2;
      mesh.rotation.z = Math.PI*p.rz*2;
    });
    section.tweens.push(t);
    return t;
  };

  this.box = function(x,y,z) {     
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    this.group.add( mesh );
    mesh.tween = tweener;
    return mesh;
  };


  for (var z=0.5;z<7;z+=1) {
    this.box(-1.5, 0.5,z);
    this.box(-1.5,-0.5,z);
    this.box( 1.5, 0.5,z);
    this.box( 1.5,-0.5,z);

    this.box( 0.5,-1.5,z);
    this.box(-0.5,-1.5,z);
    this.box( 0.5, 1.5,z);
    this.box(-0.5, 1.5,z);
  }
  this.box(-0.5,0.5,5.5);
  this.box(1.5,-0.5,3.5).tween().to({x:0.5, ry:1}, 1000);
  this.box(1.5,0.5,3.5).tween().to({x:0.5, ry:1}, 1000);
  this.sectionLength = 7;
}

Section.prototype.start = function() {
  this.tweens.forEach(function(t) { t.start(); });
};

