import { unMinify } from './uncompress';
import { getTime } from '../engine/time';
import generators from '../generators';
import localStorageWrapper from '../engine/localStorage';
const LZString = require('../vendor/lz-string.orig');

/*  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
"P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\", "]", "^", "_",
"`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
"p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
58 max blocks atm. extentable to 62 without rework */
const LOOKUP_TABLE = new Array(58).fill(1).map((_,i)=>String.fromCharCode(65+i));

export const stringify = /*@__PURE__*/ map => {
  return map.map(
    x => x.map(
      y => y.map(
        z => LOOKUP_TABLE[z] || LOOKUP_TABLE[0]
      ).join('')
    ).join('')
  ).join('');  
};

const getOriginalMap = /*@__PURE__*/() => {
  return window.game._map = window.game._map || generators.map(); // original map. used for making a diff
}

function mapArrToString() {
  let final = '';
  const orig = stringify(getOriginalMap());
  const current = stringify(window.game.map);

  for (let i=0; i<current.length; i++) {
    const a = orig[i]
    const b = current[i];
    final += a === b ? '-' : b;
  }

  return final;
}

/* turns repeating chars in long string into number+char. Saves tons of space */
function minifyRepeats(str) {
  let out = ''

  let lastChar = str[0];
  let repeatCount = 1;
  for (let i=1; i<str.length; i++) {
    if (str[i] === lastChar) repeatCount++;
    else {
      if (repeatCount === 1) out += lastChar
      else out += repeatCount + lastChar;

      lastChar = str[i];
      repeatCount = 1;
    }

  }
  out += repeatCount + lastChar;

  return out;
}

function main() {
  const { game } = window;
  localStorageWrapper.safeSet('_mct', getTime());
  // save inventory. will probably move to a better file location
  localStorageWrapper.safeSet('_mci', JSON.stringify(game.hotbar.items));

  const mapStr = /*@__PURE__*/ mapArrToString();
  console.log('saving mapStr length', mapStr.length)
  const mapStrMinified = /*@__PURE__*/ minifyRepeats(mapStr);
  const compressed = LZString.compress(mapStrMinified);
  
  console.log('minified', mapStrMinified.length, mapStrMinified);
  console.log('compressed', compressed.length, compressed);

  localStorageWrapper.safeSet('_mcm', compressed);

  // verify save
  const uncompressed = LZString.decompress(compressed);
  const unMinified = unMinify(uncompressed);
  if (unMinified !== mapStr) console.log('Could not save map internally');
  else console.log('success');
}

export default /*@__PURE__*/ main;
