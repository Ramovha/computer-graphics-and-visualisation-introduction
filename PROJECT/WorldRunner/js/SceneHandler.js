import {StageDescriber} from "./StageDescriber.js";
import {Gate} from "./Gate.js";
import {RoadSection} from "./RoadSection.js";
import * as THREE from "../threejs/three.module.js";
import {BlockerCube} from "./BlockerCube.js";
import {DragControls} from "../threejs/DragControls.js";
import {Bullet} from "./Bullet.js";

/*
* handles scene creation and collision detection
* */
export class SceneHandler {
    static ROAD_SECTION = -2;

    constructor(stage, world, avatarManager) {
        this._Initialize(stage, world, avatarManager);
    }

    _Initialize(stage, world, avatarManager){
        this._InitVars(world, avatarManager);
        this._InitStage(stage);
        this._InitDragControls();
        this._InitBullets();
    }

    _InitVars(world, avatarManager){
        //responsible for containing objects that are in the scene, useful for collision detection
        this._animatables = [];
        this._world = world;
        this._positionZ = 1000;
        this._avatarManager = avatarManager;
        this._dragableObjects = [];
    }

    /* responsible for building the stage
    * takes in a stage (tells us which stage is being built since different stages have different configs)
    * stageDesc, which describes how a stage is suppose to look like
    * world, the actual game world
    * */
    _InitStage(stage){
        window._currentScene = stage;
        window._levelIndicator.innerText = `Level ${window._currentScene}`;

        switch (stage){
            case StageDescriber.Stages.ONE:
                this._BuildStage(StageDescriber.stage1());
                this._BuildStage(StageDescriber.stage2());
                this._BuildStage(StageDescriber.stage3());
                this._BuildStage(StageDescriber.stage4());
                break;

            case StageDescriber.Stages.TWO:
                this._BuildStage(StageDescriber.stage2());
                this._BuildStage(StageDescriber.stage3());
                this._BuildStage(StageDescriber.stage4());
                break;

            case StageDescriber.Stages.THREE:
                this._BuildStage(StageDescriber.stage3());
                this._BuildStage(StageDescriber.stage4());
                break;

            case StageDescriber.Stages.FOUR:
                this._BuildStage(StageDescriber.stage4());
                break;
        }

    }

    _BuildStage(stageDesc){
        this._InitRoad();

        for (let i = 0; i < stageDesc.length; i++){//iterates through a stage description described in the StageDescriber
            const sectionDesc = stageDesc[i];//iterates through the array that describes a row
            let positionX = -500;

            for (let j = 0; j < sectionDesc.length; j++){
                const desc = sectionDesc[j];//desc tells us which object it is, lockedGate, Gate

                this._BuildRoadSectionLines(positionX);

                switch (desc){//check which object it is and build it accordingly

                    case StageDescriber.objectsDesc.GATE: this._BuildGate(desc, positionX); break;
                    case StageDescriber.objectsDesc.END_POINT: this._BuildStageEndPoint(desc, positionX); break;
                    case StageDescriber.objectsDesc.BLOCK_GATE: this._BuildBlockedGate(desc, positionX); break;
                    case StageDescriber.objectsDesc.FLOATING_GATE: this._BuildGate(desc, positionX, 600); break;
                    case StageDescriber.objectsDesc.FloatING_BLOCK_GATE: this._BuildBlockedGate(desc, positionX, 600); break;
                    case StageDescriber.objectsDesc.FLOATING_END_POINT: this._BuildStageEndPoint(desc, positionX, 600); break;
                }

                positionX += 500;
            }

            this._positionZ += 1500;
        }

    }

    _InitRayCaster(){//init ray casting https://threejs.org/docs/index.html?q=ray#api/en/core/Raycaster
        this._raycaster = new THREE.Raycaster();
        this._raycaster.near = 0;
        this._raycaster.far = 2000; //set max distance of ray
        this._mouse = new THREE.Vector2();

        window.addEventListener('mousemove', (event) => {
            this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this._mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        });
    }

