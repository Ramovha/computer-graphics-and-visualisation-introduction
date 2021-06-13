import * as THREE from "../threejs/three.module.js";
import {GameWorld} from "./GameWorld.js";
import Stats from "./stats.module.js";
import {SceneCleanerModule} from "../threejs/scene.cleaner.module.js";

export class SceneManager{

    constructor() {
        this._Initialize();
    }

    _Initialize(){
        this._InitDomElements();
        this._InitStatsIndicator();
        this._InitAudio();
        this._InitScene();
        this._InitCleaner();
        this._InitCamera();
        this._InitRenderers();
        this._InitWorld();
        this._InitLights();
        this._InitEventListeners();
    }

    _InitAudio(){
        //initialize global audio that will be played everytime the player passes through a gate
        window._gatePassedAudio = new Audio('audio/gate_passed.mp3');
        window._bulletFired = new Audio('audio/bullet_fired.mp3');
        window.bg_music = new Audio('audio/bg_music.mp3');
        window.bg_music.loop = true;

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
    * inits the scene cleaner class provided by three.js
    * */
    _InitCleaner(){
        this._sceneCleaner = new SceneCleanerModule();
    }

    /*
    * creates the game world and adds it into the scene
    * */
    _InitWorld(){
        window._gameWorld = new GameWorld();
        window._scene.add(window._gameWorld.gameWorld);
    }

    /*
    * tells game world which stage to build
    * */
    BuildStage(stage){
        //clean scene in case the scene was already built
        this._CleanScene();
        this._InitWorld();
        window._gameWorld.buildStage(stage);
    }

    /*
    * clean scene
    * */
    _CleanScene(){
        this._sceneCleaner.cleanScene(window._gameWorld.gameWorld);
        window._scene.remove(window._gameWorld.gameWorld);
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

        window._pipvCamera = new THREE.PerspectiveCamera(75, this._pipvContainer.clientWidth/this._pipvContainer.clientHeight, 0.1, 5000);
        window._pipvCamera.position.set(0, 200, 500);
        window._pipvCamera.lookAt(0, 200, 0);
    }

    _InitRenderers(){
        window._mainRenderer = new THREE.WebGLRenderer({antialias: true});

        window._mainRenderer.setPixelRatio(window.devicePixelRatio);
        window._mainRenderer.shadowMap.enabled = true;
        window._mainRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        window._mainRenderer.setSize(window.innerWidth, window.innerHeight);
        window._mainRenderer.setAnimationLoop( this._MainAnimate );
        document.body.appendChild(window._mainRenderer.domElement);

        window._pipvRenderer = new THREE.WebGLRenderer({antialias: true}); //picture in picture view
        window._pipvRenderer.setPixelRatio(window.devicePixelRatio);
        window._pipvRenderer.setSize(this._pipvContainer.clientWidth, this._pipvContainer.clientHeight);
        window._pipvRenderer.setAnimationLoop( this._PipvAnimate );
        this._pipvContainer.appendChild(window._pipvRenderer.domElement);
    }

    _MainAnimate(time) {
        if (window._gameWorld) //if game world has been initialized
            window._gameWorld.animate(time);
        if (window._stats) //if the stats has been loaded
            window._stats.begin();

        window._mainRenderer.render(window._scene, window._mainCamera);

        if (window._stats){
            window._stats.end();
            window._stats.update();
        }

    }

    _PipvAnimate(){
        window._pipvRenderer.render(window._scene, window._pipvCamera);
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
    }

    /*
    * initializes doc elements that will be used
    * */
    _InitDomElements(){
        this._pipvContainer = document.getElementById("pipv");
        window._levelIndicator = document.getElementById("levelIndicator");
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

    /*
    * inits the fps(frames per second) tracker that is placed on the top left corner of the screen
    * */
    _InitStatsIndicator(){
        window._stats = new Stats();
        document.body.appendChild(window._stats.dom);
    }

}
