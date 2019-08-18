
// todo: wip. needs compression
window.getMap = () => {
  const stringify = map => map.map(
    x => x.map(
      y => y.map(
        z => z.toString(16)
      ).join('')
    ).join('')
  ).join('');

  const orig = stringify(window.game._map);
  const current = stringify(window.game.map);
  let final = '';

  for (let i=0; i<current.length; i++) {
    const a = orig[i]
    const b = current[i];
    final += a === b ? '-' : b;
  }

  return final;
}


function neighborCheck(xyz, desiredBlock) { // check if xyz is next to type block
  const { map } = window.game;
  const [xStart, yStart, zStart] = xyz;
  
  for (let z=-1; z<2; z++) {
    for (let x=-1; x<2; x++) {
      if (!z && !x) break;
      const block = map[xStart + x][yStart][zStart + z];
      if (block === desiredBlock) return true;
    }
  }
}

if (getBlock(rayX, rayY, rayZ) > 0) { // ray found a block
  let currBlock = getBlock(rayX,rayY,rayZ);
  currBlock = (currBlock + 1) % 16;
  // map[rayX | 0][rayY | 0][rayZ | 0] = currBlock || 1; // setBlock(rayX, rayY, rayZ, currBlock || 1, map);
  map[rayX | 0][rayY | 0][rayZ | 0] = 0; // setBlock(rayX, rayY, rayZ, currBlock || 1, map);
  return;
}

// set pixel: (hotbarY * (width * 4)) + (hotbarX * 4);