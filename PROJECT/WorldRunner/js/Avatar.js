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
        this._InitPhysicsConstants();
    }

    _InitVariables(){
        this._fbxLoader = new FBXLoader(); //inits the fbx loader which loads up the 3D model(models/avatar.fbx) and animations (animations/*.fbx)
        this._avatar = new THREE.Group();
        this._loaded = false;
        this._keyState = {};
        this._fps = false;
        this._applyGravity = false; //used to apply gravity when character is flying
    }

    _InitPhysicsConstants(){
        //for gravity effect
        this._velocity = new THREE.Vector3(0, 40, 0);
        this._gravity = new THREE.Vector3(0, -40, 0);
        this._currTime = performance.now();
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
        this._LoadFbxModel('animations/anim_running.fbx').then(anim => {
            this._animRunning = this._animMixer.clipAction(anim.animations[0]);
            this._animRunning.play();
            this._loaded = true;//used to check if the running animation is loaded
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
                    //wait 4 seconds then start the game since the model and animations have been loaded
                    setTimeout(() => {
                        window.hideGuis();
                        window.gameIsPlaying = true;
                        resolve(this._avatar);
                    }, 4000);
                }
            }, 300);
        });
    }

    /*
    * return the actual the 3D
    * */
    get Avatar(){
        return this._avatar;
    }

    /*
    * Changes camera settings
    * */
    changeCamera(){
        this._fps = !this._fps;
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

        if (this._keyState["KeyW"]){
            this._applyGravity = true;

            this._avatar.position.y += 10;
            this._resetGravity(); //reset gravity

            if (!this._animFlying.isRunning()){
                this._setWeight( this._animFlying, 1 );
                this._animRunning.crossFadeTo(this._animFlying, 1, true);
            }
        }

        //apply gravity
        //this occurs when the avatar is flying
        if (this._applyGravity){
            this._velocity.y += this._gravity.y * 0.2;
            this._avatar.position.y += this._velocity.y * 0.2;

            if (this._avatar.position.y <= 0){//avatar is back on the ground, enable running animation
                this._applyGravity = false;
                this._resetGravity();
                this._avatar.position.y = 0;
                this._setWeight( this._animRunning, 1 );
                this._animFlying.crossFadeTo(this._animRunning, 1, true);
            }
        }

        window._mainCamera.position.x = this._avatar.position.x;

        //set camera position based on fps setting
        if (this._fps){
            window._mainCamera.position.z = this._avatar.position.z + 80;
            window._mainCamera.position.y = this._avatar.position.y + 90;
            //this allows the camera to look straight in the scene
            window._mainCamera.lookAt(this._avatar.position.x, this._avatar.position.y  + 90, this._avatar.position.z + 240);
        }
        else{
            //sets the normal position of camera
            window._mainCamera.position.z = this._avatar.position.z -704.1686633447122;
            window._mainCamera.position.y = this._avatar.position.y + 327.7610116273724;
            //this allows the camera to look straight in the scene
            window._mainCamera.lookAt(this._avatar.position.x, this._avatar.position.y  + 60, this._avatar.position.z + 100);
        }
    }

    // This function is needed, since animationAction.crossFadeTo() disables its start action and sets
    // the start action's timeScale to ((start animation's duration) / (end animation's duration))
    // source: https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_blending.html
    _setWeight( action, weight ) {
        action.enabled = true;
        action.setEffectiveTimeScale( 1 );
        action.setEffectiveWeight( weight );
        action.time = 0;
        action.play();
    }

    _resetGravity(){
        this._velocity.y = 40;
    }
}
