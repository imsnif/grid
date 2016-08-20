'use strict'

// electron BrowserWindow implementation

module.exports = {
  changeSize: (state, width, height) => {
    const bounds = state.wrapped.getBounds()
    state.wrapped.setBounds(Object.assign({}, bounds, {width, height}))
  },
  changeLocation: (state, x, y) => {
    const bounds = state.wrapped.getBounds()
    state.wrapped.setBounds(Object.assign({}, bounds, {x, y}))
  }
}
