const movement = require("./movement");
const generators = require('./generators');
const engine = require('./engine');
const CONSTANTS = require("./constants");

// Setup the game object. This will be the 'source of thruth' throughout the game
window.game = {};
window.game.CONSTANTS = CONSTANTS;
window.game = {
  CONSTANTS: window.game.CONSTANTS,
  width: window.game.CONSTANTS.SETTINGS.RESOLUTION.WIDTH,
  height: window.game.CONSTANTS.SETTINGS.RESOLUTION.HEIGHT,
  player: {
    x: window.game.CONSTANTS.SETTINGS.START.X,
    y: window.game.CONSTANTS.SETTINGS.START.Y,
    z: window.game.CONSTANTS.SETTINGS.START.Z,
    velocity: 0,
    pitch: Math.cos(4.6),
    yaw: Math.PI / 2,
  },
  map: generators.map(),
  texmap: generators.textures(),
  ctx: document.getElementById("game").getContext("2d"),
  fps: 0,
};
window.game._map = generators.map(); // original map. used for making a diff

document.addEventListener('DOMContentLoaded', () => {
  const { game } = window;
  const { width, height, ctx, CONSTANTS } = window.game;
  
  // Resolution setup
  const canvas = document.querySelector('#game');
  canvas.width = width;
  canvas.height = height;
  canvas.setAttribute(
    'style',
    `width: ${width * CONSTANTS.SETTINGS.RESOLUTION.SCALE}px; height: ${height * CONSTANTS.SETTINGS.RESOLUTION.SCALE}px`
  );

  // Canvas setup
  game.pixels = ctx.createImageData(width, height);
  game.pixels.data.fill(255); // Set Opacity for screen
  
  // Game Bootstrap
  movement.init();
  engine.clock.init();
});
