
let debounceLogging = false;
function dlog(msg) {
  function debounceLog(msg) {
    if (debounceLogging === false) {
      debounceLogging = true;
      console.log(msg);
      setTimeout(function() {
        debounceLogging = false;
      }, 500);
    }
  }
  debounceLog(msg);
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

module.exports = {
  dlog,
  drawAllTextures,
  getBlock: /*@__PURE__*/ getBlock,
  setBlock,
};
