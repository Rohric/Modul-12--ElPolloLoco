class MovableObject {
  x = 120;
  y = 280;
  img;
  width = 100;
  height = 150;
  imageCache = [];
  currentImage = 0;
  speed = 0.15;

  speedY = 0;
  acceleration = 2.5;

  otherDirection = false;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround()) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 180;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(images) {
    let intervall = this.currentImage % this.images_walking.length;
    let path = images[intervall];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    console.log("Moving right");
  }
  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
