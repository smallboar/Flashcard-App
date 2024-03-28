# Flashcard-App
Simple Flashcard app (Focused on Client-Server API functionality, not UI)
React.js Frontend, and Node.js (Express.js) backend. 

Setup:
`cd` into the `/server` and `/client` directory separately and run `npm install` on each.

Afterwards, run `npm run start` on both `client` and `server`, and the project will open up in http://localhost:8080/

Usage:
Click `New Flashcard` to create a new set of flashcards. Enter the name of the quiz, and enter flashcards in the following format:
[Front text]|[Back text]

For example, if I wanted to make a math quiz, I could enter something like this:
<img width="447" alt="image" src="https://github.com/smallboar/Flashcard-App/assets/56139007/0f9ab1f8-d011-4800-8563-75e7d7e5374b">

An error will be displayed if there is no name/no cards/bad formatting for the cards within "Options", and you will not be able to save the quiz.


Click the hyperlinked flashcard under `List` to take the quiz. Click `Flip` to flip the flashcard to see the back, and select `Correct` or `Incorrect` based on how you did. If you want to practice again, click `Shuffle` at any time to randomly shuffle the flashcards, and resetting your `Correct/Incorrect` Score


