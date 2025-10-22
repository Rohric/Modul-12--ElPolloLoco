class CollectableItem extends DrawableObject {
  static DEFAULT_BASE_X = 200;
  static DEFAULT_GAP_X = 250;
  static DEFAULT_RANDOM_OFFSET_X = 120;
  static DEFAULT_Y = 370;
  static DEFAULT_WIDTH = 80;
  static DEFAULT_HEIGHT = 60;

  constructor({
    index = 0,
    images = [],
    baseX,
    gapX,
    randomOffsetX,
    y,
    width,
    height,
  } = {}) {
    super();

    const resolvedWidth = width ?? this.constructor.WIDTH ?? CollectableItem.DEFAULT_WIDTH;
    const resolvedHeight = height ?? this.constructor.HEIGHT ?? CollectableItem.DEFAULT_HEIGHT;
    const resolvedY = y ?? this.constructor.Y ?? CollectableItem.DEFAULT_Y;

    this.width = resolvedWidth;
    this.height = resolvedHeight;
    this.y = resolvedY;

    this.loadImages(images);
    if (images.length > 0) {
      const selectedImage = images[Math.floor(Math.random() * images.length)];
      this.loadImage(selectedImage);
    }

    const resolvedBaseX = baseX ?? this.constructor.BASE_X ?? CollectableItem.DEFAULT_BASE_X;
    const resolvedGapX = gapX ?? this.constructor.GAP_X ?? CollectableItem.DEFAULT_GAP_X;
    const resolvedRandomOffset =
      randomOffsetX ?? this.constructor.RANDOM_OFFSET_X ?? CollectableItem.DEFAULT_RANDOM_OFFSET_X;

    const randomOffset = Math.random() * resolvedRandomOffset;
    this.x = resolvedBaseX + index * resolvedGapX + randomOffset;
  }

  static getInventoryItem(character, type) {
    if (!character || !character.inventory) {
      return null;
    }
    return character.inventory[type];
  }

  static canCollect(character, type) {
    const item = CollectableItem.getInventoryItem(character, type);
    if (!item) {
      return false;
    }
    return item.count < item.max;
  }

  static collect(character, type) {
    if (!CollectableItem.canCollect(character, type)) {
      return false;
    }
    character.inventory[type].count++;
    return true;
  }

  static canUse(character, type) {
    const item = CollectableItem.getInventoryItem(character, type);
    if (!item) {
      return false;
    }
    return item.count > 0;
  }

  static use(character, type) {
    if (!CollectableItem.canUse(character, type)) {
      return false;
    }
    character.inventory[type].count--;
    return true;
  }

  static inventoryPercentage(character, type) {
    const item = CollectableItem.getInventoryItem(character, type);
    if (!item || item.max === 0) {
      return 0;
    }
    return (item.count / item.max) * 100;
  }
}
