// === Number Guessing Game ===

function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

class Game {
  constructor() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }

  isLower() {
    return this.playersGuess < this.winningNumber;
  }

  playersGuessSubmission(num) {
    if (typeof num !== 'number' || num < 1 || num > 100) {
      return 'That is an invalid guess!';
    }
    this.playersGuess = num;
    return this.checkGuess();
  }

  checkGuess() {
    if (this.playersGuess === this.winningNumber) {
      return 'You Win!';
    }

    if (this.pastGuesses.includes(this.playersGuess)) {
      return 'You have already guessed that number.';
    }

    this.pastGuesses.push(this.playersGuess);

    if (this.pastGuesses.length === 5) {
      return 'You Lose.';
    }

    const diff = this.difference();
    if (diff < 10) return "You're burning up!";
    else if (diff < 25) return "You're lukewarm.";
    else if (diff < 50) return "You're a bit chilly.";
    else return "You're ice cold!";
  }

  provideHint() {
    const hintArr = [this.winningNumber];
    while (hintArr.length < 3) {
      const rand = generateWinningNumber();
      if (!hintArr.includes(rand)) {
        hintArr.push(rand);
      }
    }
    return shuffle(hintArr);
  }
}

// === DOM Logic ===

let game;

document.addEventListener("DOMContentLoaded", () => {
  const guessInput = document.getElementById('player-input');
  const guessButton = document.getElementById('submit');
  const hintButton = document.getElementById('hint');
  const resetButton = document.getElementById('reset');
  const feedback = document.getElementById('feedback');
  const pastGuesses = document.getElementById('past-guesses');

  game = new Game();

  function displayGuess(guess) {
    const result = game.playersGuessSubmission(guess);
    feedback.textContent = result;

    pastGuesses.innerHTML = '';
    game.pastGuesses.forEach(g => {
      const li = document.createElement('li');
      li.textContent = g;
      pastGuesses.appendChild(li);
    });

    if (result === 'You Win!' || result === 'You Lose.') {
      guessButton.disabled = true;
      hintButton.disabled = true;
    }
  }

  guessButton.addEventListener('click', () => {
    const guess = parseInt(guessInput.value);
    displayGuess(guess);
    guessInput.value = '';
  });

  hintButton.addEventListener('click', () => {
    const hints = game.provideHint();
    feedback.textContent = `One of these is the correct number: ${hints.join(', ')}`;
  });

  resetButton.addEventListener('click', () => {
    game = new Game();
    feedback.textContent = '';
    pastGuesses.innerHTML = '';
    guessInput.value = '';
    guessButton.disabled = false;
    hintButton.disabled = false;
  });
});
