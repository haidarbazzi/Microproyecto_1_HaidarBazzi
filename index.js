const cards = document.querySelectorAll('.memory-card'); /*Almacenamos en un array todas las cartas */
const button = document.getElementById('nameButton');
const input = document.getElementById('nameInput');
let hasEnteredName = false;

button.addEventListener('click', () => {
    
})
/* Declaracion de variables */
let hasFlippedCard = false; /*Indica si se ha volteado alguna carta*/
let lockBoard = false; /* Si se coloca en true, se bloquea el board */
let firstC, secondC; 
let counter = 0; /*Contador de puntaje */


function resetGame(){
    counter = 0;
    cards.forEach(card => card.remove('flip'));
    shuffle();
}

function flipCard() {
  if (lockBoard || this === firstC){
    return;
  }
  
  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstC = this;

    
  } else{
    secondC = this;

  if(firstC.dataset.logo === secondC.dataset.logo){

    disableCards();
    counter += 1;
    document.getElementById("contador").innerHTML = "Contador: " + counter; 
    }

  else {
    unflipCards();
  }
  }

}

function disableCards() {
  firstC.removeEventListener('click', flipCard);
  secondC.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstC.classList.remove('flip');
    secondC.classList.remove('flip');

    resetBoard();
  }, 1500);
}


function resetBoard() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 16);
    card.style.order = randomPos;
  });
})();


cards.forEach(card => card.addEventListener('click', flipCard));