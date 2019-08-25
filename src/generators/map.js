const { setBlock } = require('../utils');
const mapDataType = require('./mapDataType');
const Perlin = require("../vendor/perlin.skinny");
const perlin = Perlin(421);

function growTree(map, x, y, z) {
  const height = (x * y % 6) + 6;
  for (let i=0; i<height; i++) map[x][y - i][z] = 7; // draw height of tree in logs
  for (let i=height; i>0; i-=3) { // grow leaves - intervals
    for (let nz=-1; nz<2; nz++) { // leaves circle x
      for (let nx=-1; nx<2; nx++) { // leaves circle z
        setBlock(nx+x, y - i, nz+z, 8, map, 7);
      }
    }
  }
}

module.exports = () => {
  const { SEA_LEVEL, MAP_SCALE, MAP_SIZE } = window.game.CONST;
  const map = mapDataType();

  const newArr = () => new Array(MAP_SIZE);
  
  // generate height-map
  const heightMap = newArr();
  const treeMap = newArr();
  for (let x = 0; x < MAP_SIZE; x++) {
    heightMap[x] = newArr();
    treeMap[x] = newArr();
    for (let z = 0; z < MAP_SIZE; z++) {
      // grass generation
      let height = perlin(x / MAP_SCALE, z / MAP_SCALE, 0);
      height *= 10; // hill amplitude
      height += 32;
      height = Math.floor(height);
      heightMap[x][z] = height;

      // trees
      let pTrees = perlin(x / 2, z / 2, 0);
      pTrees *= 3;
      pTrees = Math.floor(pTrees);
      treeMap[x][z] = pTrees;
      window.treeMap = treeMap
    }
  }

  // map height to map
  for (let x = 0; x < MAP_SIZE; x++) {
    for (let z = 0; z < MAP_SIZE; z++) {
      const mHeight = heightMap[x][z];
      map[x][mHeight][z] = mHeight <= SEA_LEVEL ? 1 : 13; // fill heightmap with grass
      for (let y = mHeight - 1; y > SEA_LEVEL; y--) map[x][y][z] = 9; // water fill 9
      for (let y = mHeight + 1; y < 64; y++) map[x][y][z] = 4; // underground fill
      if (treeMap[x][z] <= -2 && mHeight < SEA_LEVEL) growTree(map, x, mHeight - 1, z);
    }
  }

  return map;
}