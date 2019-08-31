const { setBlock } = require('../utils');
const mapDataType = require('./mapDataType');
const Perlin = require("../vendor/perlin.skinny");
const perlin = Perlin(421);

// using an object for faster lookup
const ALLOWED_CAVE_GENERATE_OVER_BLOCKS = {
  1: 1,
  2: 1,
  4: 1,
};

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
      window.treeMap = treeMap;
    }
  }

  // map height to map
  for (let x = 0; x < MAP_SIZE; x++) {
    for (let z = 0; z < MAP_SIZE; z++) {
      const mHeight = heightMap[x][z];
      map[x][mHeight][z] = mHeight <= SEA_LEVEL ? 1 : 12; // fill heightmap with grass (or sand at sea level)
      for (let y = mHeight - 1; y > SEA_LEVEL; y--) map[x][y][z] = 9; // water fill 9
      for (let y = mHeight + 1; y < 64; y++) map[x][y][z] = 4; // underground fill
      if (treeMap[x][z] <= -2 && mHeight < SEA_LEVEL) growTree(map, x, mHeight - 1, z);
      if (mHeight == 34) map[x][mHeight][z] = 13;

      // ore / cave generation
      for (let y = SEA_LEVEL - 5; y < 64; y++) {

        // lava generation
        if (y > 48) {
          const lava = perlin(x / MAP_SCALE * 4, y / MAP_SCALE * 2, z / MAP_SCALE * 4);
          if (lava > 0.55 && lava < 0.6) {
            const existingBlock = map[x][y][z];
            if (ALLOWED_CAVE_GENERATE_OVER_BLOCKS[existingBlock]) {
              map[x][y][z] = 10;
            }
          }
        }


        // cave generation
        const cave = perlin(x / MAP_SCALE * 2, y / MAP_SCALE * 4, z / MAP_SCALE * 2);
        if (cave > 0.35 && cave < 0.8) {
          const existingBlock = map[x][y][z];
          if (ALLOWED_CAVE_GENERATE_OVER_BLOCKS[existingBlock]) {
            map[x][y][z] = 0;
            // if (cave < 0.355) map[x][y][z] = 14; // ruby
            // if (cave < 0.351) map[x][y][z] = 15; // gold
            // if (cave < 0.3505) map[x][y][z] = 16; // diamond
          }
        }

        // ore generation
        const ore = perlin(x / MAP_SCALE * 8, y / MAP_SCALE * 8, z / MAP_SCALE * 8);  
        if (ore > 0.2 && ore < 0.8) {
          const existingBlock = map[x][y][z];
          if (ALLOWED_CAVE_GENERATE_OVER_BLOCKS[existingBlock]) {
            if (y < 50 && ore > 0.2 && ore < 0.21) map[x][y][z] = 14; // ruby
            else if (y > 42 && y < 50  && ore > 0.55 && ore < 0.6) map[x][y][z] = 15; // gold
            else if (y > 48 && ore > 0.7) map[x][y][z] = 16; // diamond
          }
        }

        // 'bedrock layer'
        if (y > 61) {
          if (y == 63) map[x][y][z] = 11;
          else {
            const bedrock = perlin(x / MAP_SCALE * 64, y / MAP_SCALE * 64, z / MAP_SCALE * 64);
            if (bedrock > 0.1) map[x][y][z] = 11;
          }
        }


      }

    }
  }

  return map;
}