const LZString = require('../vendor/lz-string');

/*  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
"P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\", "]", "^", "_",
"`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
"p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
58 max blocks atm. extentable to 62 without rework */
const LOOKUP_TABLE = new Array(58).fill(1).map((_,i)=>String.fromCharCode(65+i));
const WILDCARD = '-';

function mapStringToArr(str) {
  // construct 3d array from string
    // idea: moving slicer from start to end to cut Z's and place in proper XY grid.

  for (let i=0; i<str.length; i++) {
    // const block = (
    //   str[i] === WILDCARD
    //     ? WILDCARD
    //     : (LOOKUP_TABLE.indexOf(str[i]) || WILDCARD)
    // );


  }

  // create map from seed
  // apply our stringMapArr on top of seed map
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
  // const seed = window.localStorage.get
  const seed = 421;
  const compressed = window.localStorage.getItem('_mcm');

  const uncompressed = LZString.decompress(compressed);
  const mapStr = unMinify(uncompressed);
  const mapArr = mapStringToArr(mapStr);
  console.log(mapArr);
}

module.exports = {
  main,
  unMinify,
};
