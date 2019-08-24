
const secondIntervalList = [];
function second(fn) {
  secondIntervalList.push(fn);
}

setInterval(() => {
  secondIntervalList.forEach(fn => fn());
}, 1000);

export default second;
