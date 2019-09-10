import intervalSecond from './interval';

export let time = 0;
const NOON = [
  154,
  218,
  255,
];
const DUSK = [
  200,
  25,
  75,
];

function getTime() {
  return time;
}

function setTime(t) {
  time = parseFloat(t);
}

function timeModifier() {
  const uTime = Math.abs(time);
  return uTime/255;
}

function interpolate() {
  const [ noonR, noonG, noonB ] = NOON;
  const [ duskR, duskG, duskB ] = DUSK;
  const modifier = timeModifier();

  const a = [
    noonR * (1 - modifier),
    noonG * (1 - modifier),
    noonB * (1 - modifier),
  ];
  const b = [
    duskR * modifier,
    duskG * modifier,
    duskB * modifier,
  ];

  return [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2],
  ];
}

function color() {
  const [ r, g, b ] = /*@__PURE__*/ interpolate();
  const modifier = 1 - timeModifier();

  return [
    r * modifier,
    g * modifier,
    b * modifier,
  ];
}

intervalSecond(() => {
  time+=0.5;
  if (time >255) time = -255;
});

module.exports = {
  color: /*@__PURE__*/ color,
  timeModifier: /*@__PURE__*/ timeModifier,
  setTime,
  getTime: /*@__PURE__*/ getTime,
}