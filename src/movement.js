import { BLOCKS_MAP } from './constants';
import { inventoryAdd, inventoryRemove } from './hotbar';
const {  getBlock } = require('./utils');

const keyState = {
  forward: 0,
  backward: 0,
  strafeLeft: 0,
  strafeRight: 0,
  jump: 0,
  jumping: 0,
  shift: 0,
};

module.exports = {
  applyGravity: () => {
    const { AMP, STR } = window.game.CONST.JMP;
    const { player } = window.game;
    let { x, y, z } = player;
    y += 2;
    const feet =  getBlock(x,y,z);

    // is standing. start jump
    if (keyState.jump && feet > 0) {
      player.velocity = -STR;
      keyState.jumping = 1;
    }

    // if ascending
    if (keyState.jumping) {
      player.velocity += player.velocity + STR + AMP;
      if (player.velocity > 0) {
        player.velocity = 0;
        keyState.jumping = 0;
      }

      // check that next position is safe
      const nextPosition =  getBlock(x,player.y + player.velocity, z); // calculate head
      if (nextPosition == 0) player.y += player.velocity; // air
      else if (nextPosition == 9) player.y += player.velocity / 8; // water
      return;
    }

    // if decending (feet in air)
    if (feet == 0 || feet == 9) {
      if (player.velocity < 3) player.velocity += 0.2; // if not at terminal velocity, increase velocity

      // check that next position is safe
      const nextY = player.y + (0.1 * player.velocity / (feet == 0 ? 1 : 4));
      const nextPosition =  getBlock(x, Math.ceil(nextY) + 1, z); // calculate feet
      player.y = (nextPosition == 0 || nextPosition == 9) ? nextY : nextY | 0;
      return;
    }

    // we hit the ground. stop velocity
    player.velocity = 0;
  },

  calculateMovement: () => {
    const { player } = window.game;
    const feet =  getBlock(player.x,player.y+1,player.z);
    
    if (
      !keyState.forward &&
      !keyState.backward &&
      !keyState.strafeLeft &&
      !keyState.strafeRight
    ) return;
    
    const speedModifier = feet == 9 ? 16 : 8;
    let x = player.x;
    let y = player.y + 1.8; // 1.8 is player height. 1.8 meters
    let z = player.z;
    const playerYawSin = Math.sin(player.yaw) / speedModifier;
    const playerYawCos = Math.cos(player.yaw) / speedModifier;
    if (keyState.forward) {
      x += playerYawSin;
      z += playerYawCos;
    } else if (keyState.backward) {
      x -= playerYawSin;
      z -= playerYawCos;
    }
    
    const playerYawHalfPI = player.yaw - Math.PI / 2;
    const playerYawHalfPISin = Math.sin(playerYawHalfPI) / speedModifier;
    const playerYawHalfPICos = Math.cos(playerYawHalfPI) / speedModifier;
    if (keyState.strafeLeft) {
      x += playerYawHalfPISin;
      z += playerYawHalfPICos;
    } else if (keyState.strafeRight) {
      x -= playerYawHalfPISin;
      z -= playerYawHalfPICos;
    }

    // detect collision via cube instead of exact coord.
    const inBlock =  getBlock(x,y,z);
    if (inBlock == 0 || inBlock == 9) {
      player.x = x;
      player.z = z;
    } else {
      const inBlockX =  getBlock(x, y, player.z);
      const inBlockZ =  getBlock(player.x, y, z);
      if (inBlockX == 0 || inBlockX == 9) player.x = x;
      else if (inBlockZ == 0 || inBlockZ == 9) player.z = z;
    }
  },
  
  init: () => {
    const { player, map } = window.game;
    const eL = document.addEventListener;
    const $game = document.getElementById("game");

    const moveCallback = e => {
      var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

      player.yaw = (player.yaw + movementX / 500) % 7.855;
      player.pitch = player.pitch - movementY / 1000;
      const hPI = Math.PI / 2,
            nhPI = -hPI;
      if (player.pitch < nhPI) player.pitch = nhPI;
      if (player.pitch > hPI) player.pitch = hPI;
    }

    $game.addEventListener("click", () => {
      $game.requestPointerLock = $game.requestPointerLock ||
      $game.mozRequestPointerLock ||
      $game.webkitRequestPointerLock;
      $game.requestPointerLock();
    });

    eL("keydown", e => {
      console.log('e', e.keyCode)
      const { game } = window;
      const k=e.keyCode;
      if(k==65)keyState.strafeLeft=1;
      else if(k==68)keyState.strafeRight=1;
      else if(k==87)keyState.forward=1;
      else if(k==83)keyState.backward=1;
      else if(k==32)keyState.jump=1;

      else if(k==48) game.hotbar.selected = 9; // number select, 0
      else if (k>=49 && k<=57) game.hotbar.selected = k - 49; // number select. 1-9
      
      else if(k==69) game.hotbar.side = game.hotbar.side ? 0 : 1; // e key. switch toolbar sides
    });
    
    eL("keyup", e => {
      const k=e.keyCode;
      if(k==65)keyState.strafeLeft=0;
      else if(k==68)keyState.strafeRight=0;
      else if(k==87)keyState.forward=0;
      else if(k==83)keyState.backward=0;
      else if(k==32)keyState.jump=0;
    });
    
    eL("click", e => {
      const { player, hotbar } = window.game;
      const { items } = hotbar;
      let rayX = player.x,
          rayY = player.y,
          rayZ = player.z;
      let previous = [];
      for (var i = 0; i < 6 * 1000; i++) {
        const playerPitchCos = Math.cos(player.pitch);
        rayX += Math.sin(player.yaw) * playerPitchCos / 1000;
        rayY -= Math.sin(player.pitch) / 1000;
        rayZ += Math.cos(player.yaw) * playerPitchCos / 1000;

        // ray found a block
        const blockId = getBlock(rayX, rayY, rayZ);
        let foundBlock = blockId > 0;

        // if not holding shift, then ignore lava and water
        if (
          !keyState.shift
          && (blockId == 9 || blockId == 10)
        ) {
          
          // todo: stop ray at water if not in the water. dont let block destruction through water from outside (since its not transparent)
          foundBlock = false;
        }

        if (foundBlock) {
          
          if (/* left click */ e.button === 0) {
            map[rayX | 0][rayY | 0][rayZ | 0] = 0;
            inventoryAdd(blockId);
          } 
          
          else if (/* right click */ e.button === 2) {
            const [ pRayX, pRayY, pRayZ ] = previous;
            const blockId = BLOCKS_MAP[hotbar.side][hotbar.selected];
            const count = items[blockId];
            if (!count) return;
            map[pRayX | 0][pRayY | 0][pRayZ | 0] = blockId || 1; // setBlock(rayX, rayY, rayZ, currBlock || 1, map);
            inventoryRemove(blockId);
          }
          return;
        }

        /* previous is used for building. It's the ray's last state before it hit a block.
        This is the position where we will build the block at [if right clicked] */
        previous = [ rayX, rayY, rayZ ];
      }
    });
    
    ;["pointer","mozpointer","webkitpointer"] // eslint-disable-line no-extra-semi
      .forEach(i => document.addEventListener(`${i}lockchange`, e => {
        const { pointerLockElement, mozPointerLockElement, webkitPointerLockElement } = document;
        const havePointer = pointerLockElement == $game || mozPointerLockElement == $game || webkitPointerLockElement == $game;
        document[havePointer ? 'addEventListener' : 'removeEventListener']("mousemove", moveCallback);
      }));
  }
};
