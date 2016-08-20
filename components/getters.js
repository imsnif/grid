'use strict'

module.exports = function getters (state) {
  let ret = {}
  Object.keys(state).forEach(k => {
    ret[k] = {
      get: () => state[k],
      set: (val) => { state[k] = val }
    }
  })
  return ret
}
