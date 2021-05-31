import {SceneManager} from "./js/SceneManager.js";
let sceneManager;

const init = () => {

    /*
    * initialize global function that hides the games GUI(Graphical User Interface) or menus
    * */
    window.hideGuis = () => {
        const guis = document.getElementsByClassName("gui");
        for (let i = 0; i < guis.length; i++){
            const gui = guis[i];
            gui.style.display = "none";
        }
    }

    /*
    * initialize global function that shows the game over page, this occurs when the player misses a gate
    * */
    window.gatePassed = () => {
        window.gameIsPlaying = false;
        document.getElementById("gameOver").style.display = "flex";
    }

    //create the scene
    sceneManager = new SceneManager();
}

//wait for window to completely load
window.addEventListener('load', () => {
    //creates a reference to start button and set click listener
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", () => {
        startButton.innerText = "Please Wait...";
        startButton.disabled = true;
        init();
    });
});
