module.exports = () => {
  const MAP_SIZE = window.game.CONSTANTS.SETTINGS.MAP_SIZE;

  return (
    new Array(MAP_SIZE).fill(0).map(
      () => new Array(64).fill(0).map(
        () => new Array(MAP_SIZE).fill(0)
      )
    )
  );
}