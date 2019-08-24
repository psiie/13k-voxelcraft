module.exports = /*@__PURE__*/ () => {
  const texmap = new Array(12288); // 16 * 16 * 3 * 16

  // 0 = air - Do not consume this slot
  // 1 = grass-topped dirt
  // 2 = dirt - Do not consume this slot.
  // 3 = glass
  // 4 = stone
  // 5 = brick-block
  // 6 = wood planks
  // 7 = log
  // 8 = leaves
  // 9 = blue cloth
  // 10 = sponge – yellow replacement
  // 11 = red cloth
  // 12 = green block
  // 13 = sand
  // 14 = gold ore
  // 15 = diamond ore

  for (let textureIndex = 1; textureIndex < 16; textureIndex++) {
    /* VarientA and VarientB are really just transparency values. But are great
    for setting variations of colors. */
    let varientA = 255 - ((Math.random() * 96) | 0);
    
    for (let y = 0; y < 16 * 3; y++) {
      for (let x = 0; x < 16; x++) {
        let color = 0x966c4a; // #966c4a
        let varientB = varientA;
        if (y >= 32) varientB /= 2; // side of block
        if ((textureIndex != 4 && textureIndex != 6) || ((Math.random() * 3) | 0) === 0)
          varientA = 255 - ((Math.random() * 96) | 0);

        // 0 = air - Do not consume this slot

        // 1 = grass-topped dirt
        if (textureIndex == 1) {
          if (y < (((x * x * 3 + x * 81) >> 2) & 3) + 18)
            color = 0x6aaa40; // #6aaa40 Top of grass block
          else if (textureIndex == 1 && y < (((x * x * 3 + x * 81) >> 2) & 3) + 19)
            varientA = varientA * 2 / 3; // Edge of grassblock. Set transparency of pixel to 'blend' into dirt
        }

        // 2 = dirt - Do not consume this slot.

        // 3 - glass
        if (textureIndex == 3) {
          color = 0xdedede; // #ddd
          if ((x > 0 && x < 15) && ((y > 0 && y < 15) || (y > 16 && y < 31))) varientB = 0;
        }

        // 4 = stone
        if (textureIndex == 4) color = 0x7f7f7f; // #7f7f7f

        // 5 = brick-block
        if (textureIndex == 5) {
          color = 0xb53a15; // #b53a15
          if ((x + (y >> 2) * 4) % 8 === 0 || y % 4 === 0) color = 0xbcafa5; // #bcafa5
        }

        // 6 = wooden plank
        if (textureIndex == 6) {
          color = 0xa0824b; // #a0824b
          if (((Math.random() * 16) | 0) === 0)
            varientA = 255 - ((Math.random() * 96) | 0);
          if (y % 4 === 0)
            varientB = 132;
        }
        
        // 7 = log
        if (textureIndex == 7) {
          color = 0x675231; // #675231
          if (x > 0 && x < 15 && ((y > 0 && y < 15) || (y > 32 && y < 47))) {
            // top of the log
            color = 0xbc9862; // #bc9862
            let xd = x - 7;
            let yd = (y & 15) - 7;
            if (xd < 0) xd = 1 - xd;
            if (yd < 0) yd = 1 - yd;
            if (yd > xd) xd = yd;

            varientA = 196 - ((Math.random() * 32) | 0) + xd % 3 * 32;
          } 
          else if (((Math.random() * 2) | 0) === 0) {
            // side of the log
            varientA = varientA * (140 - (x & 1) * 100) / 100;
          }
        }

        // 8 = leaves
        if (textureIndex == 8) {
          color = 0x50d937; // #50d937
          // Set transparent for air-pockets
          if (((Math.random() * 2) | 0) === 0) {
            color = 0;
            varientB = 255;
          }
        }

        // 9 = water
        // todo: animate water
        if (textureIndex == 9) {
          color = 0x4060ff; // #4060ff #4040ff
          varientB = ((Math.random() * 32) | 0) + 192
        }

        // 10 = sponge – yellow replacement
        if (textureIndex == 10) {
          color = 0xd9d85e; // #d9d85e
          if (Math.random() * 16 < 1) varientB = 92 - (x * 4);
        }
        
        // 11 = red cloth
        if (textureIndex == 11) color = 0xf13e42; // #f13e42

        // 12 = green block
        if (textureIndex == 12) color = 0x31df31; // #31df31

        // 13 = sand
        if (textureIndex == 13) {
          color = 0xe7dfb0; // #e7dfb0
          if (Math.random() * 16 < 1) {
            varientB = 164 + (x * 4);
          }
        }

        const oreLogic = oreColor => {
          if ((x > 2 && x < 13) && ((y > 2 && y < 13) || y > 18 && y < 29)) {
            if (Math.random() * 4 < 1) color = oreColor;
          }
        }
        // // 14 = gold ore
        if (textureIndex == 14) {
          color = 0x7f7f7f; // #7f7f7f
          oreLogic(0xf0e4a1); // #f0e4a1
        }

        // 15 = diamond ore
        if (textureIndex == 15) {
          color = 0x7f7f7f; // #7f7f7f
          oreLogic(0x44eded); // #44eded
        }

        // Calculate pixel's binary data (rgb as one integer)
        const rgbPixel = ((((color >> 16) & 0xff) * varientB / 255) << 16) | // R
                         ((((color >> 8 ) & 0xff) * varientB / 255) << 8)  | // G
                         ((color & 0xff ) * varientB / 255);                 // B

        texmap[x + y * 16 + textureIndex * 256 * 3] = rgbPixel;
      }
    }
  }

  return texmap;
}