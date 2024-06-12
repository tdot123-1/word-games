import { 
    sendGameData, 
    displayFlashMessage,
    initPopover,
    scrollPage,
    checkWordValidity,
    GameState,
 } from "./functions.js";

 document.addEventListener("DOMContentLoaded", () => {

    const popover = initPopover();

    const loadingSpinner = document.getElementById("loading-spinner");
    const playBtn = document.getElementById("guess-btn");
    loadingSpinner.style.display = "none";

    const gameState = new GameState("wordRush", 0, playBtn, loadingSpinner, userId);

    const wordNodeList = document.querySelectorAll(".guess-1");

    // get all letters -> form string
    playBtn.addEventListener("click", () => {

        const lettersArr = Array.from(wordNodeList).map(input => input.value);

        console.log(lettersArr);
    });

    // validate word
    // freeze letter in place
    // empty other inputs

 });