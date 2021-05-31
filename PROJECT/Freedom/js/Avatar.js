import {FBXLoader} from "../threejs/FBXLoader.js";
import * as THREE from "../threejs/three.module.js";

/*
* builds and init all functionality related to the avatar (player)
* */
export class Avatar{
    constructor() {
        this._Initialize();
    }

    _Initialize(){
        this._InitVariables();
        //loads the avatar asynchronously and then loads all needed animations, this is made possible through the usage of promises
        this._LoadAvatar().then(() => this._LoadAvatarAnimations());
    }

    _InitVariables(){
        this._fbxLoader = new FBXLoader(); //inits the fbx loader which loads up the 3D model(models/avatar.fbx) and animations (animations/*.fbx)
        this._avatar = new THREE.Group();
        this._loaded = false;
        this._keyState = {};
    }

    _LoadAvatar(){//asynchronously loads the 3d model using promise and the fbxLoader
        return new Promise(resolve => {
            this._LoadFbxModel('models/avatar.fbx').then(
                avatar => {
                    this._animMixer = new THREE.AnimationMixer(avatar);

                    avatar.traverse(child => {
                        if (child.isMesh){//set the character to cast animations
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    //add the object to a group that is used to animate the character
                    this._avatar.add(avatar);

                    //sends a response that the function is done with its work
                    resolve();
                }
            );
        });
    }

    //loads up all the animations the character can make
    _LoadAvatarAnimations(){
        this._LoadFbxModel('animations/anim_idle.fbx').then(anim => {
            this._animIdle = this._animMixer.clipAction(anim.animations[0]);
            //this._animIdle.play();
        });

        this._LoadFbxModel('animations/anim_running.fbx').then(anim => {
            this._loaded = true;//used to check if the running animation is loaded
            this._animRunning = this._animMixer.clipAction(anim.animations[0]);
            this._animRunning.play();
        });

        this._LoadFbxModel('animations/anim_flying.fbx').then(anim => {
            this._animFlying = this._animMixer.clipAction(anim.animations[0]);
        });
    }

    /*
    * responsible for loading fbx models
    * */
    _LoadFbxModel(path){
        return new Promise(resolve => {
            this._fbxLoader.load(path, obj => resolve(obj));
        });
    }

    /*
    * retrieves the loaded character
    * */
    get getAvatar(){
        return new Promise(resolve => {
            const avatarCheckInterval = setInterval(() => {
                if (this._loaded){
                    clearInterval(avatarCheckInterval);
                    //starts the game since the model and animations have been loaded
                    window.hideGuis();
                    window.gameIsPlaying = true;
                    resolve(this._avatar);
                }
            }, 300);
        });
    }

    //responsible for keeping track of which button has been pressed or still being pressed
    mapKey(code, state){
        this._keyState[code] = state;
    }

    /*
    * animates the characters animation
    * animates the characters position according to which key has been pressed
    * */
    animate(time, delta) {
        if (this._animMixer) this._animMixer.update(delta);

        if (this._keyState["KeyA"] && this._avatar.position.x <= 905) this._avatar.position.x += 20;
        if (this._keyState["KeyD"] && this._avatar.position.x >= -905) this._avatar.position.x -= 20;

    }
}
