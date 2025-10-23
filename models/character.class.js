class Character extends MovableObject {
  height = 280;
  y = 80;
  speed = 10;

  images_idle = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  images_walking = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  images_jumping = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  images_dead = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  images_hurt = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];
  world;

  inventory = {
    bottle: { count: 0, max: 5 },
    coin: { count: 0, max: 5 },
  };

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.images_idle);
    this.loadImages(this.images_walking);
    this.loadImages(this.images_jumping);
    this.loadImages(this.images_dead);
    this.loadImages(this.images_hurt);

    this.animate();
    this.applyGravity();
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
        // this.walking_sound.play()
      }
      if (this.world.keyboard.LEFT && this.x > -600) {
        this.moveLeft();
        this.otherDirection = true;
        // this.walking_sound.play()
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.images_dead);
        return;
      }
      if (this.isHurt()) {
        this.playAnimation(this.images_hurt);
        return;
      }
      if (this.isAboveGround()) {
        this.playAnimation(this.images_jumping);
        return;
      }
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.images_walking);
        return;
      }
      this.playAnimation(this.images_idle);
    }, 100);
  }

  jump() {
    this.speedY = 30;
  }

  getInventoryItem(type) {
    return this.inventory[type];
  }

  canCollect(type) {
    const item = this.getInventoryItem(type);
    if (!item) {
      return false;
    }
    return item.count < item.max;
  }

  collect(type) {
    if (!this.canCollect(type)) {
      return false;
    }
    this.inventory[type].count++;
    return true;
  }

  canUse(type) {
    const item = this.getInventoryItem(type);
    if (!item) {
      return false;
    }
    return item.count > 0;
  }

  use(type) {
    if (!this.canUse(type)) {
      return false;
    }
    this.inventory[type].count--;
    return true;
  }

  inventoryPercentage(type) {
    const item = this.getInventoryItem(type);
    if (!item || item.max === 0) {
      return 0;
    }
    return (item.count / item.max) * 100;
  }

  isFallingOn(enemy) {
    if (!enemy || !this.isColliding(enemy)) {
      return false;
    }
    const characterBottom = this.y + this.height;
    const enemyTop = enemy.y;
    const overlap = characterBottom - enemyTop;
    const maxOverlap = enemy.height * 0.5;
    return this.speedY < 0 && overlap >= 0 && overlap <= maxOverlap;
  }
}
