require('./webpack/index.css');
const movement = require("./movement");
const generators = require('./generators');
const engine = require('./engine');
const CONST = require("./constants");

// Setup the game object. This will be the 'source of thruth' throughout the game
window.game = {
  width: CONST.SETTINGS.RESOLUTION.WIDTH,
  height: CONST.SETTINGS.RESOLUTION.HEIGHT,
  map: generators.map(),
  texmap: generators.textures(),
  ctx: document.getElementById("game").getContext("2d"),
  player: {
    x: CONST.SETTINGS.START.X,
    y: CONST.SETTINGS.START.Y,
    z: CONST.SETTINGS.START.Z,
    velocity: 0,
    pitch: Math.cos(4.6),
    yaw: Math.PI / 2,
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const { game } = window;
  const { width, height, ctx } = window.game;
  
  // Resolution setup
  const viewportWidth = width * CONST.SETTINGS.RESOLUTION.SCALE;
  const viewportHeight = height * CONST.SETTINGS.RESOLUTION.SCALE;
  const canvas = document.querySelector('#game');
  canvas.width = CONST.SETTINGS.RESOLUTION.WIDTH;
  canvas.height = CONST.SETTINGS.RESOLUTION.HEIGHT;
  canvas.setAttribute('style', `width: ${viewportWidth}px; height: ${viewportHeight}px`);

  // Canvas setup
  game.pixels = ctx.createImageData(width, height);
  for (let i = 0; i < width * height; i++) { 
    game.pixels.data[i * 4 + 3] = 255; // Set Opacity for screen
  }
  
  // Game Bootstrap
  movement.init();
  engine.clock.init();
});
