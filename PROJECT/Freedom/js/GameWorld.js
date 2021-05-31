import * as THREE from "../threejs/three.module.js";
import {PlaneGeometry, TextureLoader} from "../threejs/three.module.js";
import {Avatar} from "./Avatar.js";
import {SceneHandler} from "./SceneHandler.js";
import {StageDescriber} from "./StageDescriber.js";

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
        this._InitRoad();
        this._InitAvatar();
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
        const ground = new THREE.Mesh(geometry, material);

        ground.rotation.x = Math.PI/2;
        ground.position.y -= 0.4;
        ground.position.z += 22000;//since objects are added at the center, we need to move them a bit forward
        ground.receiveShadow = true;
        ground.castShadow = true;

        this._gameWorld.add(ground);
    }

    //builds the sides of the roads
    _InitRoad(){
        const bg = new THREE.BoxGeometry( 60, 5, 50000 );
        const edges = new THREE.EdgesGeometry( bg );
        this._sideLines = new THREE.LineSegments( edges,
            new THREE.LineBasicMaterial( { color: 0xffffff, lineWidth: 2 } ) );

        this._sideLines.position.x = -1000;
        this._sideLines.position.z += 22000; //since objects are added at the center, we need to move them a bit forward
        const otherLine = this._sideLines.clone();
        otherLine.position.x = 1000;

        this._gameWorld.add(this._sideLines);
        this._gameWorld.add(otherLine);
    }

    /*
    * responsible for calling the avatar class to load the game avatar
    * */
    _InitAvatar(){
        this._avatar.getAvatar.then(avatar => {
            this._gameWorld.add(avatar);
            this._avatar3DObj = avatar;
            this._LoadCharacterSpotLight();
            this._BuildScene();
        });
    }

    //responsible for keeping track of key press
    mapKey(code, state){
        this._avatar.mapKey(code, state);
    }

    //responsible for building the scene
    _BuildScene(){
        const audio = new Audio('audio/bg_music.mp3');
        audio.play().then();
        //the sceneHandler uses index face set to build the scene
        this._sceneHandler = new SceneHandler(StageDescriber.Stages.ONE, StageDescriber.stage1(), this._gameWorld);
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
        this._sideLines.material.color = lerped0Color;

        if (this._avatar3DObj){
            this._avatar3DObj.position.z += 30;
            window._mainCamera.position.z += 30;
            this._pathSpotLight.position.z += 30;
        }


        //this._gate.animate(lerped1Color, delta);
        this._UpdateCameraPosRelativeToAvatar();
        this._UpdatePathSpotLight(lerped1Color);

        if (this._sceneHandler){
            this._sceneHandler.animate(time, delta, lerped1Color);
            this._sceneHandler.checkForCollision(this._avatar3DObj);
        }
    }

    _UpdatePathSpotLight(lerped1Color){
        if (this._pathSpotLight && this._avatar3DObj){ //if they are not null
            this._pathSpotLight.color = lerped1Color;
            this._pathSpotLight.position.x = this._avatar3DObj.position.x;

        }
    }

    _UpdateCameraPosRelativeToAvatar(){
        if (this._avatar3DObj){//if not null
            window._mainCamera.position.x = this._avatar3DObj.position.x;
            window._mainCamera.lookAt(this._avatar3DObj.position.x, 60, this._avatar3DObj.position.z + 100);
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
