This was an early project I made to practise using the Flask framework for Python.
It is a web application where users can create an account and log in, after which they will have acces to three different games.

In the first game the user has 6 attempts to guess a randomly selected word from a list. Only valid english words are accepted as guesses. 
On each guess the user receives feedback for which letters are in the secret word. 
Similar to the game Wordle, a letter will turn either green or yellow depending on if the letter is correctly guessed and in the right position or not.

In the second game, the user will have 90 seconds to make as many 5 letter words as they can. 
After submitting a word, one letter will be frozen in place and the next word has to be formed using this letter.
Only valid words are accepted, and after the timer ends, points will be counted up. 

In the third game, the user will have 90 seconds to form as many words as they can from the letters displayed on screen.
Upon pressing start, the user will be shown a 4x4 grid of random letters. 
As with the other games, only valid words are accepted and points are counted after the timer ends.

Each user's total points (for all games) and high scores per game are saved in a database and displayed on the 'High scores' page.

To validate words I made use of the PyDictionary library, which determines if an inputted word is an existing english word or not.

This was also my first attempt at styling a webpage with Bootstrap, which is why the html looks somewhat messy.

All the games are done in JavaScript, all the backend stuff is done in Python.
