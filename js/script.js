/*
This game lets you play Tic-tac-toe with another player offline. The starting player is randomized.
*/

!function() {
const mainDiv = document.querySelector('div');
const mainHeader = mainDiv.querySelector('header');
const lists = mainDiv.querySelectorAll('ul');

// Array.from converts the nodelist into an array
// so that array methods can be used on it
let boxes = Array.from(mainDiv.querySelectorAll('.box'));
const player1 = mainHeader.querySelector('#player1');
const player2 = mainHeader.querySelector('#player2');
let button = mainHeader.querySelector('.button');

function createElement(elementName, className, textContent, href) {
  const element = document.createElement(elementName);
  element.href = href;
  element.className = className;
  element.textContent = textContent;
  return element;
}

// Creates/removes the required html to change the screen
// based on the screen name (start, board, or finish)
function changeScreens(screenName, winner, endMessage) {
  const message = mainHeader.querySelector('.message');
  if (screenName === 'start') {
    mainDiv.className = 'screen screen-start';
    button = createElement('a', 'button', 'Start Game', '#');
    mainDiv.removeChild(lists[1]);
    mainHeader.removeChild(lists[0]);
    mainHeader.appendChild(button);
  } else if (screenName === 'board') {
    mainDiv.className = 'board';
    mainDiv.appendChild(lists[1]);
    mainHeader.appendChild(lists[0]);
    mainHeader.removeChild(button);
    if (mainDiv.id === 'finish') {
      mainHeader.removeChild(message);
    }
  } else if (screenName === 'finish') {
    const message = createElement('p', 'message', endMessage);
    button = createElement('a', 'button', 'New Game', '#');
    mainDiv.className = `screen screen-win screen-win-${winner}`;
    mainHeader.appendChild(message);
    mainDiv.removeChild(lists[1]);
    mainHeader.removeChild(lists[0]);
    mainHeader.appendChild(button);
  }
  mainDiv.id = screenName;
}

// Adds functionality to the start button
function startButton() {
  button.addEventListener('click', () => {
    changeScreens('board');
    startGame();
    takeTurn();
  });
}

// Makes sure the boxes are empty and chooses who goes first
function startGame() {
  win = false;

  // Makes sure a box isn't already selected
  boxes = Array.from(lists[1].querySelectorAll('.box')).map(box => box.className = 'box');

  // Makes sure a player isn't already selected
  Array.from(lists[0].querySelectorAll('li')).forEach(li => li.className = 'players');

  // Randomly selects who goes first
  const firstTurn = Math.floor(Math.random() * 2);
  if (firstTurn === 0) {
    player1.classList.add('active');
  } else if (firstTurn === 1) {
    player2.classList.add('active');
  }
}

// Adds functionality to the boxes based on the active player
function takeTurn() {
  const player = mainHeader.querySelector('.active');
  boxes = Array.from(mainDiv.querySelectorAll('.box'));
  if (player === player1) {
    selectBox('o', '1');
  } else if (player === player2) {
    selectBox('x', '2');
  }
}

// Adds event listeners to the boxes
function selectBox(playerSymbol, playerNumber) {
  boxes.forEach(box => {
    // Only adds event listeners to the unselected boxes
    if (!box.className.includes('box-filled')) {

      // Makes the player's symbol (x or o) appear
      // when the mouse hovers over a box
      box.addEventListener('mouseover', () => {
        box.style.backgroundImage = `url(img/${playerSymbol}.svg)`;
      });

      // Makes the player's symbol disappear
      // when the mouse leaves the box
      box.addEventListener('mouseleave', () => {
        box.style.backgroundImage = '';
      });

      // Ends the turn and checks if anybody won
      box.addEventListener('click', () => {
        box.style.backgroundImage = '';
        box.classList.add(`box-filled-${playerNumber}`);
        turnEnd(playerNumber);
        const win = checkWin();

        // Stores all the unselected boxes in remainingBoxes,
        // which is used for checking for a tie
        const remainingBoxes = boxes.filter(box => box.className === 'box');

        // Starts the next players turn if the game hasn't ended
        if (win === false && remainingBoxes.length != 0) {
          takeTurn();

          // Changes the screen to the "finish" screen depending
          // on if someone won or if it was a tie
        } else {
          if (win === true) {
            if (playerNumber === '1') {
              changeScreens('finish', 'one', 'Winner');
            } else if (playerNumber === '2') {
              changeScreens('finish', 'two', 'Winner');
            }
          } else if (remainingBoxes.length === 0) {
            changeScreens('finish', 'tie', "It's a Tie!")
          }

          // Sets the "New Game" button to start the game
          startButton();
        }
      });
    }
  });
}

function turnEnd(playerNumber) {

  // Replaces each box with a copy of itself
  // without the event listeners
  boxes.forEach(box => {
    newBox = box.cloneNode(true);
    box.parentNode.replaceChild(newBox, box);
  })

  // Changes which player is active
  if (playerNumber === '1') {
    player1.classList.remove('active');
    player2.classList.add('active');
  } else if (playerNumber === '2') {
    player2.classList.remove('active');
    player1.classList.add('active');
  }
}

// Checks every winning possibility to see if someone won
function checkWin() {
  if (boxes[0].className.includes('box-filled') && boxes[0].className === boxes[1].className && boxes[1].className === boxes[2].className ||
      boxes[3].className.includes('box-filled') && boxes[3].className === boxes[4].className && boxes[4].className === boxes[5].className ||
      boxes[6].className.includes('box-filled') && boxes[6].className === boxes[7].className && boxes[7].className === boxes[8].className ||
      boxes[0].className.includes('box-filled') && boxes[0].className === boxes[3].className && boxes[3].className === boxes[6].className ||
      boxes[1].className.includes('box-filled') && boxes[1].className === boxes[4].className && boxes[4].className === boxes[7].className ||
      boxes[2].className.includes('box-filled') && boxes[2].className === boxes[5].className && boxes[5].className === boxes[8].className ||
      boxes[0].className.includes('box-filled') && boxes[0].className === boxes[4].className && boxes[4].className === boxes[8].className ||
      boxes[2].className.includes('box-filled') && boxes[2].className === boxes[4].className && boxes[4].className === boxes[6].className) {
    win = true;
  }
  return win;
}

// Changes screens to the "start" screen and adds functionality to the "Start Game" button
changeScreens('start');
startButton();
}();
