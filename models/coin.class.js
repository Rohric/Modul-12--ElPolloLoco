class Coin extends DrawableObject {
  static BASE_X = 200; // start offset
  static GAP_X = 250; // coin spacing
  static RANDOM_OFFSET_X = 120; // random spread

  y = 370;
  height = 60;
  width = 80;
  image_coin = ["img/8_coin/coin_1.png"];

  constructor(index = 0) {
    super().loadImage("img/8_coin/coin_1.png");

    const randomOffset = Math.random() * Coin.RANDOM_OFFSET_X; // spread range
    this.x = Coin.BASE_X + index * Coin.GAP_X + randomOffset; // position offset
  }
}
