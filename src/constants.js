const constants = {
  SETTINGS: {
    /* Width & Height to render the game at. Scale enlarges the size of the canvas
    by multiplying itself by WIDTH/HEIGHT. Essentially reducting the resolution.
    
    eg: 320 (width) * 2 (scale) = actual screen resolution of 640 (width). 
    To fill a 1280 (width) screen with a resolution of 4, what you want for width
    will be 1280/4=320. */
    RESOLUTION: {
      WIDTH: 320,
      HEIGHT: 240,
      SCALE: 2,
    },
    // Starting position of the plater
    START: {
      X: 32.5,
      Y: 32.5,
      Z: 32.5,
    },
  },
  // Mapping blocks to their ID's
  BLOCKS: {
    AIR: 0
  },
  // Physics engine
  PLAYER_HEIGHT: 1.8,
  GRAVITY: {
    JUMP_STR: 0.4,
    JUMP_STR_AMP: 0.0010
  }
};

window.constants = constants;
module.exports = constants;
