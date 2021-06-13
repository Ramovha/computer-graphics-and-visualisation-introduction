import * as THREE from "../threejs/three.module.js";
import {PlaneGeometry} from "../threejs/three.module.js";

/*
* responsible for creating a bullet and the bullet indicator
* */

export class Bullet{
    constructor() {
        this._Initialize();
    }

    _Initialize() {
        this._BuildBullet();
        this._BuildLightIndicator();
    }

    /*
    * Builds the actual bullet
    * */
    _BuildBullet(){
        const geometry = new THREE.ConeGeometry( 70, 300, 10 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00, transparency: true} );
        this._bullet = new THREE.Mesh( geometry, material );
        this._bullet.rotation.x = Math.PI/2;
        this._bullet.position.y += 120;
    }

    /*
    * Builds the light indicator
    * */
    _BuildLightIndicator(){
        const geometry = new PlaneGeometry(50, 4000);
        const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
        this._indicator = new THREE.Mesh(geometry, material);

        this._indicator.rotation.x = Math.PI/2;
    }

    /*
    * retrieves the actual bullet
    * */
    get bullet() {
        return this._bullet;
    }

    /*
    * retrieves the actual indicator
    * */
    get indicator(){
        return this._indicator;
    }

    /*
    * animates the bullet and light indicator
    * and translates the actual bullet and light indicator straight into the scene
    * */
    animate(color, time){
        this._bullet.material.color = color;
        this._indicator.material.color = color;
        this._bullet.position.z += 50;
        this._indicator.position.z += 50;
        this._indicator.material.opacity = (Math.sin(time) + 1) / 2;
    }
}
