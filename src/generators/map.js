const mapDataType = require('./mapDataType');
const Perlin = require("../vendor/perlin.skinny");
const perlin = Perlin(13370);

// function neighborCheck(xyz, desiredBlock) { // check if xyz is next to type block
//   const { map } = window.game;
//   const [xStart, yStart, zStart] = xyz;
  
  // for (let z=-1; z<2; z++) {
  //   for (let x=-1; x<2; x++) {
//       if (!z && !x) break;
//       const block = map[xStart + x][yStart][zStart + z];
//       if (block === desiredBlock) return true;
//     }
//   }
// }

function placeBlock(map, x, y, z, block, notBlock) {
  if (
    map[x] !== undefined
    && map[x][y] !== undefined
    && map[x][y][z] !== notBlock
  ) map[x][y][z] = block;
}

function _leavesCircle(map, x, y, z) {
  for (let nz=-1; nz<2; nz++) {
    for (let nx=-1; nx<2; nx++) {
      if (!nz && !nx) break;
      placeBlock(map, nx+x, y, nz+z, 8, 7);
      // map[nx + x][y][nz + z] = 7;
    }
  }
}

function growLeaves(map, x, y, z, height) {
  for (let i=height; i>0; i-=3) {
    _leavesCircle(map, x, y - i, z);
  }
}

function growTree(map, x, y, z) {
  const height = (x * y % 6) + 6;
  for (let i=0; i<height; i++) {
    map[x][y - i][z] = 7;
  }

  growLeaves(map, x, y, z, height);
}

module.exports = () => {
  const { SEA_LEVEL, MAP_SCALE } = window.game.CONSTANTS;
  const { MAP_SIZE } = window.game.CONSTANTS.SETTINGS;
  const map = mapDataType();
  
  // generate height-map
  const heightMap = new Array(MAP_SIZE);
  const treeMap = new Array(MAP_SIZE);
  for (let x = 0; x < MAP_SIZE; x++) {
    heightMap[x] = new Array(MAP_SIZE);
    treeMap[x] = new Array(MAP_SIZE);
    for (let z = 0; z < MAP_SIZE; z++) {
      // grass generation
      let height = perlin(x / MAP_SCALE, z / MAP_SCALE);
      height *= 10; // hill amplitude
      height += 32;
      height = Math.floor(height);
      heightMap[x][z] = height;

      // trees
      let pTrees = perlin(x / 2, z / 2);
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
      // const 
      map[x][mHeight][z] = mHeight <= SEA_LEVEL ? 1 : 13; // fill heightmap with grass
      for (let y = mHeight - 1; y > SEA_LEVEL; y--) map[x][y][z] = 9; // water fill 9
      for (let y = mHeight + 1; y < 64; y++) map[x][y][z] = 4; // underground fill
      // if (map[x][SEA_LEVEL - 1][z] === 1) map[x][SEA_LEVEL - 1][z] = 13; // sand on shore

      if (treeMap[x][z] <= -2 && mHeight < SEA_LEVEL) { // map[x][mHeight][z] === 1
        growTree(map, x, mHeight - 1, z);
        // map[x][mHeight - 1][z] = 7;
      }
    }
  }

  // for (let x = 0; x < MAP_SIZE; x++) {
  //   for (let z = 0; z < MAP_SIZE; z++) {
      
  //   }
  // }

  return map;
}