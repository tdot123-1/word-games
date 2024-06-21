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

    // bootstrap popover
    const popover = initPopover();
    // dom elements
    const loadingSpinner = document.getElementById("loading-spinner");
    const playBtn = document.getElementById("guess-btn");
    loadingSpinner.style.display = "none";
    const timerDisplay = document.getElementById("timer");
    const endContainer = document.getElementById("end-msg");
    const textInput = document.getElementById("text-input");
    const lettersDisplay = document.querySelectorAll(".custom-square-input");

    // set game state and timer
    const gameState = new GameState("wordSearch", 0, playBtn, loadingSpinner, userId, endContainer);
    let gameStarted = false;

    //const timer = new Timer(90, timerDisplay, timerEnd);

    const letterDice = [
        ['r', 'i', 'f', 'o', 'b', 'x'],
        ['i', 'f', 'e', 'h', 'e', 'y'],
        ['d', 'e', 'n', 'o', 'w', 's'],
        ['u', 't', 'o', 'k', 'n', 'd'],
        ['h', 'm', 's', 'r', 'a', 'o'],
        ['l', 'u', 'p', 'e', 't', 's'],
        ['a', 'c', 'i', 't', 'o', 'a'],
        ['y', 'l', 'g', 'k', 'u', 'e'],
        ['q', 'b', 'm', 'j', 'o', 'a'],
        ['e', 'h', 'i', 's', 'p', 'n'],
        ['v', 'e', 't', 'i', 'g', 'n'],
        ['b', 'a', 'l', 'i', 'y', 't'],
        ['e', 'z', 'a', 'v', 'n', 'd'],
        ['r', 'a', 'l', 'e', 's', 'c'],
        ['u', 'w', 'i', 'l', 'r', 'g'],
        ['p', 'a', 'c', 'e', 'm', 'd']
    ];
    
    const allowedLetters = [];

    // get allowed letters, set display
    function getLetters() {
        letterDice.forEach((letter, index) => {
            const randomLetter = letter[Math.floor(Math.random() * letter.length)];
            lettersDisplay[index].innerText = randomLetter;
            allowedLetters.push(randomLetter);
            lettersDisplay[index].innerText = randomLetter;
        });
    }

    // get array of unique letters and count
    function getAllowedLettersCount(letters) {
        const lettersCount = letters.reduce((acc ,letter) => {
            acc[letter] = (acc[letter] || 0) + 1;
            return acc;
        }, {});

        return lettersCount;
    }

    // check if letter allowed
    function checkAllowedLetter(letter, lettersCount) {
        if (letter in lettersCount) {
            if (lettersCount[letter] > 0) {
                lettersCount -= 1;
                return lettersCount;
            }
        }
        return null;
    }

    // display letters on screen 
    gameState.playBtn.addEventListener("click", () => {
        if (gameState.ended && !gameState.resendData) {
            location.reload();
            return;
        }
        else if (gameState.resendData) {
            gameState.resendData = false;
            gameState.gameOver();
            return;
        }

        if (!gameStarted) {
            gameStarted = true;
            getLetters();
            console.log(allowedLetters)
            const allowedLettersCount = getAllowedLettersCount(allowedLetters);
            console.log(allowedLettersCount);

            textInput.disabled = false;
            // start timer
            gameState.playBtn.disabled = true;
        }
        //const wordStr = textInput.value;
    });

    // start timer 

    // listen for input, check if letter is allowed
    textInput.addEventListener("input", () => {

        const value = textInput.value;
        const lastChar = textInput.value[textInput.value.length - 1];

        if (!/^[a-zA-Z]*$/.test(lastChar)) {
            textInput.value = value.slice(0, -1);
        }
        // check if letter is allowed

        if (textInput.value.length > 3) {
            gameState.playBtn.disabled = false;
        }
        else {
            gameState.playBtn.disabled = true;
        }
    })

    // send words to server on game over

    // calculate points

});
