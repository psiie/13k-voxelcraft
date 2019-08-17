
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
