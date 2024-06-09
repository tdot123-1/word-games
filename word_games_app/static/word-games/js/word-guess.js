import { 
    sendGameData, 
    displayFlashMessage,
    initPopover,
    scrollPage,
    checkWordValidity,
 } from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {

    const popover = initPopover();

    const loadingSpinner = document.getElementById("loading-spinner");
    const guessBtn = document.getElementById("guess-btn");
    loadingSpinner.style.display = "none";

    const listOfWords = [ 
        "apple", "brush", "chair", "dance", "eagle", "fable", "grape", "house", "igloo", "joker",
        "knife", "lemon", "mango", "noble", "ocean", "piano", "queen", "rainy", "sugar", "table", 
        "uncle", "vivid", "whale", "young", "zebra", "alarm", "blink", "chess", "dough", "elbow", 
        "flame", "giant", "hatch", "ivory", "jelly", "knots", "lunch", "marsh", "novel", "oasis", 
        "pilot", "quiet", "ruler", "skate", "thorn", "ultra", "winds", "yield", "zesty", "agile", 
        "baker", "cliff", "drift", "eager", "flock", "glory", "happy", "index", "jolly", "kiosk", 
        "lunar", "magic", "navel", "otter", "peach", "quest", "river", "sweep", "tiger", "under", 
        "vibes", "waltz","phone", "yacht", "adapt", "beast", "cloud", "dwarf", "erase", "frisk", 
        "gravy","honor", "image", "jumps", "knock", "lunar", "medal", "nurse", "olive", "peace", 
        "quick", "round", "salty", "toast", "unity", "vault", "wrist", "house", "young", "birds",
    ];

    let guessCount = 0;
    let points = 35;
    let gameEnd = false;
    let dataResend = false;

    // randomly select password from list of words, (?) convert to array (?)
    const password = listOfWords[Math.floor(Math.random() * listOfWords.length)];
    console.log(password);

    // hide all input squares at start of game, display only first line
    const squares = document.querySelectorAll('.custom-word-container');
    squares.forEach(square => {
        square.style.display = 'none';
    });

    // next guess
        // display container by id
        // add event listener to each indiv square 

    guessBtn.addEventListener("click", () => {
        console.log("buttom clicked")
    });

});