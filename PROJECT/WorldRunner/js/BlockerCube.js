import * as THREE from "../threejs/three.module.js";

/*
* creates the cube that blocks the users path
* */
export class BlockerCube{

    constructor() {
        this._Initialize();
    }

    _Initialize() {
        this._BuildCube();
    }

    _BuildCube(){
        //builds the actual cube
        const geomery = new THREE.BoxGeometry(400, 400, 200);
        const material = new THREE.MeshBasicMaterial();
        this._section = new THREE.Mesh(geomery, material);
    }

    //gets the actual cube
    get cube() {
        return this._section;
    }

    animate(color){
        this._section.material.color = color;
    }

}
