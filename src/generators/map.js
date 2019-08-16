const mapDataType = require('./mapDataType');
const Perlin = require("../vendor/perlin");
const pn = new Perlin("fjlakj3kn4kj9uvd98vf");

module.exports = () => {
  const heightMap = new Array(64);
  const map = mapDataType();
  
  // generate height-map
  for (let x = 0; x < 64; x++) {
    heightMap[x] = new Array(64);
    for (let z = 0; z < 64; z++) {
      let height = pn.noise(x / 15, z / 15, Math.PI);
      height *= 32;
      height += 32;
      height = Math.floor(height);
      heightMap[x][z] = height;
    }
  }

  // map height to map
  for (let x = 0; x < 64; x++) {
    for (let z = 0; z < 64; z++) {
      let mHeight = heightMap[x][z];
      map[x][mHeight][z] = 1; // fill heightmap with grass
      for (let y = mHeight - 1; y > 50; y--) map[x][y][z] = 9; // water fill 9
      for (let y = mHeight + 1; y < 64; y++) map[x][y][z] = 4; // underground fill
    }
  }

  return map;
}