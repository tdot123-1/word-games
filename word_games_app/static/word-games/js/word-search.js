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
  const wordListDisplay = document.getElementById("word-list");

  // set game state and timer
  const gameState = new GameState(
    "wordSearch",
    0,
    playBtn,
    loadingSpinner,
    userId,
    endContainer
  );
  let gameStarted = false;

  const allowedLetters = [];
  const submittedWords = [];

  let allowedLettersCount;

  let previousInputValue = "";

  // End game and count points after timer ends
  async function timerEnd() {
    gameState.spinner.style.display = "flex";
    playBtn.disabled = true;
    textInput.disabled = true;
    gameState.won = true;

    // get unique words
    const uniqueWords = [...new Set(submittedWords)];

    // validate only allowed letters were used
    const wordsAllowed = uniqueWords.filter(word => validateLettersUsed(word))

    // validate each word
    const wordsValidated = await countPoints(uniqueWords);
    gameState.spinner.style.display = "none";
    if (wordsValidated) {
      gameState.gameOver();
    } else {
      displayFlashMessage("Error counting words", "danger");
    }
  }

  // set timer
  const timer = new Timer(90, timerDisplay, timerEnd);

  // selection of letters to display on screen
  const letterDice = [
    ["r", "i", "f", "o", "b", "x"],
    ["i", "f", "e", "h", "e", "y"],
    ["d", "e", "n", "o", "w", "s"],
    ["u", "t", "o", "k", "n", "d"],
    ["h", "m", "s", "r", "a", "o"],
    ["l", "u", "p", "e", "t", "s"],
    ["a", "c", "i", "t", "o", "a"],
    ["y", "l", "g", "k", "u", "e"],
    ["q", "b", "m", "j", "o", "a"],
    ["e", "h", "i", "s", "p", "n"],
    ["v", "e", "t", "i", "g", "n"],
    ["b", "a", "l", "i", "y", "t"],
    ["e", "z", "a", "v", "n", "d"],
    ["r", "a", "l", "e", "s", "c"],
    ["u", "w", "i", "l", "r", "g"],
    ["p", "a", "c", "e", "m", "d"],
  ];

  /*
  function checkLetter(letter, lettersObj) {
    if (letter in lettersObj) {
      if (lettersObj[letter] > 0) {
        lettersObj[letter] -= 1;
        return true;
      }
    }
    return false;
  }
*/

  function validateLettersUsed(word) {
    allowedLettersCount = getAllowedLettersCount(allowedLetters);
    for (let i = 0; i < word.length; i++) {
        if (!checkAllowedLetter(word[i])) {
            return false
        }
    }
    return true;
  }

  function validateAllowedWords(wordsArr) {
    // return array where all words passed through validateLettersUsed() succesfully
  }

  // validate each word from array
  async function countPoints(wordsArr) {
    try {
      for (let i = 0; i < wordsArr.length; i++) {
        const validWord = await checkWordValidity(
          wordsArr[i],
          gameState.gameName,
          "/check-word-validity"
        );
        if (validWord) {
          gameState.points += 1;
        }
      }
      return true;
    } catch (error) {
      console.log("Error: ", error);
    }
    return false;
  }

  // get allowed letters, set display
  function getLetters() {
    letterDice.forEach((letter, index) => {
      const randomLetter = letter[Math.floor(Math.random() * letter.length)];
      lettersDisplay[index].innerText = randomLetter;
      allowedLetters.push(randomLetter);
      lettersDisplay[index].innerText = randomLetter;
    });
  }

  // get object of unique letters and count
  function getAllowedLettersCount(letters) {
    const lettersCount = letters.reduce((acc, letter) => {
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {});

    return lettersCount;
  }

  // check if letter allowed
  function checkAllowedLetter(letter) {
    if (letter in allowedLettersCount) {
      if (allowedLettersCount[letter] > 0) {
        allowedLettersCount[letter] -= 1;
        return true;
      }
    }
    return false;
  }

  // display letters on screen
  gameState.playBtn.addEventListener("click", () => {
    if (gameState.ended && !gameState.resendData) {
      location.reload();
      return;
    } else if (gameState.resendData) {
      gameState.resendData = false;
      gameState.gameOver();
      return;
    }

    if (!gameStarted) {
      // get letters
      gameStarted = true;
      getLetters();
      console.log(allowedLetters);
      allowedLettersCount = getAllowedLettersCount(allowedLetters);
      console.log(allowedLettersCount);

      // enable input
      textInput.disabled = false;

      // start timer
      timer.start();

      // enable button
      gameState.playBtn.disabled = true;
      return;
    }
    // add word to submitted array
    const wordStr = textInput.value;
    submittedWords.push(wordStr);

    // empty input field, set focus, disable btn
    textInput.value = "";
    previousInputValue = "";
    textInput.focus();
    gameState.playBtn.disabled = true;

    // create new list item, display on page
    const newWord = document.createElement("li");
    newWord.innerText = wordStr;
    wordListDisplay.appendChild(newWord);

    // reset allowed letters count
    allowedLettersCount = getAllowedLettersCount(allowedLetters);
    return;
  });

  // listen for input, check if letter is allowed
  textInput.addEventListener("input", () => {
    // get input value and last char inputted
    const value = textInput.value;
    const lastChar = textInput.value[textInput.value.length - 1];

    // ensure only letters are inputted
    if (!/^[a-zA-Z]*$/.test(lastChar)) {
      textInput.value = value.slice(0, -1);
    } else {
      // remove last inputted char if it is not part of the allowed letters
      if (!checkAllowedLetter(lastChar)) {
        textInput.value = value.slice(0, -1);
      }
    }

    // handle backspace
    if (value.length < previousInputValue.length) {
      const deletedLetter = previousInputValue.slice(-1);
      handleBackspace(deletedLetter);
    }

    // allow only words more than 4 letters to be submitted
    if (textInput.value.length > 3) {
      gameState.playBtn.disabled = false;
    } else {
      gameState.playBtn.disabled = true;
    }

    previousInputValue = value;
  });

  // handle backspace -> needs work

  function handleBackspace(letter) {
    if (letter in allowedLettersCount) {
      console.log("updated letter count");
      allowedLettersCount[letter] += 1;
    }
    return;
  }
});
