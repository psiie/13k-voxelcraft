const movement = require("../movement");
const { render } = require("./render");
const utils = require('../utils');
let pid; // useful for pausing

function drawTextureIcon(textureIndex, xStart, yStart) {
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

function tick() {
  const { width, height, ctx, pixels } = window.game;
  window._tick += 1;

  movement.applyGravity();
  movement.calculateMovement();
  render();

  const hotbarWidth = (18 * 10);
  const hotbarHeight = 16 + 2;
  const hotbarX = (width - hotbarWidth) / 2
  const hotbarY = height - hotbarHeight - 8;
  
  // debug - display all blocks on screen
  utils.drawAllTextures();
  
  // draw hotbar icons
  ;[2,3,4,5,6,7,10,11,12,13].forEach((id, idx) => {  // eslint-disable-line no-extra-semi
    const hotbarIconIdx = hotbarX + 18 * idx
    drawTextureIcon(id, hotbarIconIdx, hotbarY);
  });

  // place buffer into canvas
  ctx.putImageData(pixels, 0, 0);

  // draw hotbar border
  // ctx.lineWidth = 1;
  // ctx.strokeStyle = "rgba(0,0,0,1)";
  // ctx.strokeRect(hotbarX, hotbarY, hotbarWidth, hotbarHeight);

}

/* on supported browsers, use requestAnimationFrame for optimizations */
let lastAnimatedTime = 0;
function checkAnimationFrameTime(time) {
  const { MAX_FPS } = window.game.CONST;
  const requiredTimeDiff = 1000 / MAX_FPS;
  const diff = time - lastAnimatedTime;

  if (diff < requiredTimeDiff) return requestAnimationFrame(checkAnimationFrameTime);

  tick();
  lastAnimatedTime = time;
  requestAnimationFrame(checkAnimationFrameTime);
}

function init() {
  window._tick = 0; // debug purposes

  const $fps = document.getElementById('fps');
  setInterval(() => {
    const fps = window._tick;
    window.game.fps = fps;
    $fps.innerText = fps.toString() + ' fps';
    window._tick = 0;
  }, 1000);

  if (!window.requestAnimationFrame) setInterval(tick, 1000 / 100);
  else requestAnimationFrame(checkAnimationFrameTime);
}

module.exports = {
  init,
}
