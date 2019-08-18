const { dlog, getBlock } = require('../utils');

const RENDER_DISTANCE = 32;
const CONTRAST = 255 * 192;
let scanlinesEnabled = false;
let scanline = 0; // 0 or 1. determines startine line.

// can simplify to bool to save space.
let waterAnimate = 0;
setInterval(() => {
  waterAnimate = (waterAnimate + 1) % 3;
}, 1000);

function calcArcFromLength(step, length) {
  const half = length / 2;
  const slide = step - half;
  const inverse = half - Math.abs(slide);
  const percent = inverse / half;
  return percent;
}

function setPixelColor(x, y, brightness, col) {
  const { pixels, width } = window.game;
  const light = brightness * 255 / CONTRAST;

  let r = ((col >> 16) & 0xff) * light;
  let g = ((col >> 8) & 0xff) * light;
  let b = (col & 0xff) * light;

  // Sky color 144 238 255
  let pixelLocation = (x + y * width) * 4;
  pixels.data[pixelLocation + 0] = r || 144;
  pixels.data[pixelLocation + 1] = g || 238;
  pixels.data[pixelLocation + 2] = b || 255;
}

function render() {
  const { ctx, map, texmap, pixels, width, height, player, CONST, fps } = window.game;
  
  // calculate camera rotation
  const yCos = Math.cos(player.pitch);
  const ySin = Math.sin(player.pitch);
  const xCos = Math.cos(player.yaw);
  const xSin = Math.sin(player.yaw);

  const worldzd = 1;
  const playerOffsetX = player.x - (player.x | 0);
  const playerOffsetY = player.y - (player.y | 0);
  const playerOffsetZ = player.z - (player.z | 0);

  scanlinesEnabled = fps < 20;
  scanline = scanline ? 0 : 1; // fps saver
  for (let x = scanlinesEnabled ? scanline : 0; x < width; x += scanlinesEnabled ? 2 : 1) {
    // render distance
    const arcX = calcArcFromLength(x, width); // 0.0 - 1.0 float
    const biasedArcX = RENDER_DISTANCE * arcX;
    const worldxd = (x - width / 2) / height;

    for (let y = 0; y < height; y++) {
      // render distance
      const arcY = calcArcFromLength(y, height); // 0.0 - 1.0 float
      const biasedArcY = RENDER_DISTANCE * arcY;
      const arcAvg = (biasedArcX + biasedArcY) / 2;
      let renderDistance = RENDER_DISTANCE + arcAvg;
      if (fps < 30) renderDistance = renderDistance * (fps/30); // fps saver

      // pixel maths
      /*    worldzd */
      /*    worldxd */
      const worldyd = (y - height / 2) / height;
      const worldyd_ = worldzd * yCos + worldyd * ySin;

      const rotxd = worldyd * yCos - worldzd * ySin;
      const rotyd = worldxd * xCos + worldyd_ * xSin;
      const rotzd = worldyd_ * xCos - worldxd * xSin;

      // declare variables. Initial states are simply for notes
      let col = 0;
      let brightness = 255;

      // Ray cast for each dimension
      for (let dimension = 0; dimension < 3; dimension++) {
        let dimLength = rotyd; // rotyd === -0.5-1.5 . Straight forward 1.0
        if (dimension == 1) dimLength = rotxd;
        if (dimension == 2) dimLength = rotzd;

        // 11 === 2-0.65
        const ll = 1 / Math.abs(dimLength);
        const xd = rotyd * ll; // 1
        const yz = rotxd * ll; // 7
        const zd = rotzd * ll; // -pi-pi

        // initial is a block offset. where in the block the person is. 0-1
        let initial = playerOffsetX;
        if (dimension == 1) initial = playerOffsetY
        if (dimension == 2) initial = playerOffsetZ;
        if (dimLength > 0) initial = 1 - initial;

        /* where to start/stop rendering. Faces offset when wrong */
        let xp = player.x + xd * initial;
        let yp = (player.y + yz * initial);
        let zp = player.z + zd * initial;

        // faces go missing in certain cardinal directions when not subtracted
        if (dimLength < 0) {
          if (dimension === 0) xp--;
          if (dimension === 1) yp--;
          if (dimension === 2) zp--;
          //   !dimension ? xp-- : 0;
          //   dimension == 1 ? yp-- : 0;
          //   dimension == 2 ? zp-- : 0;
        }

        // the ray
        let distance = ll * initial; // distance === 0-2
        const mapSize = CONST.MAP_SIZE - 1;
        while (distance < renderDistance) {
          let texture = getBlock(xp & mapSize, yp & 63, zp & mapSize);
          if (zp > mapSize || yp > 63 || xp > mapSize || zp < 0 || yp < 0 || xp < 0) {
            texture = 0; // Only render the playable cube. Dont loop
          }

          // if not an air block
          if (texture > 0) {
            let u = ((xp + zp) * 16) & 15;
            let v = ((yp * 16) & 15) + 16;

            // if top dimension of block
            if (dimension == 1) {
              u = (xp * 16) & 15;
              v = (zp * 16) & 15;
              if (yz < 0) v += 32;
            }

            const cc = texmap[u + v * 16 + texture * 256 * 3];
            if (cc > 0) {
              col = cc;

              // if water block, animate
              if (texture === 9 && dimension == 1) {
                const texId = u + v * (waterAnimate+1)*16 + texture * 256 * 3;
                if (texId < 7680) col = texmap[texId]; // only animate topside. prevents texture sliding into next texture
              }

              brightness = 255 - (dimension + 2) % 3 * 50;
              renderDistance = distance;
            }
          }

          xp += xd;
          yp += yz;
          zp += zd;
          distance += ll;
        }
      }

      setPixelColor(x, y, brightness, col);
    }
  }
}

module.exports = {
  render,
}
