class Cloud extends MovableObject {
  static BASE_X = 300;
  static GAP_X = 400;
  static RANDOM_OFFSET_X = 200;

  y = 50;
  width = 500;
  height = 250;

  constructor(index = 0) {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    const randomOffset = Math.random() * Cloud.RANDOM_OFFSET_X;
    this.x = Cloud.BASE_X + index * Cloud.GAP_X + randomOffset;
    this.speed = 0.1 + Math.random() * 0.2;

    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
