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

    

 });