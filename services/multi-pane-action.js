const { getOppositeDirection, findBlockingPanes, inGrid, canShrinkPaneBy } = require('./grid-info')

module.exports = { pushOrShrinkPane, movePanesOutOfTheWay }

function pushOrShrinkPane (pane, direction, amount) {
  const oppositeDirection = getOppositeDirection(direction)
  pane.maxSize({[oppositeDirection]: true})
  const newLocationForPane = {x: pane.x + amount.x, y: pane.y + amount.y}
  const blockingPanes = findBlockingPanes(pane, newLocationForPane.x, newLocationForPane.y)
  const newLocationIsInOfGrid = inGrid(newLocationForPane, pane)
  const canBeShrunk = canShrinkPaneBy(pane, amount, direction)
  if (blockingPanes.length === 0 && newLocationIsInOfGrid) {
    pane.changeLocation(newLocationForPane.x, newLocationForPane.y)
    return true
  }
  if (blockingPanes.length > 0) {
    pane.maxLoc({[direction]: true})
    if (movePanesOutOfTheWay(pane, direction, amount)) {
      pane.changeLocation(newLocationForPane.x, newLocationForPane.y)
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
