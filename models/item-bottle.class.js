class ItemBottle extends CollectableItem {
  static BASE_X = 200;
  static GAP_X = 250;
  static RANDOM_OFFSET_X = 120;

  constructor(index = 0) {
    super({
      index,
      images: [
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
      ],
    });
  }
}
