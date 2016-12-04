const { getOppositeDirection, findBlockingPanes, inGrid, canShrinkPaneBy } = require('./grid-info')

module.exports = { pushOrShrinkPane, movePanesOutOfTheWay, pushOrResizePanesOutOfTheWay }

function pushOrShrinkPane (pane, direction, amount) {
  const oppositeDirection = getOppositeDirection(direction)
  pane.maxSize(oppositeDirection)
  const newLocationForPane = {x: pane.x + amount.x, y: pane.y + amount.y}
  const blockingPanes = findBlockingPanes(pane, newLocationForPane.x, newLocationForPane.y)
  const newLocationIsInOfGrid = inGrid(newLocationForPane, pane)
  const canBeShrunk = canShrinkPaneBy(pane, amount, direction)
  if (blockingPanes.length === 0 && newLocationIsInOfGrid) {
    pane.changeLocation(newLocationForPane.x, newLocationForPane.y)
    return true
  }
  if (blockingPanes.length > 0) {
    pane.maxSize(direction)
    const paneNextLocation = {x: pane.x + amount.x, y: pane.y + amount.y}
    if (movePanesOutOfTheWay(pane, direction, amount)) {
      pane.changeLocation(paneNextLocation.x, paneNextLocation.y)
      return true
    }
  }
  if (canBeShrunk) {
    pane.decreaseSizeDirectional(
      direction,
      direction === 'left' || direction === 'right' ? Math.abs(amount.x) : Math.abs(amount.y)
    )
    return true
  }
  return false
}

function pushPane (pane, direction, amount) {
  const oppositeDirection = getOppositeDirection(direction)
  pane.maxSize(oppositeDirection)
  const newLocationForPane = {x: pane.x + amount.x, y: pane.y + amount.y}
  const blockingPanes = findBlockingPanes(pane, newLocationForPane.x, newLocationForPane.y)
  const newLocationIsInOfGrid = inGrid(newLocationForPane, pane)
  if (blockingPanes.length === 0 && newLocationIsInOfGrid) {
    pane.changeLocation(newLocationForPane.x, newLocationForPane.y)
    return true
  }
  if (blockingPanes.length > 0) {
    pane.maxLoc(direction)
    if (pushPanesOutOfTheWay(pane, direction, amount)) {
      pane.changeLocation(newLocationForPane.x, newLocationForPane.y)
      return true
    }
  }
  return false
}

function pushPanesOutOfTheWay (pane, direction, amount) {
  const {x, y} = {x: pane.x + amount.x, y: pane.y + amount.y}
  const adjacentPanes = findBlockingPanes(pane, x, y).map(p => pane.grid.getPane(p.id))
  const pushedSuccessfully = adjacentPanes.every(pane => pushPane(pane, direction, amount))
  if (!pushedSuccessfully) {
    return false
  } else {
    return true
  }
}

function resizePane (pane, direction, amount) {
  const oppositeDirection = getOppositeDirection(direction)
  pane.maxSize(oppositeDirection)
  const blockingPanes = findBlockingPanes(pane, amount.x, amount.y)
  const canBeShrunk = canShrinkPaneBy(pane, amount, direction)
  if (canBeShrunk) {
    pane.decreaseSizeDirectional(
      direction,
      direction === 'left' || direction === 'right' ? Math.abs(amount.x) : Math.abs(amount.y)
    )
    return true
  }
  if (blockingPanes.length > 0) {
    if (resizePanesOutOfTheWay(pane, direction, amount)) {
      const newLocationForPane = {x: parseInt(pane.x) + parseInt(amount.x), y: parseInt(pane.y) + parseInt(amount.y)}
      pane.changeLocation(newLocationForPane.x, newLocationForPane.y)
      return true
    }
  }
  return false
}

function resizePanesOutOfTheWay (pane, direction, amount) {
  const {x, y} = {x: pane.x + amount.x, y: pane.y + amount.y}
  const adjacentPanes = findBlockingPanes(pane, x, y).map(p => pane.grid.getPane(p.id))
  const pushedSuccessfully = adjacentPanes.every(pane => resizePane(pane, direction, amount))
  if (!pushedSuccessfully) {
    return false
  } else {
    return true
  }
}

function pushOrResizePanesOutOfTheWay (pane, direction, amount) {
  if (pushPanesOutOfTheWay(pane, direction, amount)) return true
  return resizePanesOutOfTheWay(pane, direction, amount)
}

function movePanesOutOfTheWay (pane, direction, amount) {
  const {x, y} = {x: pane.x + amount.x, y: pane.y + amount.y}
  const adjacentPanes = findBlockingPanes(pane, x, y).map(p => pane.grid.getPane(p.id))
  const clearedPanesSuccessfully = adjacentPanes.every(pane => pushOrShrinkPane(pane, direction, amount))
  if (!clearedPanesSuccessfully) {
    return false
  } else {
    return true
  }
}
