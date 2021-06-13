import * as THREE from "../threejs/three.module.js";

/*
* builds the scenes that appear in the road
* */
export class RoadSection {

    constructor() {
        this._Initialize();
    }

    _Initialize() {
        this._BuildSection();
    }

    _BuildSection(){
        const geomery = new THREE.BoxGeometry(20, 2, 220);
        const material = new THREE.MeshBasicMaterial();
        this._section = new THREE.Mesh(geomery, material);
    }

    get section() {
        return this._section;
    }

    animate(color){
        this._section.material.color = color;
    }
}
