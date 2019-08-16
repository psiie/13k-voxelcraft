const movement = require("../movement");
const render = require("./render");
let pid; // useful for pausing

function tick() {
  movement.applyGravity();
  movement.calculateMovement();
  render();
}

module.exports = {
  init: () => pid = setInterval(tick, 1000 / 100),
}