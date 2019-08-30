import time from './time';
import intervalSecond from './interval';
import setPixelColor from './pixel';
import { getBlock, calcArcFromLength } from '../utils';

const RENDER_DISTANCE = 32;
let scanlinesEnabled = false,
    scanline = 0, // 0 or 1. determines startine line.
    waterAnimate = 0; // can simplify to bool to save space.

intervalSecond(() => {
  waterAnimate = (waterAnimate + 1) % 3;
})

function render() {
  const { texmap, width, height, player, CONST, fps } = window.game;
  
  // calculate camera rotation
  const yCos = Math.cos(player.pitch);
  const ySin = Math.sin(player.pitch);
  const xCos = Math.cos(player.yaw);
  const xSin = Math.sin(player.yaw);

  const playerOffsetX = player.x - (player.x | 0);
  const playerOffsetY = player.y - (player.y | 0);
  const playerOffsetZ = player.z - (player.z | 0);

  // scanlinesEnabled = fps < 20; // todo: enable
  scanlinesEnabled = true;
  scanline = scanline ? 0 : 1; // fps saver
  for (let x = 0; x < width; x++) {
    // render distance
    const arcX = calcArcFromLength(x, width); // 0.0 - 1.0 float
    const biasedArcX = RENDER_DISTANCE * arcX;
    const worldxd = (x - width / 2) / height;

    for (let y = scanlinesEnabled ? (x % 2)+scanline : 0; y < height; y += scanlinesEnabled ? 2 : 1) {
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
      const worldyd_ = yCos + worldyd * ySin;

      const rotxd = worldyd * yCos - ySin;
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
          !dimension ? xp-- : 0;
          dimension == 1 ? yp--:0;
          dimension == 2 ? zp-- : 0;
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
              if (
                dimension == 1
                && (texture === 9 || texture === 10)
              ) {
                /* only animate topside. prevents texture sliding into next texture.
                the ternary is to save space. Basically lava, being the next texture, needs a diff cutoff point. */
                const texId = u + v * (waterAnimate+1)*16 + texture * 256 * 3;
                if (texId < texture == 9 ? 7680 : 8680) col = texmap[texId];
              }
              const timeModifier = time.timeModifier();
              const distancePercent = 1 - (distance / RENDER_DISTANCE * timeModifier);
              brightness = (255 - (dimension + 2) % 3 * 50) * (distancePercent);
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
