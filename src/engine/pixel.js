import time from './time';
import { isInsideCheck } from '../utils';

const CONTRAST = 255 * 192;

function setPixelColor(x, y, brightness, col) {
  const { pixels, width } = window.game;
  const { color } = time;
  const isInside = isInsideCheck();
  const timeModifier = time.timeModifier();
  const [ skyR, skyG, skyB ] = color();
  let light = brightness * 255 / CONTRAST;
  if (!isInside) light = light * (1 - timeModifier / 2);

  let r = ((col >> 16) & 0xff) * light;
  let g = ((col >> 8) & 0xff) * light;
  let b = (col & 0xff) * light;

  let pixelLocation = (x + y * width) * 4;
  pixels.data[pixelLocation + 0] = r || skyR; //144
  pixels.data[pixelLocation + 1] = g || skyG; //238
  pixels.data[pixelLocation + 2] = b || skyB; //255
}

export default setPixelColor;
