import {SceneManager} from "./js/SceneManager.js";
import {StageDescriber} from "./js/StageDescriber.js";
let sceneManager;

/**
 * define the event handlers for button clicks
 * */
const startEventHandler = (e) => {
    menuButtonClickHandler(e, StageDescriber.Stages.ONE);
}

const resumeEventHandler = () => {
    window.hideGuis();
    window.gameIsPlaying = true;
}

const restartEventHandler = (e) => {
    menuButtonClickHandler(e, window._currentScene);
}

/*
* Defines how the menu button click even will occur
* */
const menuButtonClickHandler = (e, stage) => {
    const button = e.path[0];
    button.innerText = "Please Wait...";
    setMenuButtonsAsDisabled(true);
    sceneManager.BuildStage(stage);
}

/*
* enables and disables the menu button
* */
const setMenuButtonsAsDisabled = (state) => {
    const menuButtons = document.getElementsByClassName("gui-button");
    for (let i = 0; i < menuButtons.length; i++){
        const menuButton = menuButtons[i];
        menuButton.disabled = state;
    }
}
/*
* removes all possible event listeners that might be attached to start button
* */
const removeStartEventHandlers = () => {
    const startBtn = document.getElementById("start");
    startBtn.removeEventListener('click', startEventHandler);
    startBtn.removeEventListener('click', resumeEventHandler);
    startBtn.removeEventListener('click', restartEventHandler);
}

/*
* configurates how the menu is shown and how the start will behave
* */
const configMenu = (btnText, btnEventHandler, subText) => {
    const startButton = document.getElementById("start");
    startButton.innerText = btnText;
    startButton.addEventListener("click", btnEventHandler);
    document.getElementById("sub-title").innerText = subText;

    //set the text of each button incase it's showing as please wait
    document.getElementById("level_1").innerText = "Level 1";
    document.getElementById("level_2").innerText = "Level 2";
    document.getElementById("level_3").innerText = "Level 3";
    document.getElementById("level_4").innerText = "Level 4";
}

const init = () => {

    //create the scene
    sceneManager = new SceneManager();

    /*
    * init click listeners for game menu buttons
    * */
    document.getElementById("level_1").addEventListener("click",(e) => menuButtonClickHandler(e, StageDescriber.Stages.ONE));
    document.getElementById("level_2").addEventListener("click",(e) => menuButtonClickHandler(e, StageDescriber.Stages.TWO));
    document.getElementById("level_3").addEventListener("click",(e) => menuButtonClickHandler(e, StageDescriber.Stages.THREE));
    document.getElementById("level_4").addEventListener("click",(e) => menuButtonClickHandler(e, StageDescriber.Stages.FOUR));


    /*
    * initialize global function that hides the games GUI(Graphical User Interface) or menus
    * */
    window.hideGuis = () => {
        document.getElementById("main-menu").style.display = "none";
        //remove the event listener attached to start button
        //we do this because start button has multiple event listeners based on which menu is shown
        removeStartEventHandlers();
    }

    /*
    * displays the games main menu
    * */
    window.displayMainMenu = () => {
        window.gameIsPlaying = false;
        setMenuButtonsAsDisabled(false);
        document.getElementById("main-menu").style.display = "flex";
        document.getElementById("sub-title").innerText = "";
    }

    /*
    * initialize global function that shows the game over page, this occurs when the player misses a gate
    * */
    window.gatePassed = () => {
        window.displayMainMenu();
        configMenu("Restart", restartEventHandler, "You passed a gate");
    }

    /*
    * pauses the game
    * */
    window.pauseGame = () => {
        window.displayMainMenu();
        configMenu("Resume", resumeEventHandler, "");
    }

    /*
    * shows the game complete menu
    * */
    window.gameComplete = () => {
        window.displayMainMenu();
        const startButton = document.getElementById("start");
        startButton.innerText = "Resume";
        startButton.addEventListener("click", resumeEventHandler);
        document.getElementById("sub-title").innerText = "";
        configMenu("Start", startEventHandler, "You completed the game");
    }

    /*
    * shows the avatar died menu
    * */
    window.avatarDied = () => {
        window.displayMainMenu();
        configMenu("Restart", restartEventHandler, "You died :(");
    }

    document.getElementById("start").addEventListener("click", startEventHandler);
}

//wait for window to completely load
window.addEventListener('load', () => init());
