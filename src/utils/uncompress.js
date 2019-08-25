import { stringify } from './compress';
const LZString = require('../vendor/lz-string');

/*  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
"P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\", "]", "^", "_",
"`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
"p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
58 max blocks atm. extentable to 62 without rework */
const LOOKUP_TABLE = new Array(58).fill(1).map((_,i)=>String.fromCharCode(65+i));
const WILDCARD = '-';
const seed = 421;

function mapStringToArr(str) {
  // construct 3d array from string
    // idea: moving slicer from start to end to cut Z's and place in proper XY grid.

  // take string, compare with seed, and merge seed with saved map
  let arr1D = ''; // is technically a string. but it fits the convention for notes
  const origSeedMap = stringify(window.game._map);
  for (let i=0; i<str.length; i++) {
    const a = origSeedMap[i]
    const b = str[i];
    if (b === '-') arr1D += a; // if '-', then refer to seed
    else { // lookup map save. just in case lookup fails, replace with air
      const index = LOOKUP_TABLE.indexOf(b);
      arr1D += index === -1 ? WILDCARD : index;
    }
  }

  // cut up arr1D into slices
  const arr2D = [];
  for (let i=0; i<arr1D.length; i+=256) {
    const zSliceStr = arr1D.slice(i, i+256); // moving slicer
    let zSliceArr = zSliceStr.split(''); // convert 256 length string into arr.

    // remap letters back to integers (used so we can use 1 char for blocks (greater than 10 [digits]))
    // zSliceArr = zSliceArr.map(z => {
    //   if (z === WILDCARD) return WILDCARD;
    //   const index = LOOKUP_TABLE.indexOf(z);
    //   return index === -1 ? WILDCARD : index;
    // });

    arr2D.push(zSliceArr);
  }

  // cut up slices of arr2D into the final arrangement for map recreation
  const arr3D = [];
  for (let i=0; i<arr2D.length; i+=64) {
    const ySliceArr = arr2D.slice(i, i+64);
    arr3D.push(ySliceArr);
  }

  console.log(arr3D);
  console.log(arr3D.length);

  



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
