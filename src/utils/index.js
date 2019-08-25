
import intervalSecond from '../engine/interval';

let isInside = false;
let isInsideDebounce = false;
let debounceLogging = false;

intervalSecond(() => {
  isInsideDebounce = false;
});

function dlog() {
  if (debounceLogging) return;

  debounceLogging = true;
  console.log.apply(this, arguments); // eslint-disable-line no-console
  setTimeout(() => debounceLogging = false, 500);
}

function drawAllTextures() {
  const { pixels, texmap, width } = window.game;

  for (let i=0; i<16; i++) {
    for (let y = 0; y < 16 * 3; y++) {
      for (let x = 0; x < 16; x++) {
        const texturePixel = texmap[x + y * 16 + i * 256 * 3];
  
        const CONTRAST = 255 * 192;
        const brightness = 255; // 255, 205, 155
        const light = brightness * 255 / CONTRAST;
        let r = ((texturePixel >> 16) & 0xff) * light;
        let g = ((texturePixel >> 8) & 0xff) * light;
        let b = (texturePixel & 0xff) * light;
  
        const pixelLocation = ((i * 16) + x + y * width) * 4;
        pixels.data[pixelLocation + 0] = r;
        pixels.data[pixelLocation + 1] = g;
        pixels.data[pixelLocation + 2] = b;
      }
    }
  }
}

function getBlock(x, y, z) {
  try{
    return window.game.map[x|0][y|0][z|0]
  } catch(e) {} // eslint-disable-line no-empty
}

function setBlock(x, y, z, block, map, notBlock) {
  map = map || window.game.map;
  try {
    if (map[x][y][z] !== notBlock) map[x][y][z] = block;
  } catch(e) {} // eslint-disable-line no-empty
}

function isInsideCheck() {
  if (isInsideDebounce) return isInside;
  isInsideDebounce = true;

  const { x, y, z } = window.game.player;
  for (let i=y; i>0; i--) {
    const block = getBlock(x, i, z);
    if (block !== 0 && block !== 8) return isInside = true;
  }

  return isInside = false;
}

function calcArcFromLength(step, length) {
  const half = length / 2;
  const slide = step - half;
  const inverse = half - Math.abs(slide);
  const percent = inverse / half;
  return percent;
}

module.exports = {
  dlog: /*@__PURE__*/ dlog, // pure b/c it can be pruned. is not pure though
  drawAllTextures,
  getBlock: /*@__PURE__*/ getBlock,
  setBlock,
  isInsideCheck: /*@__PURE__*/ isInsideCheck,
  calcArcFromLength: /*@__PURE__*/ calcArcFromLength,
};
