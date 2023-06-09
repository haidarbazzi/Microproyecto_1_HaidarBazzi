const cards = document.querySelectorAll('.memory-card'); /*Almacenamos en un array todas las cartas */
const button = document.getElementById('nameButton');
const input = document.getElementById('nameInput');
const restart = document.getElementById('restartButton');
const namesBef = [];
const namesAft = [];

/* Declaracion de variables */
let tableBefore = "", tableAfter = "";
let encabezadoTabla =`<tr>
<th>
    Numero
</th>
<th>
    Nombre
</th>
<th>
    Puntaje
</th>
</tr>`

let hasFlippedCard = false , lockBoard = false, hasEnteredName = false;
let firstC, secondC, intervalo, currentPlayer; 
let counter = 0, minutes = 0, seconds = 0, secondsTakenByPlayer = 0;
const totalSeconds = 180;
let alreadyStored = true, lockGame = true, WasClicked = true;

function FinishResults(){
    clearInterval(intervalo);
    alreadyStored = false;
    let points = calculatePoints();
    SetCurrentScore(currentPlayer, points);
    localStorage.setItem(currentPlayer, points);
    retrieveInfo(namesAft, tableAfter);
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

function retrieveInfo(names, tabla){
    
    for (i = 0; i <localStorage.length ; i++){
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        let obj = {name: key, puntaje: value};
        names.push(obj);

    }
    names = BubbleSort(names);
    let table = document.getElementById('TablaP');
    tabla += encabezadoTabla;
    if(names.length < 11){

    for(let i = 0;i < names.length;i++){
        let x = i+1;
        let row = `<tr>
                        <td><b>${x}</b></td>
                        <td><b>${names[i].name}</b></td>
                        <td><b>${names[i].puntaje}</b></td>
                   </tr>`
        tabla += row;
    }
    } else{
        for(let i =0;i<10;i++){
            let x=i+1;
            let row = `<tr>
                            <td><b>${x}</b></td>
                            <td><b>${names[i].name}</b></td>
                            <td><b>${names[i].puntaje}</b></td>
                       </tr>`
            tabla += row;
    }
    }
    table.innerHTML = tabla;
}

retrieveInfo(namesBef, tableBefore);

function calculatePoints(){
    let timeLeft = 180 - secondsTakenByPlayer;
    let points = 8*(timeLeft/totalSeconds);
    points = Math.round((points + Number.EPSILON) * 100) / 100
    return points;
}

function actualizarTimer(){
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
    if(WasClicked){
    currentPlayer = input.value;
    if (!(typeof input.value === 'string' && input.value.length === 0)){
        document.getElementById('CuentaRegresiva').innerHTML = 'Su juego empieza ahora!';
        lockGame = false;
        WasClicked = false;
        timer();
    }
    }
    
    
    
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
    document.getElementById("contador").innerHTML = "Pares Hallados: " + counter; 
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

function SetCurrentScore(current, points){
    let actual = document.getElementById('UsuarioActual');
    actual.innerHTML += `<td>
                            <b>${current}</b>
                          </td>`;
    actual.innerHTML += `<td>
                            <b>${points}</b>
                          </td>`;
    
}

function resetBoard() {
  hasFlippedCard = false;
  lockBoard = false;
  firstC = null;
  secondC = null;
}

cards.forEach(card => card.addEventListener('click', flipCard));
