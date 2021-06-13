import * as THREE from "../threejs/three.module.js";
import {PlaneGeometry, TextureLoader} from "../threejs/three.module.js";
import {Avatar} from "./Avatar.js";
import {SceneHandler} from "./SceneHandler.js";

/*
* builds the whole world
* */
export class GameWorld{

    constructor() {
        this._Initialize();
    }

    _Initialize(){
        this._InitVars();
        this._InitGround();
    }

    /*
    * returns the built world
    * */
    get gameWorld(){
        return this._gameWorld;
    }

    _InitVars(){
        this._gameWorld = new THREE.Group();
        this._clock = new THREE.Clock();
        this._avatar = new Avatar();
        this._sideLines = null; //lines that appear on the side of the road, made global to be animated
        this._colors = [ //a list of colors that the scene constantly changes through by lerping from one color to the next
            new THREE.Color(0x005975),
            new THREE.Color(0x35B22D),
            new THREE.Color(0xff0000),
            new THREE.Color(0xFF0040),
            new THREE.Color(0x0000ff),
            new THREE.Color(0xA9DCD6),
            new THREE.Color(0x00ff00),
            new THREE.Color(0x80d033)
        ];

        /*
        * the scene contains two lerping colors
        * the starting position of each colors is defined below
        * */
        this._lerp0Start = Math.floor((Math.random() * this._colors.length));
        this._lerp0End = this._lerp0Start + 1 === this._colors.length ? 0 : this._lerp0Start + 1;
        this._lerp1Start = this._lerp0End;
        this._lerp1End = this._lerp0Start;
    }

    /*
    * builds the scenes dark ground
    * */
    _InitGround(){
        const texture = new TextureLoader().load('texture/download.jpg');
        const geometry = new PlaneGeometry(50000, 50000);
        const material = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});
        this._ground = new THREE.Mesh(geometry, material);

        this._ground.rotation.x = Math.PI/2;
        this._ground.position.y -= 0.4;
        this._ground.position.z += 22000;//since objects are added at the center, we need to move them a bit forward
        this._ground.receiveShadow = true;
        this._ground.castShadow = true;

        this._gameWorld.add(this._ground);
    }

    /*
    * builds the stage, takes in stage param which tells it which stage to build
    * */
    buildStage(stage){
        this._InitAvatar(stage);
    }

    /*
    * responsible for calling the avatar class to load the game avatar
    * and then builds up the stage, we do this because the avatar model takes
    * time to load, so we load it asynchronously and once the model is fully
    * loaded, we then
    * */
    _InitAvatar(stage){
        this._avatar.getAvatar.then(avatar => {
            this._gameWorld.add(avatar);
            this._avatar3DObj = avatar;
            this._LoadCharacterSpotLight();
            this._BuildScene(stage);
        });
    }

    //responsible for keeping track of key press
    mapKey(code, state){
        this._avatar.mapKey(code, state);
        if (state && code === 'KeyC'){
            this._avatar.changeCamera();
        }
        if (state && code === 'Escape'){
            window.pauseGame();
        }
    }

    //responsible for building the scene
    _BuildScene(stage){
        if (!window.bg_music.isPlaying)window.bg_music.play().then();
        //the sceneHandler uses index face set to build the scene
        this._sceneHandler = new SceneHandler(stage, this._gameWorld, this._avatar);
    }

    _LoadCharacterSpotLight(){
        this._pathSpotLight = new THREE.SpotLight( 0xffffff );
        this._pathSpotLight.castShadow = true;
        this._pathSpotLight.intensity = 2;

        this._pathSpotLight.position.set(5.230087329141483, 800, 704.1686633447122);

        this._pathSpotLight.shadow.mapSize.width = 4096;
        this._pathSpotLight.shadow.mapSize.height = 4096;

        this._pathSpotLight.shadow.camera.near = 500;
        this._pathSpotLight.shadow.camera.far = 4000;
        this._pathSpotLight.shadow.camera.fov = 75;

        this._gameWorld.add( this._pathSpotLight );
    }

    animate(time){
        if (!window.gameIsPlaying) return;

        const delta = this._clock.getDelta();
        const lerped0Color = this.lerp0Colors(time);
        const lerped1Color = this.lerp1Colors(time);

        this._avatar.animate(time, delta);


        if (this._avatar3DObj){
            this._avatar3DObj.position.z += 30;
            this._pathSpotLight.position.z += 30;
            window._pipvCamera.position.z = this._avatar3DObj.position.z + 500;
            //move ground as well, this prevents redrawing the ground
            this._ground.position.z += 30;
        }

        this._UpdatePathSpotLight(lerped1Color);

        if (this._sceneHandler){
            this._sceneHandler.animate(time, delta, lerped0Color, lerped1Color);
            this._sceneHandler.checkForCollision();
        }
    }

    _UpdatePathSpotLight(lerped1Color){
        if (this._pathSpotLight && this._avatar3DObj){ //if they are not null
            this._pathSpotLight.color = lerped1Color;
            this._pathSpotLight.position.x = this._avatar3DObj.position.x;
        }
    }

    /*
    * responsible for lerping between one color to the next
    * once the the second color has been reached, the color positions are then updated to lerp between the next set of colors
    * */
    lerp1Colors(time){
        const alpha = ((time/50) % 100)/100;
        if (alpha >= 0.98){ //next color has been reached, update the positions
            this._lerp1Start = this._lerp1End;
            this._lerp1End = this._lerp1End + 1 === this._colors.length ? 0 : this._lerp1End + 1;
        }

        const color = new THREE.Color();
        color.lerpColors(this._colors[this._lerp1Start], this._colors[this._lerp1End], alpha);
        return color;
    }

    lerp0Colors(time){
        const alpha = ((time/80) % 100)/100;
        if (alpha >= 0.98){
            this._lerp0Start = this._lerp0End;
            this._lerp0End = this._lerp0End + 1 === this._colors.length ? 0 : this._lerp0End + 1;
        }

        const color = new THREE.Color();
        color.lerpColors(this._colors[this._lerp0Start], this._colors[this._lerp0End], alpha);
        return color;
    }


}
