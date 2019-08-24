import intervalSecond from './interval';

let time = -255;
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

// todo: there is a problem with exact midnight. red turns to blue.
intervalSecond(() => {
  time+=0.5;
  if (time >255) time = -255;
})

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

module.exports = {
  color: /*@__PURE__*/ color,
  timeModifier: /*@__PURE__*/ timeModifier,
}