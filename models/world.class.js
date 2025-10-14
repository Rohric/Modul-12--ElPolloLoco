class World {
  character = new Character();
  enemies = level1.enemies;
  clouds = level1.clouds;
  backgroundObjects = level1.backgroundObjects;

  canvas;
  ctx;
  keyboard;
  camera_x = -0;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects);

    this.addToMap(this.character);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.clouds);

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
      this.ctx.save();
      this.ctx.translate(MovableObject.width, 0);
      this.ctx.scale(-1, 1);
      MovableObject.x = MovableObject.x * -1;
    }

    this.ctx.drawImage(MovableObject.img, MovableObject.x, MovableObject.y, MovableObject.width, MovableObject.height);
    if (MovableObject.otherDirection) {
      MovableObject.x = MovableObject.x * -1;
      this.ctx.restore();
    }
  }
}
