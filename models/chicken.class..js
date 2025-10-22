class Chicken extends MovableObject {
  static BASE_X = 400;
  static GAP_X = 350;
  static RANDOM_OFFSET_X = 150;

  y = 370;
  height = 60;
  width = 80;
  images_walking = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor(index = 0) {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.images_walking);

    const randomOffset = Math.random() * Chicken.RANDOM_OFFSET_X;
    this.x = Chicken.BASE_X + index * Chicken.GAP_X + randomOffset;
    this.speed = 0.15 + Math.random() * 0.5;

    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
    setInterval(() => {
      this.playAnimation(this.images_walking);
    }, 200);
  }
}
