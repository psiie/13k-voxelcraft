function calcArcFromLength(step, length) {
  const half = length / 2;
  const slide = step - half;
  const inverse = half - Math.abs(slide);
  // const percent = inverse / half;
  // return percent;

  /* remove below if want to save cycles/space
  and use straight-line convergence instead */
  const percent = 1 - (inverse / half);
  const withPi = Math.PI * percent;
  return Math.cos(withPi / 2);
}

module.exports = () => {
  const { ctx, map, texmap, pixels, width, height, player } = window.game;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const setPixelColor = () => {
        // 144 238 255 // 256 * 256
        let r = ((col >> 16) & 0xff) * brightness * fogDistance / (255 * 192);
        let g = ((col >> 8) & 0xff) * brightness * fogDistance / (255 * 192);
        let b = (col & 0xff) * brightness * fogDistance / (255 * 192);

        // blue fog effect
        r += ((1 - fogDistance / 210) * 144) * Math.abs((fogDistance-210)/210);
        g += ((1 - fogDistance / 210) * 238) * Math.abs((fogDistance-210)/210);
        b += ((1 - fogDistance / 210) * 255) * Math.abs((fogDistance-210)/210);

        // Sky color 144 238 255
        pixels.data[(x + y * width) * 4 + 0] = r || 144;
        pixels.data[(x + y * width) * 4 + 1] = g || 238;
        pixels.data[(x + y * width) * 4 + 2] = b || 255;
      }

      // calculate camera rotation
      const yCos = Math.cos(player.pitch);
      const ySin = Math.sin(player.pitch);
      const xCos = Math.cos(player.yaw);
      const xSin = Math.sin(player.yaw);

      // pixel maths
      const worldyd = (y - height / 2) / height;
      const worldzd = 1;
      const worldxd = (x - width / 2) / height;
      const worldyd_ = worldzd * yCos + worldyd * ySin;

      const rotxd = worldyd * yCos - worldzd * ySin;
      const rotyd = worldxd * xCos + worldyd_ * xSin;
      const rotzd = worldyd_ * xCos - worldxd * xSin;

      // declare variables. Initial states are simply for notes
      let col = 0;
      let brightness = 255;
      let fogDistance = 0;

      // render distance
      /* todo: refactor render distance if needed for 13k comp */
      // let renderDistance = 32; // standard 32
      const RENDER_DISTANCE = 32;
      const arcX = calcArcFromLength(x, width); // 0.0 - 1.0 float
      const arcY = calcArcFromLength(y, height); // 0.0 - 1.0 float
      const biasedArcX = (RENDER_DISTANCE / 4) * arcX;
      const biasedArcY = (RENDER_DISTANCE / 4) * arcY;
      const arcAvg = (biasedArcX + biasedArcY) / 2;
      let renderDistance = RENDER_DISTANCE + arcAvg;

      // Ray cast for each dimension
      for (let dimension = 0; dimension < 3; dimension++) {
        // rotyd === -0.5-1.5 . Straight forward 1.0
        let dimLength = rotyd;
        if (dimension == 1) dimLength = rotxd;
        if (dimension == 2) dimLength = rotzd;

        // 11 === 2-0.65
        const ll = 1 / Math.abs(dimLength);
        const xd = rotyd * ll; // 1
        const yz = rotxd * ll; // 7
        const zd = rotzd * ll; // -pi-pi

        // initial is a block offset. where in the block the person is. 0-1
        let initial = player.x - (player.x | 0);
        if (dimension == 1) initial = player.y - (player.y | 0);
        if (dimension == 2) initial = player.z - (player.z | 0);
        if (dimLength > 0) initial = 1 - initial;

        /* where to start/stop rendering. Faces offset when wrong */
        let xp = player.x + xd * initial;
        let yp = player.y + yz * initial;
        let zp = player.z + zd * initial;

        // faces go missing in certain cardinal directions when not subtracted
        if (dimLength < 0) {
          if (dimension === 0) xp--;
          if (dimension === 1) yp--;
          if (dimension === 2) zp--;
        }

        // the ray
        let distance = ll * initial; // distance === 0-2
        while (distance < renderDistance) {
          let texture = map[xp & 63][yp & 63][zp & 63];
          // if (zp > 64 || yp > 64 || xp > 64 || zp < 0 || yp < 0 || xp < 0) {
          //   texture = 0; // Only render the 64x64x64 cube. Dont loop
          // }

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
              fogDistance = 255 - ((distance / 32 * 0) | 0); // no fog
              // fogDistance = 255 - ((distance / 32 * 255) | 0); // standard
              // fogDistance = (255 - ((distance / 32 * 255) | 0)) * 4; // partial fog
              if (fogDistance > 255) fogDistance = 255;
              brightness = 255 * (255 - (dimension + 2) % 3 * 50) / 255;
              renderDistance = distance;
            }
          }
          xp += xd;
          yp += yz;
          zp += zd;
          distance += ll;
        }
      }
      setPixelColor();
    }
  }
  ctx.putImageData(pixels, 0, 0);
};
