module.exports = /*@__PURE__*/ () => {
  const MAP_SIZE = window.game.CONST.MAP_SIZE;

  return (
    new Array(MAP_SIZE).fill(0).map(
      () => new Array(64).fill(0).map(
        () => new Array(MAP_SIZE).fill(0)
      )
    )
  );
}