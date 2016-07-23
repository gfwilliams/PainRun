var boxgeometry = new THREE.BoxBufferGeometry( 1, 1, 1);

function Section(texture, forceSection) {
  var section = this;
  this.group = new THREE.Object3D();
  this.tweens = [];

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
    mesh = new THREE.Mesh( boxgeometry, material );
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    this.group.add( mesh );
    mesh.tween = tweener;
    return mesh;
  };

  this.sectionLength = 4;

  for (var z=0.5;z<this.sectionLength;z+=1) {
    this.box(-1.5, 0.5,z);
    this.box(-1.5,-0.5,z);
    this.box( 1.5, 0.5,z);
    this.box( 1.5,-0.5,z);

    this.box( 0.5,-1.5,z);
    this.box(-0.5,-1.5,z);
    this.box( 0.5, 1.5,z);
    this.box(-0.5, 1.5,z);
  }

  var r = Math.floor(Math.random()*10);
  if (forceSection!==undefined) r=forceSection;
  var r2 = Math.floor(Math.random()*4);
  var sidex = (r2&1)?1:-1;
  var sidey = (r2&2)?1:-1;
  var z = 1.5+Math.floor(Math.random()*3);

  switch (r) {
    case 0: // breathe...
            break;
    case 1: this.box(1.5*sidex, 1.5*sidey, z).tween().to({rz:1, x:0.5*sidex, y:0.5*sidey}, 1000);
            break;
    case 2: this.box(1.5*sidex, 1.5*sidey, z).tween().to({x:0.5*sidex, y:0.5*sidey}, 1000); 
            break;
    case 3: this.box(0.5*sidex, 0.5*sidey, z); 
            break;
    case 4: this.box(1.5*sidex,-0.5,z).tween().to({x:0.5*sidex, ry:1}, 1000);
            this.box(1.5*sidex,0.5,z).tween().to({x:0.5*sidex, ry:1}, 1000);  
            break;
    case 5: this.box(0.5,1.5*sidey,z).tween().to({y:0.5*sidex, rx:1}, 1000); 
            this.box(-0.5,1.5*sidex,z).tween().to({y:0.5*sidex, rx:1}, 1000); 
            break;
    case 6: this.box(0.5*sidex, 0.5*sidey, z);
            this.box(-0.5*sidex, 0.5*sidey, z);  
            break;
    case 7: this.box(0.5*sidex, -0.5*sidey, z);
            this.box(-0.5*sidex, 0.5*sidey, z);  
            break;
    case 8: this.box(0.5*sidex, 0.5*sidey, z);
            this.box(0.5*sidex, -0.5*sidey, z);  
            break;
    case 9: this.box(0.5*sidex, 0.5*sidey, z);
            this.box(-0.5*sidex, 0.5*sidey, z); 
            this.box(0.5*sidex, -0.5*sidey, z);  
            break;
    //
    //this.box(1.5,0.5,3.5).tween().to({x:0.5, ry:1}, 1000);
  }
  
}

Section.prototype.start = function() {
  this.tweens.forEach(function(t) { t.start(); });
};

