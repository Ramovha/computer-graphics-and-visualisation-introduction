import * as THREE from "../threejs/three.module.js";
import * as CONTROL from '../threejs/OrbitControls.js';
import {GameWorld} from "./GameWorld.js";

export class SceneManager{

    constructor() {
        this._Initialize();
    }

    _Initialize(){
        this._InitAudio();
        this._InitScene();
        this._InitCamera();
        this._InitRenderers();
        this._InitWorld();
        this._InitLights();
        this._InitEventListeners();
        this._InitControls();
    }

    _InitAudio(){
        //initialize global audio that will be played everytime the player passes through a gate
        window._gatePassedAudio = new Audio('audio/gate_passed.mp3');
    }

    /*
    * responsible for building the base scene
    * */
    _InitScene(){
        window._scene = new THREE.Scene();

        /*
        * creates a skybox
        * */
        const loader = new THREE.CubeTextureLoader();
        window._scene.background = loader.load([
            "skybox/nightsky_ft.png",
            "skybox/nightsky_bk.png",
            "skybox/nightsky_up.png",
            "skybox/nightsky_dn.png",
            "skybox/nightsky_rt.png",
            "skybox/nightsky_lf.png"
        ]);

        /*
        * initializes the the fog in the scene
        * */
        const color = 0x000000;
        const near = 0.1;
        const far = 4000;
        window._scene.fog = new THREE.Fog(color, near, far);


    }

    /*
    * creates the game world and adds it into the scene
    * */
    _InitWorld(){
        window._gameWorld = new GameWorld();
        window._scene.add(window._gameWorld.gameWorld);
    }

    /*
    * creates and positions the camera
    * */
    _InitCamera(){
        window._mainCamera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 4000);
        /* the position of the scene was retrieved through trial
        * and using orbit controls to position the camera in the
        * scene and logging the position of the camera
        * */
        window._mainCamera.position.set(5.230087329141483, 327.7610116273724, -704.1686633447122);
        window._mainCamera.lookAt(0, 60, 100);
    }

    _InitRenderers(){
        window._mainRenderer = new THREE.WebGLRenderer({antialias: true});

        window._mainRenderer.setPixelRatio(window.devicePixelRatio);
        window._mainRenderer.shadowMap.enabled = true;
        window._mainRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        window._mainRenderer.setSize(window.innerWidth, window.innerHeight);
        window._mainRenderer.setAnimationLoop( this._MainAnimate );

        document.body.appendChild(window._mainRenderer.domElement);
    }

    _MainAnimate(time) {
        if (window._gameWorld) //if game world has been initialized
            window._gameWorld.animate(time);
        window._mainRenderer.render(window._scene, window._mainCamera);
    }

    //add in all the required lights and config their shadows
    _InitLights(){
        this._InitHemisphere();
        this._InitDirectionalLight();
        this._InitDirectionalLightShadows();
    }

    _InitHemisphere(){
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemisphereLight.position.set(0, 200, 0);
        window._scene.add(hemisphereLight);
    }

    _InitDirectionalLight(){
        this._directionalLight = new THREE.DirectionalLight(0xffffff);
        this._directionalLight.position.set(0, 1200, 0);
        window._scene.add(this._directionalLight);
    }

    //configs the quality(mapSize) and boundaries of where the shadows can appear and not appear(shadow.camera.direction)
    _InitDirectionalLightShadows(){
        const shadowBounds = 2000;
        this._directionalLight.castShadow = true;
        this._directionalLight.shadow.mapSize.width = 4096;
        this._directionalLight.shadow.mapSize.height = 4096;
        this._directionalLight.shadow.camera.top = shadowBounds;
        this._directionalLight.shadow.camera.bottom = -shadowBounds;
        this._directionalLight.shadow.camera.left = -shadowBounds;
        this._directionalLight.shadow.camera.right = shadowBounds;
        this._directionalLight.shadow.camera.near = 0.1;
        this._directionalLight.shadow.camera.far = 2000;

        const helper = new THREE.CameraHelper( this._directionalLight.shadow.camera );
        window._scene.add( helper );
    }

    _InitEventListeners(){
        //listen for when page resizes and scales the scene properly
        window.addEventListener('resize', () => {
            window._mainCamera.aspect = window.innerWidth / window.innerHeight;

            window._mainRenderer.setSize(window.innerWidth, window.innerHeight);
           window._mainCamera.updateProjectionMatrix();
        });

        //listen for when a user presses a key
        window.addEventListener('keydown', e => window._gameWorld.mapKey(e.code, true));
        window.addEventListener('keyup', e => window._gameWorld.mapKey(e.code, false));
    }

    _InitControls(){
        //used for debugging purposes
        // window._controls = new CONTROL.OrbitControls(window._mainCamera, window._mainRenderer.domElement);
    }
}
