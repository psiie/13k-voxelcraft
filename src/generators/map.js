const mapDataType = require('./mapDataType');
const Perlin = require("../vendor/perlin.skinny");
const perlin = Perlin(13370);

module.exports = () => {
  const MAP_SIZE = window.game.CONSTANTS.SETTINGS.MAP_SIZE;
  const map = mapDataType();
  
  // generate height-map
  const heightMap = new Array(MAP_SIZE);
  for (let x = 0; x < MAP_SIZE; x++) {
    heightMap[x] = new Array(MAP_SIZE);
    for (let z = 0; z < MAP_SIZE; z++) {
      let height = perlin(x / 15, z / 15);
      height *= 10; // hill amplitude
      height += 32;
      height = Math.floor(height);
      heightMap[x][z] = height;
    }
  }

  // map height to map
  for (let x = 0; x < MAP_SIZE; x++) {
    for (let z = 0; z < MAP_SIZE; z++) {
      let mHeight = heightMap[x][z];
      map[x][mHeight][z] = 1; // fill heightmap with grass
      for (let y = mHeight - 1; y > 30; y--) map[x][y][z] = 9; // water fill 9
      for (let y = mHeight + 1; y < 64; y++) map[x][y][z] = 4; // underground fill
    }
  }

  return map;
}