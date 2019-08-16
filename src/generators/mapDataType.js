module.exports = () => {
  return (
    new Array(64).fill(0).map(
      () => new Array(64).fill(0).map(
        () => new Array(64).fill(0)
      )
    )
  );
}