// our javascript will go here

// setting up the scene, camera, and renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//updating a viewport of resize
window.addEventListener("resize", function()
    {
        let width = window.innerWidth;
        let height = window.innerHeight;
        renderer.setSize(width, height);

        camera.aspect = width/height;
        camera.updateProjectionMatrix();
    }
);

    // creating a ball
    let geometry = new THREE.SphereGeometry(5, 10, 10);

    // create a material colour
    let material = new THREE.MeshBasicMaterial({color: 0xff000f});
    let sphere = new THREE.Mesh(geometry, material);
    scene.add( sphere);
    camera.position.z =20;

// implementing control system
controls = new THREE.OrbitControls(camera, renderer.domElement);

let update= function(){
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.005;
}

let render = function(){

    renderer.render(scene, camera);
};

// run game loop(update, render, repeat)
let GameLoop = function () {
    requestAnimationFrame(GameLoop);
    update();
    render();

};
GameLoop();

