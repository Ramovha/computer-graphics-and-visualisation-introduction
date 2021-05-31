import {StageDescriber} from "./StageDescriber.js";
import {Gate} from "./Gate.js";
import {RoadSection} from "./RoadSection.js";
import * as THREE from "../threejs/three.module.js";

/*
* handles scene creation and collision detection
* */
export class SceneHandler {
    static ROAD_SECTION = -2;

    constructor(stage, stageDesc, world) {
        this._Initialize(stage, stageDesc, world);
    }

    _Initialize(stage, stageDesc, world){
        this._InitVars();
        this._InitStage(stage, stageDesc, world);
        this._InitRayCaster();
    }

    _InitVars(){
        //responsible for containing objects that are in the scene, useful for collision detection
        this._objectsInStage = [];
    }

    /* responsible for building the stage
    * takes in a stage (tells us which stage is being built since different stages have different configs)
    * stageDesc, which describes how a stage is suppose to look like
    * world, the actual game world
    * */
    _InitStage(stage, stageDesc, world){
        switch (stage){
            case StageDescriber.Stages.ONE:
                this._BuildStageOne(stageDesc, world);
                break;
        }
    }

    _BuildStageOne(stageDesc, world){
        let positionZ = 1000;//start z-pos

        for (let i = 0; i < stageDesc.length; i++){//iterates through a stage description described in the StageDescriber
            const sectionDesc = stageDesc[i];//iterates through the array that describes a row
            let positionX = -500;

            for (let j = 0; j < sectionDesc.length; j++){
                const desc = sectionDesc[j];//desc tells us which object it is, lockedGate, Gate

                //road section is added by default on stage 1
                const roadSection = new RoadSection();
                const roadSecObj = roadSection.section;
                roadSecObj.position.z = positionZ;
                roadSecObj.position.x = positionX;
                world.add(roadSecObj);

                this._objectsInStage.push([SceneHandler.ROAD_SECTION, roadSection, roadSecObj]);

                switch (desc){//check which object it is and build it accordingly

                    case StageDescriber.objectsDesc.GATE:
                        const gate = new Gate();
                        const actualGate = gate.OpenGate;
                        actualGate.position.z = positionZ;
                        actualGate.position.x = positionX;

                        //similar to below
                        this._objectsInStage.push([desc, gate, actualGate, false]);
                        world.add(actualGate);

                        break;

                    case StageDescriber.objectsDesc.END_POINT:
                        const endPoint = new Gate();
                        const actualEndPoint = endPoint.LockedGate;
                        actualEndPoint.position.z = positionZ + 4000;
                        actualEndPoint.position.x = positionX;

                        //[description of object, the class responsible for that object, collisionState, lockedState]
                        /*
                        * desc -> what kind of object is it, gate, locked gate, road section
                        * gate -> class responsible for building the gate, useful for when we want to animate the colors
                        * actualGate -> useful for collision detection
                        * collisionState -> keeps track of whether avatar has collided with the object or not
                        * lockedState -> keeps track of whether avatar has unlocked the gate or not
                        * */
                        this._objectsInStage.push([desc, endPoint, actualEndPoint, false, false]);
                        world.add(actualEndPoint);

                        break;
                }

                positionX += 500;
            }

            positionZ += 1500;
        }

    }

    _InitRayCaster(){//init ray casting https://threejs.org/docs/index.html?q=ray#api/en/core/Raycaster
        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2();

        window.addEventListener('mousemove', (event) => {
            this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this._mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        });

    }

    //responsible for animating the scene
    animate(time, delta, color){
        for (let i = 0; i < this._objectsInStage.length; i++){
            const objectData = this._objectsInStage[i];

            switch (objectData[0]){
                case StageDescriber.objectsDesc.GATE:
                    objectData[1].animate(color, delta);
                    break;

                case SceneHandler.ROAD_SECTION:
                    objectData[1].animate(color);
                    break;
            }
        }

        //checks for any ray hits
        if (this._raycaster){
            this._raycaster.setFromCamera(this._mouse, window._mainCamera);
            // calculate objects intersecting the picking ray
            const intersects = this._raycaster.intersectObjects( window._scene.children );
            this._CheckForGateIntersection(intersects);
        }
    }

    //checks if the ray managed to hit a gate
    _CheckForGateIntersection(intersections){
        for (let i = 0; i < intersections.length; i++){
            const obj = intersections[i].object;

            for (let j = 0; j < this._objectsInStage.length; j++) {
                const objectInStage = this._objectsInStage[j];

                if (this._objectsInStage[0] === StageDescriber.objectsDesc.END_POINT){
                    if (obj.position.equals(objectInStage[2].position)){
                        console.log("unlock");
                        objectInStage[1].unlock();
                        this._UnlockOtherGatesOnSamePos(objectInStage[2].position);
                        break;
                    }
                }
            }

        }
    }

    _UnlockOtherGatesOnSamePos(pos){
        for (let j = 0; j < this._objectsInStage.length; j++) {
            const objectInStage = this._objectsInStage[j];

            if (this._objectsInStage[0] === StageDescriber.objectsDesc.END_POINT) {
                if (pos.equals(objectInStage[2].position)) {
                    objectInStage[1].unlock();
                }
            }
        }
    }

    checkForCollision(character){
        const characterZPos = character.position.z;
        const characterBound = new THREE.Box3().setFromObject(character);

        for (let i = 0; i < this._objectsInStage.length; i++){
            const objectInStage = this._objectsInStage[i];

            if (objectInStage.length >= 4){//it's a collidable object that keeps state of the object
                let checkForCollision = true;

                if (objectInStage[0] === StageDescriber.objectsDesc.END_POINT && !objectInStage[4]){
                    //gate hasn't been unlocked, so skip collision detection
                    checkForCollision = false;
                }


                const objectManagerClass = objectInStage[1];
                const actualObjectInScene = objectInStage[2];
                const collisionState = objectInStage[3];
                if (!collisionState){//character hasn't collided with object
                    //check for collision
                    const objectBounds = new THREE.Box3().setFromObject(actualObjectInScene);
                    if (characterBound.intersectsBox(objectBounds) && checkForCollision){
                        objectManagerClass.gatePassed();
                        objectInStage[3] = true;
                        //console.log(this._objectsInStage);
                        continue;
                    }

                    //check if user has passed object or not

                    if (characterZPos > actualObjectInScene.position.z){
                        window.gatePassed();
                    }
                }
            }
        }
    }
}
