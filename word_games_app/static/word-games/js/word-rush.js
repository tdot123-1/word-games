import { 
    sendGameData, 
    displayFlashMessage,
    initPopover,
    scrollPage,
    checkWordValidity,
    GameState,
    runTimer,
    Timer,
 } from "./functions.js";

 document.addEventListener("DOMContentLoaded", () => {

    const popover = initPopover();

    const loadingSpinner = document.getElementById("loading-spinner");
    const playBtn = document.getElementById("guess-btn");
    loadingSpinner.style.display = "none";

    const timerDisplay = document.getElementById("timer");

    const gameState = new GameState("wordRush", 0, playBtn, loadingSpinner, userId);

    const timer = new Timer(90, timerDisplay, timerEnd)

    const pauseBtn = document.getElementById("pause");
    const resumeBtn = document.getElementById("resume");

    function timerEnd() {
        timerDisplay.innerText = "Timer ended";
    }
    
    

    // get all letters -> form string
    playBtn.addEventListener("click", () => {

        const wordNodeList = document.querySelectorAll(".guess-1");

        const wordArr = Array.from(wordNodeList).map(input => input.value);
        const wordStr = wordArr.join("");

        console.log(wordArr);
        console.log(wordStr);
    });

    // validate word
    async function processWord() {
        
    }
    // freeze letter in place
    // empty other inputs

 });