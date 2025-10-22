class ItemCoin extends CollectableItem {
  static BASE_X = 200;
  static GAP_X = 250;
  static RANDOM_OFFSET_X = 120;

  constructor(index = 0) {
    super({
      index,
      images: ["img/8_coin/coin_1.png"],
    });
  }
}
