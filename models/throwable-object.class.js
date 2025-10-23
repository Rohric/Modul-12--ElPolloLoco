class ThrowablaObject extends MovableObject {
  throwInterval = null;
  direction = 1;
  speedX = 10;

  constructor(x, y, direction = 1) {
    super().loadImage("img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.direction = direction >= 0 ? 1 : -1;
    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      this.x += this.speedX * this.direction;
    }, 20);
  }

  stop() {
    if (this.throwInterval) {
      clearInterval(this.throwInterval);
      this.throwInterval = null;
    }
  }
}
