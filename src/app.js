import compress from './utils/compress';
import uncompress from './utils/uncompress';
const movement = require("./movement");
const generators = require('./generators');
const engine = require('./engine');
const CONST = require("./constants");


const { WIDTH, HEIGHT } = CONST.RES;

// Setup the game object. This will be the 'source of thruth' throughout the game
window.game = { CONST };

const start = window.game.CONST.MAP_SIZE / 2 | 0;
window.game = {
  CONST: CONST,
  width: WIDTH,
  height: HEIGHT,
  player: {
    x: start,
    y: 0,
    z: start,
    velocity: 0,
    pitch: -0.1, // Math.cos(4.6)
    yaw: 0,
  },
  hotbarSelect: 0,
  hotbarSide: 0,
  map: generators.map(),
  texmap: generators.textures(),
  ctx: document.getElementById("game").getContext("2d"),
  fps: 0, 
};
window.game._map = generators.map(); // original map. used for making a diff

document.addEventListener('DOMContentLoaded', () => {
  const { game } = window;
  const { width, height, ctx, CONST } = game;
  
  // Resolution setup
  const canvas = document.querySelector('#game');
  canvas.width = width;
  canvas.height = height;
  canvas.setAttribute(
    'style',
    `width: ${width * CONST.RES.SCALE}px; height: ${height * CONST.RES.SCALE}px`
  );

  // Canvas setup
  game.pixels = ctx.createImageData(width, height);
  game.pixels.data.fill(255); // Set Opacity for screen
  
  // Game Bootstrap
  movement.init();
  engine.clock.init();

  setTimeout(() => {
    console.log('loading...');
    uncompress.main();
  }, 500);

  window.save = compress;
  window.load = uncompress.main;
});
