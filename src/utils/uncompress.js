const LZString = require('../vendor/lz-string');

// todo: add safeguards. removed from lz-string

function repeat(char, times) {
  let out = '';
  for (let i=0; i<times; i++) out += char;
  return out;
}

function unMinify(str) {
  console.log('unMinify', !!str && str)
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
  // const mapStr = /*@__PURE__*/ mapArrToString();
  // const mapStrMinified = /*@__PURE__*/ minifyRepeats(mapStr);
  // const compressed = LZString.compress(mapStrMinified);
  const compressed = window.localStorage.getItem('_mcm');

  // window.localStorage.setItem('_mcm', compressed);
  const uncompressed = LZString.decompress(compressed);
  const unMinified = unMinify(uncompressed);
  console.log(unMinified.length);
}

module.exports = {
  main,
  unMinify,
};
