const game = document.querySelectorAll('.memory-game')[0];
const cards = document.querySelectorAll('.memory-card');

let score = document.querySelector('.score p');
let shuffle = document.querySelector('.shuffle')
let shuffleGame = false;

let hasFlippedCard = false;
let gameStarted = false;
let lockBoard = false;
let firstCard, secondCard;
let cardsFlipped = 0;
let matchedCards = [];

function flipCard() {
  if (!gameStarted) {
    gameStarted = true;
    shuffleGame = shuffle.checked;
    shuffle.disabled =true;
  }

  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  hasFlippedCard = false;
  secondCard = this;
   
  checkForMatch(); 
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();

  if (cardsFlipped === 6) {
    let playAgain = confirm('WINNER!!! Would like to play again?');

    if (playAgain) startGame();
  } 
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  firstCard.classList.add('correct-match');
  secondCard.classList.add('correct-match');

  cardsFlipped ++;
  matchedCards.push(firstCard.dataset.framework);

  resetBoard();
  checkScore(true);
}

function unflipCards() {
  lockBoard = true;

  firstCard.classList.add('wrong-match');
  secondCard.classList.add('wrong-match');

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    firstCard.classList.remove('wrong-match');
    secondCard.classList.remove('wrong-match');

    if (shuffleGame) reshuffleCards();
    checkScore(false);
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function reshuffleCards() {
  lockBoard = true;

  cards.forEach(card => {
    if (matchedCards.includes(card.dataset.framework)) return;
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });

  resetBoard();
}

function checkScore(match) {
  let currentScore = parseInt(score.innerHTML);

  if (match) {
    shuffleGame ? currentScore +=20 : currentScore -= 10;
  } else {
    currentScore -= 10;
  }

  score.innerHTML = currentScore;

  if (score.value <= 0) {
    let playAgain = confirm('YOU LOST!!! Would like to play again?');

    if (playAgain) startGame();
  }
}

function startGame(){
  window.location.reload()
};

(function shuffleCards() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  })
})();

cards.forEach(card => {
  card.addEventListener('click', flipCard)
});