class Bottle extends DrawableObject {
  static BASE_X = 200; // start offset
  static GAP_X = 250; // bottle spacing
  static RANDOM_OFFSET_X = 120; // random spread

  y = 370;
  height = 60;
  width = 80;
  image_bottle = ["img/6_salsa_bottle/1_salsa_bottle_on_ground.png", "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"];

  constructor(index = 0) {
    super();
    this.loadImages(this.image_bottle);
    const selectedImage = this.image_bottle[Math.floor(Math.random() * this.image_bottle.length)];
    this.loadImage(selectedImage);

    const randomOffset = Math.random() * Bottle.RANDOM_OFFSET_X; // spread range
    this.x = Bottle.BASE_X + index * Bottle.GAP_X + randomOffset; // position offset
  }
}
