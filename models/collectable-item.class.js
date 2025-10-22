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
}
