class World {
  character = new Character();
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = -0;
  statusBar = new StatusBar_Health();
  statusBar_Bottle = new StatusBar_Bottle();
  statusBar_Coin = new StatusBar_Coin();
  throwableObjects = [];

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkCollectables();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.character.canUse("bottle")) {
      if (this.character.use("bottle")) {
        let bottle = new ThrowablaObject(this.character.x + 100, this.character.y + 100);
        this.throwableObjects.push(bottle);
        this.statusBar_Bottle.setPercentage(this.character.inventoryPercentage("bottle"));
      }
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);

        console.log("collision with Character, enery", this.character.energy);
      }
    });
  }

  checkCollectables() {
    this.collectBottles();
    this.collectCoins();
  }

  collectBottles() {
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (this.character.isColliding(bottle) && this.character.collect("bottle")) {
        this.statusBar_Bottle.setPercentage(this.character.inventoryPercentage("bottle"));
        return false;
      }
      return true;
    });
  }

  collectCoins() {
    this.level.coins = this.level.coins.filter((coin) => {
      if (this.character.isColliding(coin) && this.character.collect("coin")) {
        this.statusBar_Coin.setPercentage(this.character.inventoryPercentage("coin"));
        return false;
      }
      return true;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar_Bottle);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar_Coin);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(MovableObject) {
    if (MovableObject.otherDirection) {
      this.flipImage(MovableObject);
    }
    MovableObject.draw(this.ctx);
    // Rotes quadrat für die kollisionsrechnung
    MovableObject.drawFrame(this.ctx);

    if (MovableObject.otherDirection) {
      this.flipImageBack(MovableObject);
    }
  }

  flipImage(MovableObject) {
    this.ctx.save();
    this.ctx.translate(MovableObject.width, 0);
    this.ctx.scale(-1, 1);
    MovableObject.x = MovableObject.x * -1;
  }

  flipImageBack(MovableObject) {
    MovableObject.x = MovableObject.x * -1;
    this.ctx.restore();
  }
}
