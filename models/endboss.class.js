class Endboss extends MovableObject {
  y = 70;
  height = 400;
  width = 200;
  maxEnergy = 100;
  energy = this.maxEnergy;
  dead = false;
  state = "hidden";
  animationInterval = null;
  movementInterval = null;
  stateTransitionTimeouts = [];
  deathTimeout = null;
  onDeath = null;
  alertDuration = 1200;
  attackDuration = 1800;
  hurtDuration = 600;
  postHurtAlertDuration = 1400;
  deathRemovalDelay = 1800;

  images_walk = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  images_alert = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  images_attack = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  images_hurt = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  images_dead = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super();
    this.loadImage(this.images_walk[0]);
    this.loadImages(this.images_walk);
    this.loadImages(this.images_alert);
    this.loadImages(this.images_attack);
    this.loadImages(this.images_hurt);
    this.loadImages(this.images_dead);
  }

  startEncounter({ targetX, onAttackStart, onAttackComplete } = {}) {
    this.dead = false;
    this.clearStateTransitions();
    this.stopMovement();
    this.stopAnimation();
    if (this.deathTimeout) {
      clearTimeout(this.deathTimeout);
      this.deathTimeout = null;
    }
    this.energy = this.maxEnergy;
    this.x = targetX + 400;
    this.setState("entering");
    this.moveTo(targetX, 4, () => {
      this.setState("alert");
      this.queueStateTransition("attack", this.alertDuration, () => {
        if (typeof onAttackStart === "function") {
          onAttackStart();
        }
        this.queueStateTransition("alert", this.attackDuration, () => {
          if (typeof onAttackComplete === "function") {
            onAttackComplete();
          }
        });
      });
    });
  }

  queueStateTransition(state, delay, callback) {
    const timeoutId = setTimeout(() => {
      this.stateTransitionTimeouts = this.stateTransitionTimeouts.filter((id) => id !== timeoutId);
      if (this.dead) {
        return;
      }
      this.setState(state);
      if (typeof callback === "function") {
        callback();
      }
    }, delay);
    this.stateTransitionTimeouts.push(timeoutId);
    return timeoutId;
  }

  clearStateTransitions() {
    this.stateTransitionTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.stateTransitionTimeouts = [];
  }

  moveTo(targetX, speed = 2, onComplete) {
    this.stopMovement();
    this.speed = speed;
    this.movementInterval = setInterval(() => {
      if (this.dead) {
        this.stopMovement();
        return;
      }
      if (this.x <= targetX) {
        this.x = targetX;
        this.stopMovement();
        if (typeof onComplete === "function") {
          onComplete();
        }
        return;
      }
      this.moveLeft();
    }, 1000 / 60);
  }

  stopMovement() {
    if (this.movementInterval) {
      clearInterval(this.movementInterval);
      this.movementInterval = null;
    }
  }

  setAnimation(images, frameInterval = 200, loop = true) {
    this.stopAnimation();
    if (!images || !images.length) {
      return;
    }
    this.currentImage = 0;
    this.img = this.imageCache[images[0]];
    if (loop) {
      this.animationInterval = setInterval(() => {
        this.playAnimation(images);
      }, frameInterval);
    } else {
      let index = 0;
      this.animationInterval = setInterval(() => {
        index++;
        if (index >= images.length) {
          this.stopAnimation();
          return;
        }
        this.img = this.imageCache[images[index]];
      }, frameInterval);
    }
  }

  stopAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  setState(state) {
    if (this.state === state) {
      return;
    }
    this.state = state;
    switch (state) {
      case "entering":
      case "walk":
        this.setAnimation(this.images_walk, 150);
        break;
      case "alert":
        this.setAnimation(this.images_alert, 180);
        break;
      case "attack":
        this.setAnimation(this.images_attack, 150);
        break;
      case "hurt":
        this.setAnimation(this.images_hurt, 180);
        break;
      case "dead":
        this.stopMovement();
        this.clearStateTransitions();
        this.setAnimation(this.images_dead, 220, false);
        this.scheduleDeathRemoval();
        break;
      default:
        break;
    }
  }

  scheduleDeathRemoval() {
    if (this.deathTimeout) {
      clearTimeout(this.deathTimeout);
    }
    this.deathTimeout = setTimeout(() => {
      this.deathTimeout = null;
      if (typeof this.onDeath === "function") {
        this.onDeath();
      }
    }, this.deathRemovalDelay);
  }

  setDeathCallback(callback) {
    this.onDeath = callback;
  }

  takeDamage(amount = 20) {
    if (this.dead || this.state === "hidden") {
      return;
    }
    this.energy = Math.max(0, this.energy - amount);
    if (this.energy <= 0) {
      this.dead = true;
      this.setState("dead");
      return;
    }
    this.clearStateTransitions();
    this.setState("hurt");
    this.queueStateTransition("alert", this.hurtDuration);
  }
}