    _InitDragControls(){
        new DragControls( this._dragableObjects, window._mainCamera, window._mainRenderer.domElement );
    }

    //responsible for animating the scene
    animate(time, delta, color0, color1){
        for (let i = 0; i < this._animatables.length; i++){
            const objectData = this._animatables[i];

            switch (objectData[0]){
                case StageDescriber.objectsDesc.GATE:
                    objectData[1].animate(color1, delta);
                    break;

                case SceneHandler.ROAD_SECTION:
                    objectData[1].animate(color1);
                    break;

                case StageDescriber.objectsDesc.BLOCK_GATE:
                    objectData[1].animate(color0);
                    break;

                case StageDescriber.objectsDesc.BULLET:
                    objectData[1].animate(color1, time);
                    break;
            }
        }

        if (window._currentScene !== StageDescriber.Stages.ONE && this._shootBulletsInterval == null){
            this._StartBulletInterval();
        }
    }

    checkForCollision(){
        const character = this._avatarManager.Avatar;
        const characterZPos = character.position.z;
        const characterBound = new THREE.Box3().setFromObject(character);

        for (let i = 0; i < this._animatables.length; i++){
            const objectInStage = this._animatables[i];

            const objectType = objectInStage[0]; //tells us which object it is
            const objectManagerClass = objectInStage[1];
            const actualObjectInScene = objectInStage[2];

            if (this._IsAGate(objectType)){
                const collisionState = objectInStage[3];

                if (!collisionState){//character hasn't collided with object
                    //check for collision
                    const objectBounds = new THREE.Box3().setFromObject(actualObjectInScene);
                    if (characterBound.intersectsBox(objectBounds)){

                        objectManagerClass.gatePassed();
                        objectInStage[3] = true;

                        if (objectType === StageDescriber.objectsDesc.END_POINT || objectType === StageDescriber.objectsDesc.FLOATING_END_POINT){
                            this._CurrentStageComplete();
                        }

                        continue;
                    }

                    //check if user has passed object or not

                    if (characterZPos > actualObjectInScene.position.z){
                        window.gatePassed();
                    }
                }
            }

            if (objectType === StageDescriber.objectsDesc.BLOCK_GATE || objectType === StageDescriber.objectsDesc.BULLET){
                const objectBounds = new THREE.Box3().setFromObject(actualObjectInScene);
                if (characterBound.intersectsBox(objectBounds)){
                    window.avatarDied();
                }
            }
        }
    }

    /*
    * checks if object is a gate
    * */
    _IsAGate(objectType){
        return objectType === StageDescriber.objectsDesc.GATE
            || objectType === StageDescriber.objectsDesc.END_POINT
            || objectType === StageDescriber.objectsDesc.FLOATING_GATE
            || objectType === StageDescriber.objectsDesc.FLOATING_END_POINT;
    }

    //switch the stages
    _CurrentStageComplete(){
        switch (window._currentScene){
            case StageDescriber.Stages.ONE:
                window._currentScene = StageDescriber.Stages.TWO;
                break;

            case StageDescriber.Stages.TWO:
                window._currentScene = StageDescriber.Stages.THREE;
                break;

            case StageDescriber.Stages.THREE:
                window._currentScene = StageDescriber.Stages.FOUR;
                break;

            case StageDescriber.Stages.FOUR:
                window.gameComplete();
                break;
        }
        window._levelIndicator.innerText = `Level ${window._currentScene}`;
    }

