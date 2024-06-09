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
    let gameWon = false;

    // randomly select password from list of words, 
    const password = listOfWords[Math.floor(Math.random() * listOfWords.length)];
    console.log(password);
    const passwordArr = password.split("");

    // hide all input squares at start of game, display only first line
    const squares = document.querySelectorAll('.custom-word-container');
    squares.forEach(square => {
        square.style.display = 'none';
    });


    // handle letter input
    function handleInput(inputArr, inputField, inputIndex) {

        let letterInput = inputField.value;
        if (!/^[a-zA-Z^]*$/.test(letterInput)) {
            inputField.value = "";
        }
        else {
            if (inputIndex < inputArr.length - 1) {
                inputArr[inputIndex + 1].focus();
            } 
        }
    }

    // next guess
    function nextTurn() {
        guessCount += 1;
        points -= 5;

        if (guessCount > 1) {
            document.querySelectorAll(`.guess-${guessCount - 1}`).forEach(input => {
                input.removeEventListener("input", handleInput);
            });
        }

        const nextGuess = document.querySelectorAll(`.guess-${guessCount}`);
        document.querySelector(`#guess-cont-${guessCount}`).style.display = "flex";

        nextGuess.forEach((input, index) => {
            input.addEventListener("input", () => {
                handleInput(nextGuess, input, index);
            });
        });
        nextGuess[0].focus();
        scrollPage("bottom");
        return;
    }


    function checkWin(passwordArrObj) {
        for(let i = 0; i < passwordArrObj.length; i += 1) {
            if (passwordArrObj[i].correctPos === false) {
                return false;
            }
        }
        return true;
    }


    function checkCorrectLetters(guessArr, guessNodeList, passwordArrObj) {

        guessArr.forEach((letter, letterIndex) => {
            if (letter === passwordArrObj[letterIndex].letter) {
                guessNodeList[letterIndex].classList.add("fade-in-green");
                passwordArrObj[letterIndex].correctPos = true;
                passwordArrObj[letterIndex].guessed = true;
            }
        });

        return passwordArrObj;
    }


    function checkCorrectGuess(guessArr, guessNodeList, passwordArrObj) {
        guessArr.forEach((letter, letterIndex) => {
            if (!guessNodeList[letterIndex].classList.contains("fade-in-green")) {
                for (let i = 0; i < passwordArrObj.length; i++) {
                    if (letter === passwordArrObj[i].letter && passwordArrObj[i].correctPos === false && passwordArrObj[i].guessed === false) {
                        
                        guessNodeList[letterIndex].classList.add("fade-in-yellow");
                        
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
            // spinner
            loadingSpinner.style.display = "none"
            // button
            guessBtn.disabled = false;
            if (!validWord) {
                guessNodeList.forEach(inputField => {
                    inputField.value = "";
                    inputField.disabled = false;
                });
                guessNodeList[0].focus();
                return;
            }
            // check correct letters
            passwordArrObj = checkCorrectLetters(guessArr, guessNodeList, passwordArrObj);
            if (checkWin(passwordArrObj)) {
                console.log("game over, win");
                console.log("points: ", points);
                gameEnd = true;
                // game over -> send data
                gameOver(gameEnd);
                return;
            }
            checkCorrectGuess(guessArr, guessNodeList, passwordArrObj);
            if (guessCount === 6) {
                console.log("game over, loss")
                gameEnd = true;
                // game over -> send data
                gameOver(gameEnd);
                return;
            }
            nextTurn();
            return;
        }
        catch (error) {
            console.log("Error: ", error);
            displayFlashMessage("There was an error", "danger");
        }
    }


    async function gameOver(win) {
        
        guessBtn.disabled = true;
        gameEnd = true;
        
        if (win) {
            loadingSpinner.style.display = "flex";
            guessBtn.innerHTML = "Updating high scores...";
            try {
                const statsUpdated = await sendGameData(points, "wordGuess", "/update-game-data", userId);
                loadingSpinner.style.display = "none";
                guessBtn.disabled = false;
                if (!statsUpdated) {
                    dataResend = true;
                    guessBtn.innerHTML = "retry sending data";
                    return;
                }
                
            }
            catch (error) {
                console.log("Error: ", error);
                dataResend = true;
                guessBtn.innerHTML = "retry sending data";
                return;
            }
        }
        guessBtn.disabled = false;
        guessBtn.innerHTML = "Play again?";  
    }

    nextTurn();

    guessBtn.addEventListener("click", () => {
        
        if (gameEnd && !dataResend) {
            location.reload();
            return;
        }
        else if (dataResend) {
            dataResend = false;
            gameOver(gameWon);
            return;
        }
        // on button click, display spinner, disable btn, get input
        console.log("button clicked");
        guessBtn.disabled = true;
        loadingSpinner.style.display = "flex";
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