const { getBlock } = require('./utils');

const keyState = {
  forward: 0,
  backward: 0,
  strafeLeft: 0,
  strafeRight: 0,
  jump: 0,
  jumping: 0
};

module.exports = {
  applyGravity: () => {
    const { AMP, STR } = window.game.CONST.JMP;
    const { player } = window.game;
    let { x, y, z } = player;
    y += 2;
    const feet = getBlock(x,y,z);

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
      const nextPosition = getBlock(x,player.y + player.velocity, z); // calculate head
      if (nextPosition == 0) player.y += player.velocity;
      return;
    }

    // if decending (feet in air)
    if (feet == 0) {
      if (player.velocity < 3) player.velocity += 0.2; // if not at terminal velocity, increase velocity

      // check that next position is safe
      const nextY = player.y + (0.1 * player.velocity);
      const nextPosition = getBlock(x, Math.ceil(nextY) + 1, z); // calculate feet
      player.y = nextPosition == 0 ? nextY : nextY | 0;
      return;
    }

    // we hit the ground. stop velocity
    player.velocity = 0;
  },

  calculateMovement: () => {
    const { player } = window.game;
    
    if (
      !keyState.forward &&
      !keyState.backward &&
      !keyState.strafeLeft &&
      !keyState.strafeRight
    ) return;
    
    let x = player.x;
    let y = player.y + 1.8; // 1.8 is player height. 1.8 meters
    let z = player.z;
    const playerYawSin = Math.sin(player.yaw) / 8;
    const playerYawCos = Math.cos(player.yaw) / 8;
    if (keyState.forward) {
      x += playerYawSin;
      z += playerYawCos;
    } else if (keyState.backward) {
      x -= playerYawSin;
      z -= playerYawCos;
    }
    
    const playerYawHalfPI = player.yaw - Math.PI / 2;
    const playerYawHalfPISin = Math.sin(playerYawHalfPI) / 8;
    const playerYawHalfPICos = Math.cos(playerYawHalfPI) / 8;
    if (keyState.strafeLeft) {
      x += playerYawHalfPISin;
      z += playerYawHalfPICos;
    } else if (keyState.strafeRight) {
      x -= playerYawHalfPISin;
      z -= playerYawHalfPICos;
    }

    // detect collision via cube instead of exact coord.
    const inBlock = getBlock(x,y,z);
    if (inBlock == 0) {
      player.x = x;
      player.z = z;
    } else {
      const inBlockX = getBlock(x, y, player.z);
      const inBlockZ = getBlock(player.x, y, z);
      if (inBlockX == 0) player.x = x;
      else if (inBlockZ == 0) player.z = z;
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
      const k=e.keyCode;
      if(k==65)keyState.strafeLeft=1;
      else if(k==68)keyState.strafeRight=1;
      else if(k==87)keyState.forward=1;
      else if(k==83)keyState.backward=1;
      else if(k==32)keyState.jump=1;
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
      if (e.button != 0) return;
      let rayX = player.x,
          rayY = player.y,
          rayZ = player.z;
      for (var i = 0; i < 6 * 1000; i++) {
        const playerPitchCos = Math.cos(player.pitch);
        rayX += Math.sin(player.yaw) * playerPitchCos / 1000;
        rayY -= Math.sin(player.pitch) / 1000;
        rayZ += Math.cos(player.yaw) * playerPitchCos / 1000;
        if (getBlock(rayX, rayY, rayZ) > 0) {
          let currBlock = getBlock(rayX,rayY,rayZ);
          currBlock = (currBlock + 1) % 16;
          map[rayX | 0][rayY | 0][rayZ | 0] = currBlock || 1; // setBlock(rayX, rayY, rayZ, currBlock || 1, map);
          return;
        }
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
