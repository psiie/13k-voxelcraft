
import intervalSecond from '../engine/interval';

let isInside = false;
let isInsideDebounce = false;
let debounceLogging = false;

const canvas = document.querySelector('#game');

intervalSecond(() => {
  isInsideDebounce = false;
});

function dlog() {
  if (debounceLogging) return;

  debounceLogging = true;
  console.log.apply(this, arguments); // eslint-disable-line no-console
  setTimeout(() => debounceLogging = false, 500);
}

function tryCatch(fn) {
  let out = null;

  try {
    out = fn();
  } catch(e) {
    out = null;
  }
  
  return out;
}

function drawAllTextures() {
  const { pixels, texmap, width } = window.game;

  for (let i=0; i<21; i++) {
    for (let y = 0; y < 16 * 3; y++) {
      for (let x = 0; x < 16; x++) {
        const texturePixel = texmap[x + y * 16 + i * 256 * 3];
  
        const CONTRAST = 255 * 192;
        const brightness = 255; // 255, 205, 155
        const light = brightness * 255 / CONTRAST;
        let r = ((texturePixel >> 16) & 0xff) * light;
        let g = ((texturePixel >> 8) & 0xff) * light;
        let b = (texturePixel & 0xff) * light;
        

        const blockSelect = i * 16;
        let xLocation = blockSelect + x;
        let yLocation = width * y;

        if (i > 16) {
          xLocation -= 272;
          yLocation = width * (y + 48);
        }

        const pixelLocation = (xLocation + yLocation) * 4;
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
  if (x > 255 || y > 255 || z > 255) return;
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

function getCanvas() {
  return canvas;
}

module.exports = {
  dlog: /*@__PURE__*/ dlog, // pure b/c it can be pruned. is not pure though
  drawAllTextures,
  getBlock: /*@__PURE__*/ getBlock,
  setBlock,
  isInsideCheck: /*@__PURE__*/ isInsideCheck,
  calcArcFromLength: /*@__PURE__*/ calcArcFromLength,
  tryCatch: /*@__PURE__*/ tryCatch,
  getCanvas: /*@__PURE__*/ getCanvas,
};
