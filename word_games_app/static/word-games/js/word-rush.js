import { 
    sendGameData, 
    displayFlashMessage,
    initPopover,
    scrollPage,
    checkWordValidity,
    GameState,
    Timer,
 } from "./functions.js";

 document.addEventListener("DOMContentLoaded", () => {

    // tell user how many points after end of game

    // bootstrap popover
    const popover = initPopover();
    // dom elements
    const loadingSpinner = document.getElementById("loading-spinner");
    const playBtn = document.getElementById("guess-btn");
    loadingSpinner.style.display = "none";
    const timerDisplay = document.getElementById("timer");
    const endContainer = document.getElementById("end-msg");

    // set game state and timer
    const gameState = new GameState("wordRush", 0, playBtn, loadingSpinner, userId, endContainer);

    const timer = new Timer(90, timerDisplay, timerEnd);
    // all input fields
    const wordNodeList = document.querySelectorAll(".guess-1");

    // when timer ends, disable all input fields, end game
    function timerEnd() {
        wordNodeList.forEach(input => {
            input.disabled = true;
        });
        gameState.won = true;
        gameState.gameOver();
    }
    
    // keep track of words used
    const usedWordsList = [];

    // play button to send word
    gameState.playBtn.addEventListener("click", () => {

        // change button functionality depending on game context
        if (gameState.ended && !gameState.resendData) {
            location.reload();
            return;
        }
        else if (gameState.resendData) {
            gameState.resendData = false;
            gameState.gameOver();
            return;
        }

        if (!timer.running) {
            timer.start();
        }
        // disable all input fields on click
        wordNodeList.forEach(input => {
            input.disabled = true;
        });
        // get array from input values, get string from array
        const wordArr = Array.from(wordNodeList).map(input => input.value.toLowerCase());
        const wordStr = wordArr.join("");

        // disable play button, display spinner, start word process
        gameState.playBtn.disabled = true;
        gameState.spinner.style.display = "flex";
        processWord(wordStr, wordArr);
        
    });


    // attach eventlistener to each input field
    wordNodeList.forEach((input, index) => {
        input.addEventListener("input", () => {
            let letterInput = input.value;
            // validate that it is a word
            if (!/^[a-zA-Z]*$/.test(letterInput)) {
                input.value = "";
            }
            else {
                // set focus on next available field
                let nextIndex = index + 1;
                while (nextIndex < wordNodeList.length && wordNodeList[nextIndex].disabled) {
                    nextIndex += 1;
                }
                if (nextIndex < wordNodeList.length) {
                    wordNodeList[nextIndex].focus();
                }
            }
        });
    });

    // validate word
    async function processWord(wordStr, wordArr) {
        // pause timer
        
        timer.pause();
        try {
            const validWord = await checkWordValidity(wordStr, "wordRush", "/check-word-validity");
            // resume timer
            timer.resume();
            gameState.spinner.style.display = "none";
            gameState.playBtn.disabled = false;
            if (!validWord || usedWordsList.includes(wordStr)) {
                wordNodeList.forEach((input, index) => {
                    // empty inputs, except disabled
                    if (!input.classList.contains("fade-in-green")) {
                        input.disabled = false;
                        input.value = "";
                    }
                });
                // check if word is unique
                if (usedWordsList.includes(wordStr)) {
                    displayFlashMessage("Word already used", "warning");
                }
                return;
            }
            // get frozen letter
            gameState.points += 1;
            usedWordsList.push(wordStr);
            freezeLetter(wordArr);
            return;

        }
        catch (error) {
            console.log("Error: ", error);
            displayFlashMessage(`There was an error: ${error}`, "danger");
        }

    }

    // freeze letter in place
    function freezeLetter(wordArr) {

        let newFrozenIndex = null;
        let oldFrozenIndex = null;

        wordNodeList.forEach((input, index) => {
            if (input.classList.contains("fade-in-green")) {
                oldFrozenIndex = index;
                input.classList.remove("fade-in-green");
            }
            input.value = "";
            input.disabled = false;
        });

        do {
            newFrozenIndex = Math.floor(Math.random() * wordNodeList.length);
        }
        while(newFrozenIndex === oldFrozenIndex);

        const frozenLetter = wordArr[newFrozenIndex];
        wordNodeList[newFrozenIndex].value = frozenLetter;
        wordNodeList[newFrozenIndex].classList.add("fade-in-green");
        wordNodeList[newFrozenIndex].disabled = true;

        // set focus
        for (let i = 0; i < wordNodeList.length; i++) {
            if (!wordNodeList[i].disabled) {
                wordNodeList[i].focus();
                break;
            }
        }
        return;
    }

    // empty other inputs

 });