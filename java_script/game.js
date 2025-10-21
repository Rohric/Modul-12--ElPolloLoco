let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  console.log("My Charakter is", world.character);
}

window.addEventListener("keydown", (event) => {
  if (event.keyCode == 32) {
    keyboard.SPACE = true;
  }

   if (event.keyCode == 37) {
    keyboard.LEFT = true;
  }

   if (event.keyCode == 38) {
    keyboard.UP = true;
  }

   if (event.keyCode == 39) {
    keyboard.RIGHT = true;
  }

   if (event.keyCode == 40) {
    keyboard.DOWN = true;
  }

   if (event.keyCode == 68) {
    keyboard.D = true;
  }

   if (event.keyCode == 80) {
    keyboard.P = true;
    startGame();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.keyCode == 32) {
    keyboard.SPACE = false;
  }

   if (event.keyCode == 37) {
    keyboard.LEFT = false;
  }

   if (event.keyCode == 38) {
    keyboard.UP = false;
  }

   if (event.keyCode == 39) {
    keyboard.RIGHT = false;
  }

   if (event.keyCode == 40) {
    keyboard.DOWN = false;
  }

    if (event.keyCode == 68) {
    keyboard.D = false;
  }

   if (event.keyCode == 80) {
    keyboard.P = false;
  }
});

function startGame() {
  const startScreen = document.getElementById("Startscreen");
  const gameContainer = document.getElementById("gameContainer");

    startScreen.classList.add("display_none");
    gameContainer.classList.remove("display_none");
    level1 = createLevel1();
  
  init();
}
