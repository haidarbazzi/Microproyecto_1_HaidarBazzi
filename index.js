const cards = document.querySelectorAll('.memory-card'); /*Almacenamos en un array todas las cartas */
const button = document.getElementById('nameButton');
const input = document.getElementById('nameInput');
const restart = document.getElementById('restartButton');
const namesBef = [];
const namesAft = [];


let minutes = 0;
let seconds = 0;

/* Declaracion de variables */

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


function FinishResults(){
    clearInterval(intervalo);
    alreadyStored = false;
    let points = calculatePoints();
    localStorage.setItem(currentPlayer, points);
    retrieveInfo(namesAft);
    lockGame=true;
}


function BubbleSort(arr){

    for(let i = 0; i < arr.length; i++){

        for(let j = 0; j < arr.length - i - 1; j++){

            if(arr[j + 1].puntaje > arr[j].puntaje){

                [arr[j + 1],arr[j]] = [arr[j],arr[j + 1]]
            }
        }
    };
    return arr;
};

function retrieveInfo(names){
    for (i = 0; i <localStorage.length ; i++){
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        let obj = {name: key, puntaje: value};
        names.push(obj);

    }
    names = BubbleSort(names);
    if(names.length < 6){
    for(i = 0; i<names.length;i++){
        document.getElementById(i).innerHTML = names[i].name;
        document.getElementById(i+"-points").innerHTML = names[i].puntaje
    }
    } else{
        for(i = 0; i < 5;i++){
            document.getElementById(i).innerHTML = names[i].name;
            document.getElementById(i+"-points").innerHTML = names[i].puntaje
    }
    }
    names = [];
}

retrieveInfo(namesBef)
console.log(localStorage)

function calculatePoints(){
    let timeLeft = 180 - secondsTakenByPlayer;
    let points = 8*(timeLeft/totalSeconds);
    return points;
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
            FinishResults();
        }
        if (secondsTakenByPlayer > 179 && alreadyStored){
            FinishResults();
        }
    }
    
}

function timer() {
    if(!lockGame){
        intervalo = setInterval(actualizarTimer, 1000);
        if (counter > 7 && alreadyStored){
            FinishResults();
        } 
        else if (secondsTakenByPlayer > 179 && alreadyStored){
            FinishResults();
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

