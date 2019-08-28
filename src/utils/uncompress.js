import { tryCatch } from './index';
const LZString = require('../vendor/lz-string');

/*  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
"P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\", "]", "^", "_",
"`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
"p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
58 max blocks atm. extentable to 62 without rework */
const LOOKUP_TABLE = new Array(58).fill(1).map((_,i)=>String.fromCharCode(65+i));

function mapStringToCurrentMap(str) {
  for (let i=0; i<str.length; i++) {
    const z = i % 256;
    const y = i / 256 % 64 | 0;
    const x = i / 256 / 64 | 0;
    
    if (str[i] !== '-') {
      const idx = LOOKUP_TABLE.indexOf(str[i]);
      if (idx !== -1) window.game.map[x][y][z] = idx; // if invalid, then refer to seed (by doing nothing). else use.
    }
  }
}

function repeat(char, times) {
  let out = '';
  for (let i=0; i<times; i++) out += char;
  return out;
}

function unMinify(str) {
  let out = ''

  let numberAssembly = '';
  for (let i=0; i<str.length; i++) {
    const isNumber = /\d/.test(str[i]);
    if (isNumber) numberAssembly += str[i];
    else if (numberAssembly) {
      out += repeat(str[i], parseInt(numberAssembly, 10));
      numberAssembly = '';
    }
    else out += str[i];
  }
  return out;
}

function main() {
  const { localStorage, game } = window;
  // load items from save
  const itemsFromSave = tryCatch(() => JSON.parse(localStorage.getItem('_mci')));
  if (itemsFromSave) game.hotbar.items = itemsFromSave.map(item => item === null ? Infinity : item);

  // const seed = window.localStorage.get
  const compressed = localStorage.getItem('_mcm');

  const uncompressed = LZString.decompress(compressed);
  const mapStr = unMinify(uncompressed);
  mapStringToCurrentMap(mapStr);
}

module.exports = {
  main,
  unMinify,
};
