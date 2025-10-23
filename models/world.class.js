class World {
  character = new Character();
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = -0;
  statusBar = new StatusBar_Health();
  statusBar_Bottle = new StatusBar_Bottle();
  statusBar_Coin = new StatusBar_Coin();
  statusBar_Endboss = new StatusBar_Endboss();
  throwableObjects = [];
  bossStatusBarVisible = false;
  endboss = null;
  bossEncounterTriggered = false;
  bossTriggerX = null;
  bossTargetX = null;
  originalLevelEndX = null;
  bossWaveTimeouts = [];

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.statusBar_Endboss.setPercentage(0);
    this.originalLevelEndX = this.level.level_end_x;
    this.bossTriggerX = this.originalLevelEndX - 150;
    this.bossTargetX = this.originalLevelEndX - 20;
    this.level.level_end_x = this.bossTriggerX;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkBossEncounter();
      this.checkCollisions();
      this.checkCollectables();
      this.checkThrowObjects();
      this.checkBottleCollisions();
    }, 200);
  }

  checkBossEncounter() {
    if (this.bossEncounterTriggered) {
      return;
    }
    const characterFront = this.character.x + this.character.width;
    if (characterFront >= this.bossTriggerX) {
      this.triggerBossEncounter();
    }
  }

  triggerBossEncounter() {
    this.bossEncounterTriggered = true;
    this.bossStatusBarVisible = true;
    this.statusBar_Endboss.setPercentage(100);
    this.endboss = new Endboss();
    this.endboss.setDeathCallback(() => this.handleBossDeath());
    this.level.enemies.push(this.endboss);
    this.endboss.startEncounter({
      targetX: this.bossTargetX,
      onAttackStart: () => this.spawnBossWave(),
    });
  }

  spawnBossWave() {
    this.clearBossWaveTimeouts();
    const waveCount = 10;
    const spawnBaseX = this.bossTargetX + 120;
    for (let i = 0; i < waveCount; i++) {
      const timeoutId = setTimeout(() => {
        const chicken = new Chicken();
        chicken.x = spawnBaseX + i * 80 + Math.random() * 60;
        chicken.speed = 0.3 + Math.random() * 0.5;
        this.level.enemies.push(chicken);
      }, i * 250);
      this.bossWaveTimeouts.push(timeoutId);
    }
  }

  clearBossWaveTimeouts() {
    this.bossWaveTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.bossWaveTimeouts = [];
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.character.canUse("bottle")) {
      if (this.character.use("bottle")) {
        const direction = this.character.otherDirection ? -1 : 1;
        const offsetX = direction === 1 ? this.character.x + this.character.width : this.character.x;
        const offsetY = this.character.y + this.character.height / 2;
        let bottle = new ThrowablaObject(offsetX, offsetY, direction);
        bottle.otherDirection = direction === -1;
        this.throwableObjects.push(bottle);
        this.statusBar_Bottle.setPercentage(this.character.inventoryPercentage("bottle"));
      }
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => this.handleEnemyCollision(enemy));
  }

  handleEnemyCollision(enemy) {
    if (!enemy || enemy.dead) {
      return;
    }
    if (!this.character.isColliding(enemy)) {
      return;
    }
    if (this.canStomp(enemy) && this.character.isFallingOn(enemy)) {
      this.stompEnemy(enemy);
      return;
    }
    this.characterHit(enemy);
  }

  canStomp(enemy) {
    return typeof enemy.die === "function";
  }

  stompEnemy(enemy) {
    enemy.die();
    this.bounceOffEnemy(enemy);
    this.scheduleEnemyRemoval(enemy);
  }

  bounceOffEnemy(enemy) {
    this.character.speedY = 20;
    this.character.y = enemy.y - this.character.height;
  }

  scheduleEnemyRemoval(enemy, delay = 200) {
    setTimeout(() => {
      this.level.enemies = this.level.enemies.filter((currentEnemy) => currentEnemy !== enemy);
    }, delay);
  }

  characterHit(enemy) {
    this.character.hit(enemy);
    this.statusBar.setPercentage(this.character.energy);
    console.log("collision with Character, enery", this.character.energy);
  }

  checkCollectables() {
    this.collectBottles();
    this.collectCoins();
  }

  collectBottles() {
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (this.character.isColliding(bottle) && this.character.collect("bottle")) {
        this.statusBar_Bottle.setPercentage(this.character.inventoryPercentage("bottle"));
        return false;
      }
      return true;
    });
  }

  collectCoins() {
    this.level.coins = this.level.coins.filter((coin) => {
      if (this.character.isColliding(coin) && this.character.collect("coin")) {
        this.statusBar_Coin.setPercentage(this.character.inventoryPercentage("coin"));
        return false;
      }
      return true;
    });
  }

  checkBottleCollisions() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => {
      let hasHit = false;
      this.level.enemies.forEach((enemy) => {
        if (hasHit || !enemy || enemy.dead) {
          return;
        }
        if (bottle.isColliding(enemy)) {
          bottle.stop();
          hasHit = true;
          if (enemy instanceof Endboss) {
            enemy.takeDamage(25);
            this.updateBossHealthBar(enemy);
          } else if (typeof enemy.die === "function") {
            enemy.die();
            setTimeout(() => {
              this.level.enemies = this.level.enemies.filter((currentEnemy) => currentEnemy !== enemy);
            }, 400);
          } else if (typeof enemy.hit === "function") {
            enemy.hit();
          }
        }
      });
      return !hasHit;
    });
  }

  updateBossHealthBar(boss) {
    if (!this.bossStatusBarVisible || !boss) {
      return;
    }
    const percentage = (boss.energy / boss.maxEnergy) * 100;
    this.statusBar_Endboss.setPercentage(percentage);
  }

  handleBossDeath() {
    if (!this.endboss) {
      return;
    }
    this.clearBossWaveTimeouts();
    this.bossStatusBarVisible = false;
    this.statusBar_Endboss.setPercentage(0);
    const defeatedBoss = this.endboss;
    this.level.enemies = this.level.enemies.filter((enemy) => enemy !== defeatedBoss);
    this.endboss = null;
    this.level.level_end_x = this.originalLevelEndX;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar_Bottle);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar_Coin);
    this.ctx.translate(this.camera_x, 0);

    if (this.bossStatusBarVisible) {
      this.ctx.translate(-this.camera_x, 0);
      this.addToMap(this.statusBar_Endboss);
      this.ctx.translate(this.camera_x, 0);
    }

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(MovableObject) {
    if (MovableObject.otherDirection) {
      this.flipImage(MovableObject);
    }
    MovableObject.draw(this.ctx);
    // Rotes quadrat für die kollisionsrechnung
    MovableObject.drawFrame(this.ctx);

    if (MovableObject.otherDirection) {
      this.flipImageBack(MovableObject);
    }
  }

  flipImage(MovableObject) {
    this.ctx.save();
    this.ctx.translate(MovableObject.width, 0);
    this.ctx.scale(-1, 1);
    MovableObject.x = MovableObject.x * -1;
  }

  flipImageBack(MovableObject) {
    MovableObject.x = MovableObject.x * -1;
    this.ctx.restore();
  }
}
