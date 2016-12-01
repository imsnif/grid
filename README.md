# grid
This is a work in progress.

## API
### Grid - new Grid(width, height[, offset])
The Grid constructor is exported by the library.
The units of width, height and offset are dependent upon the implementation, but they will most likely be pixels.
##### Parameters
* **width:** The width of the grid. (eg. 1600)
* **height:** The height of the grid. (eg. 900)
* **offset:** If this grid is part of a larger grid system and needs to be offset, this optional parameter can be provided. (eg. {x: 100, y: 0})
##### State
* **offset:** The current offset of the grid (eg. {x: 100, y: 0})
* **width:** The current width of the grid (eg. 1600)
* **height:** The current height of the grid (eg. 900)
* **panes:** An array of pane objects currently present in the grid. See the Pane component for specifics.

#### Methods
##### **grid.add**(constructor, opts)
Adds a pane to the grid. If an x,y location is not specified, the grid chooses the upper-left-most free location based on the provided width/height.
###### Arguments
  * **constructor:** A constructor out of which the pane will be created. See Pane for more info.
  * **opts:**
    * **width** (**required**) - {integer} desired width of pane
    * **height** (**required**) - {integer} desired height of pane
    * **id** (**required**) - {string} desired id of pane - must be unique across this grid
    * **x** - {integer} desired x position of pane. Must be specified along with y or it will be ignored.
    * **y** - {integer} desired y position of pane. Mus tbe specified along with x or it will be ignored.
###### Returns
The created Pane Object
###### Side Effects
Creates a pane object and places it in the panes array of the state.
## License
MIT
