
const HOTBAR_ICON_PADDING = 2;
const hotbarWidth = (18 * 10);
const hotbarHeight = 16;
const hotbarX = () => (window.game.width - hotbarWidth) / 2
const hotbarY = () => window.game.height - hotbarHeight - 8;
const BLOCKS_MAP = [
  [2,3,4,5,6,7,10,11,12,13],
  [13,12,11,10,7,6,5,4,3,2]
];

function _drawTextureIcon(textureIndex, xStart, yStart) {
  const { pixels, texmap, width } = window.game;

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const texturePixel = texmap[x + (y+16) * 16 + textureIndex * 256 * 3];

      const CONTRAST = 255 * 192;
      const brightness = 255; // 255, 205, 155
      const light = brightness * 255 / CONTRAST;
      let r = ((texturePixel >> 16) & 0xff) * light;
      let g = ((texturePixel >> 8) & 0xff) * light;
      let b = (texturePixel & 0xff) * light;

      const pixelLocation = (xStart + x + (yStart + y) * width) * 4;
      pixels.data[pixelLocation + 0] = r;
      pixels.data[pixelLocation + 1] = g;
      pixels.data[pixelLocation + 2] = b;
    }
  }
}

function drawIcons() {
  const { hotbarSide } = window.game;
  BLOCKS_MAP[hotbarSide].forEach((id, idx) => {  // eslint-disable-line no-extra-semi
    const hotbarIconIdx = hotbarX() + (16 + HOTBAR_ICON_PADDING) * idx
    _drawTextureIcon(id, hotbarIconIdx, hotbarY());
  });
}

function drawNumbers() {
  const { ctx, hotbarSelect } = window.game;

  // draw hotbar border
  const hotbarSelectedX = hotbarX() + (hotbarSelect * 18);
  ctx.lineWidth = 1;
  ctx.strokeStyle = `#fff`;
  ctx.strokeRect(hotbarSelectedX + 1, hotbarY() + 1, 14, hotbarHeight - 2);
  ctx.strokeStyle = `#000`;
  ctx.strokeRect(hotbarSelectedX, hotbarY(), 16, hotbarHeight);

  // draw hotbar numbers
  const drawNumber = (num, x, y) => {
    ctx.font = "100 8px OCR A Std,Impact,monospace";
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillStyle = `#fff`;
    ctx.strokeText(num, x, y);
    ctx.fillText(num, x, y);
  };

  drawNumber('01234567890123456789', 70, 225)
}

module.exports = {
  BLOCKS_MAP,
  drawIcons,
  drawNumbers,
};
