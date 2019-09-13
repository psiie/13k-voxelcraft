import utils from '../utils';

function exits() {
  try {
    localStorage.getItem(null);
    return true;
  } catch (e) {
    return false;
  }
}

function safeGet(name) {
  return utils.tryCatch(() => localStorage.getItem(name)) || '';
}

function safeSet(name, value) {
  return utils.tryCatch(() => localStorage.setItem(name, value)) || '';
}

export default {
  safeGet: /*@__PURE__*/safeGet,
  safeSet: /*@__PURE__*/safeSet,
  exits,
};
