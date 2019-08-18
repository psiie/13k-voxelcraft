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
  }
};
