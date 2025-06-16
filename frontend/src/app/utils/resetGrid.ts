import { START_TILE_CONFIGURATION, END_TILE_CONFIGURATION } from "./constants";
import { GridType } from "./types";

// Clears *everything* (walls, paths, traversals, parents)
// but leaves start/end tiles in place.
export function resetGridData(
  grid: GridType,
  start = START_TILE_CONFIGURATION,
  end = END_TILE_CONFIGURATION
): GridType {
  return grid.map((row) =>
    row.map((tile) => {
      const isEndpoint =
        (tile.row === start.row && tile.col === start.col) ||
        (tile.row === end.row && tile.col === end.col);
      return {
        ...tile,
        isWall: false,
        isTraversed: false,
        isPath: false,
        parent: null,
        // keep isStart/isEnd exactly as before
        isStart: tile.isStart,
        isEnd: tile.isEnd,
      };
    })
  );
}

// Clears *only* the previous search traces (path + traversals),
// leaving walls and endpoints intact.
export function resetSearchData(grid: GridType): GridType {
  return grid.map((row) =>
    row.map((tile) => ({
      ...tile,
      isTraversed: false,
      isPath: false,
      parent: null,
    }))
  );
}
