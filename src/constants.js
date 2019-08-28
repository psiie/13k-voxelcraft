module.exports = {
  /* Width & Height to render the game at. Scale enlarges the size of the canvas
  by multiplying itself by WIDTH/HEIGHT. Essentially reducting the resolution.

  eg: 320 (width) * 2 (scale) = actual screen resolution of 640 (width). 
  To fill a 1280 (width) screen with a resolution of 4, what you want for width
  will be 1280/4=320. */
  RES: {
    WIDTH: 320,
    HEIGHT: 240,
    SCALE: 2,
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
    [2,3,4,5,6,7,10,11,12,13],
    [13,12,11,10,7,6,5,4,3,2]
  ],

  /* format: `blockId: [required block, required block count]`.
  Item is a array of arrays. This is so that one block pickup can make multiple blocks
  example:
      10: [3, 4]
    sand: [glass, 4x sand]
    eg: you need 4 sand to make 1 glass. You may notice this seems backwards, but it is so
    we can easily look this up on a block pickup.
  */

  /* eslint-disable no-sparse-arrays */
  CRAFTABLES: [
    , // 0
    , // 1
    , // 2
    , // 3
    , // 4
    , // 5
    , // 6
    , // 7
    , // 8
    , // 9
    , // 10
    , // 11
    , // 12
    3, // 13 - sand
  ],

  // how many of the counterpart blocks are required to make one. Lookup by craftable id
  CRAFTABLES_QUANTITY: [ 
    , // 0
    , // 1
    , // 2
    4, // 3
    , // 4
    , // 5
    , // 6
    , // 7
    , // 8
    , // 9
    , // 10
    , // 11
    , // 12
    , // 13
  ],

  // CRAFTABLE_BLOCKS: {
  //   13: [[3, 4]], // 13 == sand
  // },

  // // used for when a crafted block is used. to remove the raw materials
  // UNCRAFTABLE_BLOCKS: {
  //   3: [[13, 4]], // 3 == glass. 
  // }
};