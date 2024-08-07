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
    const endContainer = document.getElementById("end-msg");

    // should probably be hidden somehow or moved to backend
    // will be hidden in future update, for the moment ->
    // hope/trust no one looks at this list
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

    // create instance to keep track of game state
    const gameState = new GameState("wordGuess", 35, playBtn, loadingSpinner, userId, endContainer)

    // randomly select password from list of words, 
    // get array from password string to use later
    const password = listOfWords[Math.floor(Math.random() * listOfWords.length)];
    //console.log(password);
    const passwordArr = password.split("");

    // hide all input squares at start of game, display only first line
    const squares = document.querySelectorAll('.custom-word-container');
    squares.forEach(square => {
        square.style.display = 'none';
    });


    // handle letter input
    function handleInput(inputArr, inputField, inputIndex) {
        // check if input is a letter
        let letterInput = inputField.value;
        if (!/^[a-zA-Z^]*$/.test(letterInput)) {
            inputField.value = "";
        }
        // move focus to next input field
        else {
            if (inputIndex < inputArr.length - 1) {
                inputArr[inputIndex + 1].focus();
            } 
        }
    }

    // next guess
    function nextTurn() {
        // start of new turn, add to guess count, remove points
        guessCount += 1;
        gameState.points -= 5;
        // remove previous event listeners
        if (guessCount > 1) {
            document.querySelectorAll(`.guess-${guessCount - 1}`).forEach(input => {
                input.removeEventListener("input", handleInput);
            });
        }
        // select + reveal next input fields
        const nextGuess = document.querySelectorAll(`.guess-${guessCount}`);
        document.querySelector(`#guess-cont-${guessCount}`).style.display = "flex";
        // add eventlistener to input fields
        nextGuess.forEach((input, index) => {
            input.addEventListener("input", () => {
                handleInput(nextGuess, input, index);
            });
        });
        // set focus, scroll to bottom
        nextGuess[0].focus();
        scrollPage("bottom");
        return;
    }


    // for each object in password array, check 'correct position' property
    // if any is false, return false
    function checkWin(passwordArrObj) {
        for(let i = 0; i < passwordArrObj.length; i += 1) {
            if (passwordArrObj[i].correctPos === false) {
                return false;
            }
        }
        return true;
    }


    // check for correct guessed letters in correct position
    function checkCorrectLetters(guessArr, guessNodeList, passwordArrObj) {

        // for each letter in guess array, compare to pw object letter property
        // add class, update properties on match (to keep track of already guessed letters) 
        guessArr.forEach((letter, letterIndex) => {
            if (letter === passwordArrObj[letterIndex].letter) {
                guessNodeList[letterIndex].classList.add("fade-in-green");
                passwordArrObj[letterIndex].correctPos = true;
                passwordArrObj[letterIndex].guessed = true;
            }
        });
        return passwordArrObj;
    }


    // check correct guessed letters in wrong position
    function checkCorrectGuess(guessArr, guessNodeList, passwordArrObj) {
        // iterate over each letter in guess array, keeping track of index
        guessArr.forEach((letter, letterIndex) => {
            // make sure not to overwrite previously correct guessed letters
            if (!guessNodeList[letterIndex].classList.contains("fade-in-green")) {
                // for each letter in guess array, compare to each letter in pw array
                for (let i = 0; i < passwordArrObj.length; i++) {
                    // if guessed letter exists in pw, and properties are false -> add yellow class, set "guessed" property to true
                    if (letter === passwordArrObj[i].letter && passwordArrObj[i].correctPos === false && passwordArrObj[i].guessed === false) {
                        
                        guessNodeList[letterIndex].classList.add("fade-in-yellow");
                        // break out of inner loop
                        passwordArrObj[i].guessed = true;
                        break;                  
                    }
                }
            }
        });
    }


    async function processGuess(guessStr, guessArr, guessNodeList, passwordArrObj) {
        try {
            const validWord = await checkWordValidity(guessStr, "wordGuess", "/check-word-validity");
            // hide spinner, enable btn after validity check
            gameState.spinner.style.display = "none";
            gameState.playBtn.disabled = false;
            // if word was invalid, empty input fields, enable fields, set focus, return
            if (!validWord) {
                guessNodeList.forEach(inputField => {
                    inputField.value = "";
                    inputField.disabled = false;
                });
                guessNodeList[0].focus();
                return;
            }
            // check correct letters in correct position
            passwordArrObj = checkCorrectLetters(guessArr, guessNodeList, passwordArrObj);
            if (checkWin(passwordArrObj)) {
                console.log("game over, win");
                console.log("points: ", gameState.points);
                gameState.won = true;
                // game over -> send points data
                gameState.gameOver()
                return;
            }
            // check correct guessed letters in wrong position
            checkCorrectGuess(guessArr, guessNodeList, passwordArrObj);
            // at 6 guesses, game over
            if (guessCount === 6) {
                console.log("game over, loss")
                gameState.gameOver();
                return;
            }
            // start next turn
            nextTurn();
            return;
        }
        // flash message if there was an error
        catch (error) {
            console.log("Error: ", error);
            displayFlashMessage(`There was an error: ${error}`, "danger");
        }
    }

    // display first line of input fields at start of game
    nextTurn();

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
        // on button click, display spinner, disable btn, get input
        console.log("button clicked");
        gameState.playBtn.disabled = true;
        gameState.spinner.style.display = "flex";
        const currentGuessInput = document.querySelectorAll(`.guess-${guessCount}`);

        // set new array to keep track of which letter has been guessed
        const passwordArrObj = [];
        passwordArr.forEach(letter => {
            passwordArrObj.push({
                "letter": letter,
                "guessed": false,
                "correctPos": false,
            });
        });
        
        // get array from input nodeList, set to lowercase, create string from array
        const currentGuessArr = [];
        currentGuessInput.forEach(input => {
            currentGuessArr.push(input.value.toLowerCase());
        });
        // use string to check validity of word
        const currentGuessStr = currentGuessArr.join("");
        // disable all input fields
        currentGuessInput.forEach(inputField => {
            inputField.disabled = true;
        });

        // start verification process
        processGuess(currentGuessStr, currentGuessArr, currentGuessInput, passwordArrObj);

    });

});