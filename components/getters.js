'use strict'

module.exports = function getters (state) {
  let ret = {}
  Object.keys(state).forEach(k => {
    ret[k] = {
      get: () => state[k],
      set: undefined, // disallow setting externally
      enumerable: true
    }
  })
  return ret
}
