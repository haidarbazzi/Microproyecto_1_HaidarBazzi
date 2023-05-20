const cards = document.querySelectorAll('.memory-card'); /*Almacenamos en un array todas las cartas */
const button = document.getElementById('nameButton');
const input = document.getElementById('nameInput');
const restart = document.getElementById('restartButton');

let minutes = 0;
let seconds = 0;
/* Declaracion de variables */
localStorage.clear();

let intervalo;
let hasFlippedCard = false; 
let lockBoard = false; 
let firstC, secondC; 
let counter = 0; 
let currentPlayer;
let hasEnteredName = false;
let secondsTakenByPlayer = 0;
const totalSeconds = 180;
let alreadyStored = true;
let seReinicio = false;

let lockGame = true;

function calculatePoints(){
    let timeLeft = 180 - secondsTakenByPlayer;
    let points = 8*(timeLeft/totalSeconds);
    return points;
}
function storeUser(){
    let points = calculatePoints();
    localStorage.setItem(currentPlayer, points);
}

function actualizarTimer(){

    if (!seReinicio){
        secondsTakenByPlayer += 1;
        seconds +=1;
        if (seconds>59){
            seconds = 0;
            minutes += 1;
        }
        if(seconds > 9){
            document.getElementById('Timer').innerHTML = 'Timer: ' + minutes + ":" + seconds;
        } else{
            document.getElementById('Timer').innerHTML = 'Timer: ' + minutes + ":" + "0"+seconds;
        }
        if(counter > 7 && alreadyStored){
            clearInterval(intervalo);
            alreadyStored = false;
            let points = calculatePoints();
            localStorage.setItem(currentPlayer, points);
            console.log(localStorage)
            lockGame=true;
        }
        if (secondsTakenByPlayer > 179 && alreadyStored){
            clearInterval(intervalo);
            alreadyStored = false;
            let points = calculatePoints();
            localStorage.setItem(currentPlayer, points);
            lockGame=true;
        }
    }
    else {
        clearInterval(intervalo);
        alreadyStored = false;
        let points = calculatePoints();
            localStorage.setItem(currentPlayer, points);
        lockGame = true;
    }
}

function timer() {
    if(!lockGame){
        intervalo = setInterval(actualizarTimer, 1000);
        if (counter > 7 && alreadyStored){
            clearInterval(intervalo);
            alreadyStored = false;
            let points = calculatePoints();
            localStorage.setItem(currentPlayer, points);
            console.log(localStorage);
            lockGame=true;
        } 
        else if (secondsTakenByPlayer > 179 && alreadyStored){
            clearInterval(intervalo);
            alreadyStored = false;
            let points = calculatePoints();
            localStorage.setItem(currentPlayer, points);
            lockGame = true;
        }
    }
}

(function shuffle() {
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * 16);
      card.style.order = randomPos;
    });
  }());

button.addEventListener('click', () => {
    currentPlayer = input.value;
    if (input != ""){
        lockGame = false;
        timer();
    }
    document.getElementById('CuentaRegresiva').innerHTML = 'Su juego empieza ahora!';

    
})

restart.addEventListener('click', ()=>{
    seReinicio = true;
    secondsTakenByPlayer=0;
    seconds=0;
    minutes=0;
    counter =0;
    resetBoard();
    seReinicio = false;
    
})

function flipCard() {
    if (!lockGame){
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
    document.getElementById("contador").innerHTML = "Puntaje: " + counter; 
    }

  else {
    unflipCards();
  }
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
  firstC = null;
  secondC = null;
}


cards.forEach(card => card.addEventListener('click', flipCard));

