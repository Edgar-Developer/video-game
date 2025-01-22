const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btUp = document.querySelector('.up')
const btLeft = document.querySelector('.left')
const btRigth = document.querySelector('.right')
const btDown = document.querySelector('.down')
const ColorP = document.querySelector('.vidasP')
const spanLives = document.querySelector('#lives')
const spanTime = document.querySelector('#time')
const spanRecord = document.querySelector('#record')
const pResult = document.querySelector('#result')

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerJugador = {
  x: undefined,
  y: undefined,
}
const colisionPlayer = {
  x: undefined,
  y: undefined,
}

let enemyPositions = [];

function setCanvasSize() {
  
  if(window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth.toFixed(0) * 0.7;
  } else {
    canvasSize = window.innerHeight.toFixed(0) * 0.7;
  }

  canvasSize = parseInt(canvasSize);
  
  canvas.setAttribute('Width',canvasSize);
  canvas.setAttribute('Height',canvasSize);

  elementsSize = parseInt(canvasSize / 10);
  console.log({elementsSize,canvasSize});

  playerJugador.x = undefined;
  playerJugador.y = undefined;
  startGame()
}

function startGame() {

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'center';

  const map = maps[level];

  if (!map) {
    gameWin();
    return
  }

  if(!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  
  const mapRows = map.trim().split('\n');
  const mapCols = mapRows.map(row => row.trim().split(''));
  
  showLives();
  
  enemyPositions = [];
  game.clearRect(0,0,canvasSize,canvasSize)
  
  mapCols.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colIndex + 1);
      const posY = elementsSize * (rowIndex + 1);
      
      if (col === 'O') {
        if (!playerJugador.x && !playerJugador.y) {
          playerJugador.x = posX;
          playerJugador.y = posY;
          console.log({playerJugador});
        }
      } else if (col === 'I') {
        colisionPlayer.x = posX;
        colisionPlayer.y = posY;
      } else if (col === 'X') {
        enemyPositions.push({
          x: posX,
          y: posY, 
        })
      }       
      game.fillText(emoji, posX, posY);
    });
  });  
  
  // for (let x_row = 1; x_row <= 10; x_row++) {
  //   // game.fillText(emojis['X'], elementsSize * x_row, elementsSize)  
  //   console.log(x_row);
      
  //   for (let y_col = 1; y_col <= 10; y_col++) {
  //     game.fillText(emojis[mapCols[x_row - 1][y_col - 1]], elementsSize * y_col, elementsSize * x_row)    
  //     console.log(y_col);      
  //   }    
  // } 
  moverPlayer()
}

function moverPlayer() {
  const colisionX = playerJugador.x.toFixed(3) == colisionPlayer.x.toFixed(3);
  const colisionY = playerJugador.y.toFixed(3) == colisionPlayer.y.toFixed(3);
  const colisionRegalito = colisionX && colisionY; 

  if (colisionRegalito) {    
    levelWin();     
  }

  const enemyCollision = enemyPositions.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(3) === playerJugador.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) === playerJugador.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  })

  if (enemyCollision) {
    levelFail();    
  }

  game.fillText(emojis['PLAYER'], playerJugador.x, playerJugador.y)
}

function levelWin() {
  console.log('pasaste de nivel')
  level++;
  startGame();
}

function gameWin() {
  console.log('terminaste el juego');
  clearInterval(timeInterval); 
  
  const recordTime = localStorage.getItem('record_time');
  const timePlayer = Date.now() - timeStart;

  if (recordTime) {
    if (recordTime >= timePlayer) {
      localStorage.setItem('record_time', timePlayer);
      pResult.innerHTML = 'Superaste el Record 🏆';
    } else {
      pResult.innerHTML = 'lo siento, no superaste el records 😥';
    } 
  } else {
    localStorage.setItem('record_time', timePlayer);
    pResult.innerHTML = 'Primera vez? Muy bien, pero ahora trata de superar tu tiempo :)';
  }
}

function levelFail() {
  lives--;
  console.log(lives);
  

  if (lives <= 0) {
    level = 0;
    lives = 3;
    ColorP.classList.toggle('vidasN')
    timeStart = undefined;
  } 
  playerJugador.x = undefined;
  playerJugador.y = undefined;
  startGame();
}

function showLives() {
  const contarLives = Array(lives).fill(emojis['HEART']);  

  spanLives.innerHTML = '';
  contarLives.forEach(heart => spanLives.append(heart));
}

function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveKeyTecla);
btUp.addEventListener('click', moveJugadorUp);
btLeft.addEventListener('click', moveJugadorLeft);
btRigth.addEventListener('click', moveJugadorRight);
btDown.addEventListener('click', moveJugadorDown);

function moveKeyTecla(event) {
  if (event.code === 'ArrowUp') {
    moveJugadorUp();
  }  
  else if (event.code === 'ArrowLeft') {
    moveJugadorLeft();
  }  
  else if (event.code === 'ArrowRight') {
    moveJugadorRight();
  }  
  else if (event.code === 'ArrowDown') {
    moveJugadorDown();
  } 
}

// window.addEventListener('keydown', (event) => {
//   const tecla = event.code

//   switch (tecla) {
//     case 'ArrowUp':
//       moveJugadorUp()     
//       break;

//     case 'ArrowLeft':
//       moveJugadorLeft()
//       break;

//     case 'ArrowRight':
//       moveJugadorRight()
//       break;

//     case 'ArrowDown':
//       moveJugadorDown()
//       break;  

//     default:
//       break;
//   }

// });

 
function moveJugadorUp() {
  console.log('se quiere move al jugador hacia arriba');

  if ((playerJugador.y - elementsSize) < elementsSize) {
    console.log('OUT');
} else {
  playerJugador.y -= elementsSize  
  startGame()
}
}

function moveJugadorLeft() {
  console.log('se quiere move al jugador hacia izquierda');  
  
  if ((playerJugador.x - elementsSize) < elementsSize) {
    console.log('OUT');
} else {
  playerJugador.x -= elementsSize 
  startGame()
}
}

function moveJugadorRight() {
  console.log('se quiere move al jugador hacia derecha');
  
  if ((playerJugador.x + elementsSize) > canvasSize) {
    console.log('OUT');
} else {
  playerJugador.x += elementsSize 
  startGame()  
}
}

function moveJugadorDown() {
  console.log('se quiere move al jugador hacia abajo'); 
  
  if ((playerJugador.y + elementsSize) > canvasSize) {
    console.log('OUT');
} else {
  playerJugador.y += elementsSize 
  startGame()
}
}

