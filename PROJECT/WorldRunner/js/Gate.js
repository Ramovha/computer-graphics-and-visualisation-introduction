import * as THREE from "../threejs/three.module.js";
import {WaterRefractionShader} from "../threejs/WaterRefractionShader.js";
import {PlaneGeometry} from "../threejs/three.module.js";
import {Refractor} from "../threejs/Refractor.js";

/*
* builds gates character is suppose to pass through
* */
export class Gate{

    constructor() {
        this._Initialize();
    }

    _Initialize(){
        this._InitVars();
    }

    /*
    * the class builds two kinds of gates, normal and locked gate
    * normal gates usually appear through out the scene
    * locked gates mostly appear at the end of each stage
    * */
    _InitVars(){
        this._gate = new THREE.Group();
        this._lockedGate = new THREE.Group();
    }

    /*
    * responsible for building the normal gate
    * */
    _InitGate(){
        this._BuildBaseGate();
        this._gate.add(this._baseGate);
    }

    /*
    * responsible for building the locked gate
    * */
    _InitLockedGate(){
        this._BuildBaseGate();
        this._baseGate.name = "lock";
        this._lockedGate.add(this._baseGate);
        //builds and positions the lock that appears with the game
        this._lock = this._GenerateLock();
        this._lock.position.y = 80;
        this._refractor = this._GenerateRefractivePlane();
        this._refractor.position.y = 400;

        this._lockedGate.add(this._lock);
        this._lockedGate.add(this._refractor);
    }

    /*
    * responsible for playing an audio everytime the user passes a gate
    * */
    gatePassed(){
        if (window._gatePassedAudio.isPlaying){
            window._gatePassedAudio.pause();
            window._gatePassedAudio.currentTime = 0;
        }

        window._gatePassedAudio.play();
    }

    /*
    * builds the refractive plane that appears infront of the lock
    * this is done possible through the waterRefractionShader provided by Three.js
    * */
    _GenerateRefractivePlane(){
        const geometry = new PlaneGeometry(400, 800);
        const refractor = new Refractor(geometry, {
            color: 0x999999,
            textureWidth: 4096,
            textureHeight: 4096,
            shader: WaterRefractionShader
        });

        refractor.rotation.y = Math.PI;

        const refractiveMapping = new THREE.TextureLoader().load('threejs/waterdudv.jpg', () => {
            refractiveMapping.wrapS = refractiveMapping.wrapT = THREE.RepeatWrapping;
            refractor.material.uniforms['tDudv'].value = refractiveMapping;
        });

        return refractor;
    }

    /*
    * builds the lock object
    * */
    _GenerateLock(){
        const lock = new THREE.Group();
        const lockTop = this._GenerateTorus(0x00ff00, 0x00ff00);
        lockTop.position.y += 15;
        lock.add(lockTop);

        const geometry = new THREE.BoxGeometry( 50, 30, 10 );
        const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
        const cube = new THREE.Mesh( geometry, material );
        lock.add( cube );

        return lock;
    }

    /*
    * builds the basic gate,
    * this function is more of an assistant function
    * it is used in _InitGate and _InitLockedGate
    * */
    _BuildBaseGate(){
        this._baseGate = this._GenerateTorus();
        this._baseGate.scale.set(11, 11, 11);
    }

    /*
    * builds the actual ring
    * */
    _GenerateTorus(){
        const geometry = new THREE.TorusGeometry(19, 1.3, 30, 200);
        const material = new THREE.MeshLambertMaterial({color: 0x88d81f, flatShading: true});
        return new THREE.Mesh(geometry, material);
    }

    /*
    * retrieves the normal gate
    * */
    get OpenGate(){
        this._InitGate();
        return this._gate;
    }

    /*
    * retrieves the locked gate
    * */
    get LockedGate(){
        this._InitLockedGate();
        return this._lockedGate;
    }

    /*
    * responsible for animating the gate, e.g. changing gate colors
    * */
    animate(color, delta){
        this._baseGate.material.color = color;

        if (this._refractor) this._refractor.material.uniforms["time"].value += delta;
    }
}
