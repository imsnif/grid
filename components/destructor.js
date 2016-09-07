module.exports = function destructor (state, implementation) {
  return ({
    close: function destroy () {
      if (implementation && typeof implementation.close === 'function') {
        implementation.close(state)
      }
    }
  })
}
