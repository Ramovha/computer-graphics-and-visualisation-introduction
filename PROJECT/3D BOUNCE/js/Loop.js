// creating a ball
let g = new THREE.SphereGeometry(5, 10, 10);

// create a material colour
let ma = new THREE.MeshBasicMaterial({color: 0x0000ff});
let spher = new THREE.Mesh(g, ma);
spher.position.z += 3;
scene.add( spher);