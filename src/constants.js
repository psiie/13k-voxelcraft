module.exports = {
  /* Width & Height to render the game at. Scale enlarges the size of the canvas
  by multiplying itself by WIDTH/HEIGHT. Essentially reducting the resolution.

  eg: 320 (width) * 2 (scale) = actual screen resolution of 640 (width). 
  To fill a 1280 (width) screen with a resolution of 4, what you want for width
  will be 1280/4=320. */
  RES: {
    WIDTH: 320, // todo: can delete?
    HEIGHT: 240, // still tied to hotbar placement
  },

  MAP_SIZE: 256,
  MAX_FPS: 60,

  // Mapping blocks to their ID's
  SEA_LEVEL: 30, // inverse. higher = lower sea level
  MAP_SCALE: 31,

  // Physics engine
  JMP: {
    STR: 0.4,
    AMP: 0.0010
  },

  BLOCKS_MAP: [ // which items to show on the hotbar. for both A and B sides (and maybe future C)
    [2, 4,12,7, 9,11,13,14,15,16],
    [1,20, 3,6,10, 8, 5,17,18,19],
  ],
  
  CRAFTABLES: {
    2: [1, 1],
    4: [20, 6],
    7: [6, 0.25],
    9: [10, 8],
    11: [8, 0.5],
    12: [3, 4], // 12 (sand) makes 3 (glass) every 4x 12 (sand)
    13: [5, 2],
    14: [17, 9],
    15: [18, 9],
    16: [19, 9],
  },

  LOCAL_STORAGE: [
    '_mcm',
    '_mcs',
    '_mct',
    '_mci',
  ],

};
