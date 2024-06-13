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

    const timer = new Timer(90, timerDisplay, timerEnd);

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
        });
    }

    // get array of unique letters and count
    function getAllowedLettersCount() {
        const allowedLettersCount = allowedLetters.map(letter => {
            
        });
    }

});
