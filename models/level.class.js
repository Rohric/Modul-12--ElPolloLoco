class Level {
  enemies;
  clouds;
  coins;
  backgroundObjects;
  level_end_x = 719 * 3;

  constructor(enemies, clouds, coins, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.coins = coins;
    this.backgroundObjects = backgroundObjects;
  }
}
