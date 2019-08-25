const pseudoRandom = /*@__PURE__*/ (seed,modulo) =>
  `${(2**31-1&Math.imul(48271,seed))/2**31}`
    .split('')
    .slice(-10)
    .join('') % modulo;

export default pseudoRandom;
