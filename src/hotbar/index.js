const { BLOCKS_MAP } = require('../constants');
const HOTBAR_ICON_PADDING = 2;
const hotbarWidth = (18 * 10);
const hotbarHeight = 16;
const hotbarX = () => (window.game.width - hotbarWidth) / 2
const hotbarY = () => window.game.height - hotbarHeight - 8;


function _drawTextureIcon(blockId, xStart, yStart) {
  const { pixels, texmap, width, hotbar } = window.game;

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const texturePixel = texmap[x + (y+16) * 16 + blockId * 256 * 3];
      const count = hotbar.items[blockId];

      const CONTRAST = 255 * 192;
      const brightness = 255; // 255, 205, 155
      const light = brightness * 255 / CONTRAST;
      let r = ((texturePixel >> 16) & 0xff) * light;
      let g = ((texturePixel >> 8) & 0xff) * light;
      let b = (texturePixel & 0xff) * light;

      const pixelLocation = (xStart + x + (yStart + y) * width) * 4;
      if (!count) { // turn greyscale if no items collected
        const avg = (r + g + b) / 6;
        r = avg + (r/3);
        g = avg + (g/3);
        b = avg + (b/3);
      }

      pixels.data[pixelLocation + 0] = r;
      pixels.data[pixelLocation + 1] = g;
      pixels.data[pixelLocation + 2] = b;
    }
  }
}

function _drawNumber(num, x, y) {
  const { ctx } = window.game;

  if (num === Infinity) return;
  let safeNumber = num > 999 ? (num/1000|0)+'k' : num;
  ctx.font = "100 8px OCR A Std,Impact,monospace";
  ctx.strokeStyle = 'black';
  ctx.textAlign = 'right';
  ctx.lineWidth = 2;
  ctx.fillStyle = `#fff`;
  ctx.strokeText(safeNumber, x, y);
  ctx.fillText(safeNumber, x, y);
}

function drawIcons() {
  const { hotbar } = window.game;
  BLOCKS_MAP[hotbar.side].forEach((id, idx) => {  // eslint-disable-line no-extra-semi
    const hotbarIconIdx = hotbarX() + (16 + HOTBAR_ICON_PADDING) * idx
    _drawTextureIcon(id, hotbarIconIdx, hotbarY());
  });
}

function drawHotbarBorder() {
  const { ctx, hotbar } = window.game;

  // draw hotbar border
  const hotbarSelectedX = hotbarX() + (hotbar.selected * 18);
  ctx.lineWidth = 1;
  ctx.strokeStyle = `#fff`;
  ctx.strokeRect(hotbarSelectedX + 1, hotbarY() + 1, 14, hotbarHeight - 2);
  ctx.strokeStyle = `#000`;
  ctx.strokeRect(hotbarSelectedX, hotbarY(), 16, hotbarHeight);

  // _drawNumber('000', 70, 225)
}

function drawIconNumers() {
  const { hotbar } = window.game;
  const { item, side, selected } = hotbar;
  for(let i=0;i<10;i++){
    const hotbarIconIdx = hotbarX() + (16 + HOTBAR_ICON_PADDING) * i;
    const blockId = BLOCKS_MAP[side][i]; // get block id from currently selected hotbar item
    // const blockCount = hotbar.items[blockId];
    const count = hotbar.items[blockId];
    _drawNumber(count, hotbarIconIdx + 16, hotbarY() + 16)
  }
  // BLOCKS_MAP[hotbar.side].forEach((i,idx)=>{  // eslint-disable-line no-extra-semi
  // });

}

module.exports = {
  BLOCKS_MAP,
  drawIcons,
  drawHotbarBorder,
  drawIconNumers,
};
