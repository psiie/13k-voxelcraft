import intervalSecond from './interval';

let r,g,b;

function color() {
  const { pixels, width, height } = window.game;

  const x = width / 2;
  const y = height / 2;
  let grabPixelLocation = (x + (y - 5) * width) * 4;
  r = (pixels.data[grabPixelLocation + 0] + 128) & 255;
  g = (pixels.data[grabPixelLocation + 1] + 128) & 255;
  b = (pixels.data[grabPixelLocation + 2] + 128) & 255;
}

export default () => {
  const { ctx, width, height } = window.game;

  ctx.lineWidth = 1;
  ctx.strokeStyle = `#fff`;
  ctx.strokeStyle = `rgb(${r},${g},${b})`;
  const halfX = width / 2;
  const halfY = height / 2;
  const reticuleWidth = 2;
  ctx.strokeRect(halfX - reticuleWidth / 2, halfY - reticuleWidth / 2, reticuleWidth, reticuleWidth);
}

intervalSecond(color);