    //builds the sides of the roads
    _InitRoad(){
        const bg = new THREE.BoxGeometry( 60, 5, 50000 );
        const edges = new THREE.EdgesGeometry( bg );
        const sideLines = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff, lineWidth: 2 } ) );

        sideLines.position.x = -1000;
        sideLines.position.z = this._positionZ + 22000; //since objects are added at the center, we need to move them a bit forward
        const otherLine = sideLines.clone();
        otherLine.position.x = 1000;

        this._world.add(sideLines);
        this._world.add(otherLine);
    }

    /*
    * builds the ring that avatar needs to pass through
    * */
    _BuildGate(desc, positionX, positionY = 0){
        const gate = new Gate();
        const actualGate = gate.OpenGate;
        actualGate.position.x = positionX;
        actualGate.position.y = positionY;
        actualGate.position.z = this._positionZ;

        //similar to below
        this._animatables.push([desc, gate, actualGate, false]);
        this._world.add(actualGate);
    }
    /*
    * builds the lines that separate the road
    * */
    _BuildRoadSectionLines(positionX){
        //road section is added by default on stage 1
        const roadSection = new RoadSection();
        const roadSecObj = roadSection.section;
        roadSecObj.position.z = this._positionZ;
        roadSecObj.position.x = positionX;
        this._world.add(roadSecObj);

        this._animatables.push([SceneHandler.ROAD_SECTION, roadSection, roadSecObj]);
    }

    /*
    * builds the endpoint
    * */
    _BuildStageEndPoint(desc, positionX, positionY = 0){
        const endPoint = new Gate();
        const actualEndPoint = endPoint.LockedGate;
        actualEndPoint.position.x = positionX;
        actualEndPoint.position.y = positionY;
        actualEndPoint.position.z = this._positionZ + 4000;


        //[description of object, the class responsible for that object, collisionState, lockedState]
        /*
        * desc -> what kind of object is it, gate, locked gate, road section
        * gate -> class responsible for building the gate, useful for when we want to animate the colors
        * actualGate -> useful for collision detection
        * collisionState -> keeps track of whether avatar has collided with the object or not
        * */
        this._animatables.push([desc, endPoint, actualEndPoint, false]);
        this._world.add(actualEndPoint);
    }

    /*
    * builds the blocked gate
    * */
    _BuildBlockedGate(desc, positionX, positionY = 0){
        this._BuildGate(StageDescriber.objectsDesc.GATE, positionX, positionY);
        const blockerCube = new BlockerCube();
        const actualCube = blockerCube.cube;
        actualCube.position.x = positionX;
        actualCube.position.y = positionY;
        actualCube.position.z = this._positionZ;

        this._animatables.push([desc, blockerCube, actualCube]);
        this._world.add(actualCube);
        this._dragableObjects.push(actualCube);
    }

    /*
    * inits bullets that appear from behind the avatar and the avatar has to doge them
    * */
    _InitBullets(){
        //in case if the bullet interval was already declared
        if (this._shootBulletsInterval){
            clearInterval(this._shootBulletsInterval);
        }
        this._shootBulletsInterval = null;
    }

    /*
    * starts to bullet interval
    * this interval will generate a bullet at random x position behind the avatar
    * and shoots it forward
    * */
    _StartBulletInterval(){
        this._shootBulletsInterval = setInterval(() => {
            this._GenerateBullet();
        }, 5000);
    }

    _GenerateBullet(){
        if (window.gameIsPlaying && window._currentScene !== StageDescriber.Stages.ONE){
            const xPosList = [-500, 0, 500];
            const randomXPos = xPosList[Math.floor(Math.random() * xPosList.length)];
            const bullet = new Bullet();
            const actualBullet = bullet.bullet;
            const indicator = bullet.indicator;

            actualBullet.position.z = this._avatarManager.Avatar.position.z - 2000;
            actualBullet.position.x = randomXPos;
            indicator.position.z = this._avatarManager.Avatar.position.z - 500;
            indicator.position.x = randomXPos;

            this._world.add(actualBullet);
            this._world.add(indicator);

            this._animatables.push([StageDescriber.objectsDesc.BULLET, bullet, bullet.bullet]);

            window._bulletFired.play().then();
        }
    }
}
