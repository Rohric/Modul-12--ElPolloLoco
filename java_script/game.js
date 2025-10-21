let canvas;
let world;
const keyboard = new Keyboard();
let gameStarted = false;

function setupGame() {
  canvas = document.getElementById("canvas");
  registerKeyboardEvents();
}

function startGame() {
  if (gameStarted) {
    return;
  }
  gameStarted = true;
  showGameScreen();
  world = new World(canvas, keyboard);
}

function showGameScreen() {
  const startScreen = document.getElementById("Startscreen");
  const gameContainer = document.getElementById("gameContainer");
  if (startScreen) {
    startScreen.classList.add("display_none");
  }
  if (gameContainer) {
    gameContainer.classList.remove("display_none");
  }
}

function registerKeyboardEvents() {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}

function handleKeyDown(event) {
  switch (event.keyCode) {
    case 32:
      keyboard.SPACE = true;
      break;
    case 37:
      keyboard.LEFT = true;
      break;
    case 38:
      keyboard.UP = true;
      break;
    case 39:
      keyboard.RIGHT = true;
      break;
    case 40:
      keyboard.DOWN = true;
      break;
    case 68:
      keyboard.D = true;
      break;
    case 80:
      keyboard.P = true;
      startGame();
      break;
  }
}

function handleKeyUp(event) {
  switch (event.keyCode) {
    case 32:
      keyboard.SPACE = false;
      break;
    case 37:
      keyboard.LEFT = false;
      break;
    case 38:
      keyboard.UP = false;
      break;
    case 39:
      keyboard.RIGHT = false;
      break;
    case 40:
      keyboard.DOWN = false;
      break;
    case 68:
      keyboard.D = false;
      break;
    case 80:
      keyboard.P = false;
      break;
  }
}
