import compress from './utils/compress';
import uncompress from './utils/uncompress';
import { getTime, setTime } from './engine/time';
import intervalSecond from './engine/interval';
import { getCanvas } from './utils';
const movement = require("./movement");
const generators = require('./generators');
const engine = require('./engine');
const CONST = require("./constants");

const { WIDTH, HEIGHT } = CONST.RES;
const start = CONST.MAP_SIZE / 2 | 0;

// Setup the game object. This will be the 'source of thruth' throughout the game
window.game = { CONST };
window.game = {
  CONST: CONST,
  width: WIDTH,
  height: HEIGHT,
  getTime,
  setTime,
  player: {
    x: start,
    y: 0,
    z: start,
    velocity: 0,
    pitch: -0.1, // Math.cos(4.6)
    yaw: 0,
  },
  hotbar: {
    selected: 0,
    side: 0,
    items: Array(21).fill(0), // the indices coorelates to the block id. eg: 2 is dirt. the number in the array is the quanitity
  },
  map: generators.map(),
  texmap: generators.textures(),
  ctx: document.getElementById("game").getContext("2d"),
  fps: 0,
  scanlinesEnabled: true,
  renderDistance: 32,
};

document.addEventListener('DOMContentLoaded', () => {
  const { game } = window;
  const { width, height, ctx } = game;
  const $toolbar = document.getElementById('toolbar');
  
  // Resolution setup
  const canvas = getCanvas();
  canvas.width = width;
  canvas.height = height;
  const onResize = () => {
    let windowWidth = window.innerHeight * 1.3334; // assume widescreen as default
    let windowHeight = window.innerHeight;
    
    if (window.innerWidth * 0.75 < window.innerHeight) { // is tallscreen
      windowWidth = window.innerWidth;
      windowHeight = window.innerWidth * 0.75;
    } 

    canvas.setAttribute(
      'style',
      `width: ${windowWidth}px; height: ${windowHeight}px`
    );
  };

  // Canvas setup
  game.pixels = ctx.createImageData(width, height);
  game.pixels.data.fill(255); // Set Opacity for screen
  window.addEventListener('resize', onResize);
  onResize(); // run once to do the initial sizing

  // Game Bootstrap
  movement.init();
  engine.clock.init();
  setTimeout(uncompress.main, 500);

  // auto adjust speed
  intervalSecond(() => {
    const { game } = window;
    const { fps, scanlinesEnabled } = game || {};

    // if (!scanlinesEnabled && fps < 30) game.scanlinesEnabled = true;
    // else if (scanlinesEnabled && fps > 45) game.scanlinesEnabled = false;

    // if (fps < 10) game.renderDistance = 10;
    // else if (fps < 20) game.renderDistance = 20;
    // else if (fps > 40) game.renderDistance = 40;

    // if (fps < 30) renderDistance = renderDistance * (fps/30);
  });

  // toolbar
  $toolbar.addEventListener('click', event => {
    const clicked = event.target.id;
    let generateNewSeed = false;

    switch (clicked) {
      case 'lock':
        $toolbar.classList.toggle('extended');
        break;
      case 'save':
        compress();
        break;
      case 'load':
        window.location.reload();
        break;
      case 'plus':
        game.renderDistance += 5;
        break;
      case 'minus':
        game.renderDistance -= 5;
        break;
      case 'interlace':
        setTimeout(() => game.scanlinesEnabled = !game.scanlinesEnabled, 1);
        break;
      case 'newseeed':
        generateNewSeed = confirm("Generate a new seed? This will erase your current save.");
        if (generateNewSeed) {
          CONST.LOCAL_STORAGE.forEach(i => localStorage.removeItem(i));
          localStorage.setItem('_mcs', Math.random() * Number.MAX_SAFE_INTEGER | 0);
          window.location.reload();
        }
    }

    if (game.renderDistance < 5) game.renderDistance = 5;
    else if (game.renderDistance > 255) game.renderDistance = 255;
  });
});
