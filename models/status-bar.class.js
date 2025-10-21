class StatusBar extends DrawableObject {
  percentage = 100;

  constructor({ images = [], x = 10, y = 0, width = 200, height = 60, initialPercentage = 100 } = {}) {
    super();
    this.images = images;
    if (this.images.length) {
      this.loadImages(this.images);
    }
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.setPercentage(initialPercentage);
  }

  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(percentage, 100));
    if (!this.images.length) {
      return;
    }
    const path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage >= 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    }
    return 0;
  }
}
