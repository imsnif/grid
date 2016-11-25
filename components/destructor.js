module.exports = function destructor (state) {
  return ({
    close: function destroy () {
      state.emit('close')
    }
  })
}
