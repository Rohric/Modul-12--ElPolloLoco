class Chicken extends MovableObject {
  y = 370;
  height = 60;
  width = 80;
  images_walking = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.images_walking);

    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.5;

    this.animate();
  }

  animate() {
    this.moveLeft();

    setInterval(() => {
      let intervall = this.currentImage % this.images_walking.length;
      let path = this.images_walking[intervall];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100);
  }
}
