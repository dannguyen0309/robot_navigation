import { SPEEDS, WALL_TILE_STYLE } from "../../../utils/constants";
import { getRandInt, isEqual, sleep } from "../../../utils/helpers";
import { GridType, SpeedType, TileType } from "../../../utils/types";
import recursiveDivision from "./recursiveDivision";

export async function horizontalDivision({
  grid,
  startTile,
  endTile,
  row,
  col,
  height,
  width,
  setIsDisabled,
  speed,
}: {
  grid: GridType;
  startTile: TileType;
  endTile: TileType;
  row: number;
  col: number;
  height: number;
  width: number;
  setIsDisabled: (disabled: boolean) => void;
  speed: SpeedType;
}) {
  const wallRow = row + getRandInt(0, height - 1) * 2 + 1; // Determine the row to place the wall
  const passageCol = col + getRandInt(0, width) * 2; // Determine the column to leave a passage

  for (let i = 0; i < 2 * width - 1; i += 1) {
    // Create the horizontal wall
    if (passageCol !== col + i) {
      if (
        !isEqual(grid[wallRow][col + i], startTile) && // Check if the current tile is not the start tile
        !isEqual(grid[wallRow][col + i], endTile) // Check if the current tile is not the end tile
      ) {
        grid[wallRow][col + i].isWall = true; // Set the current tile as a wall

        document.getElementById(
          `${wallRow}-${col + i}`
        )!.className = `${WALL_TILE_STYLE} animate-wall`; // Add wall style and animation
        await sleep(10 * SPEEDS.find((s) => s.value === speed)!.value - 5); // Wait for animation
      }
    }
  }

  // Recursively divide the sections above and below the wall
  const heightAboveWall = (wallRow - row - 1) / 2;
  const heightBelowWall = height - 1 - heightAboveWall;

  await recursiveDivision({
    grid,
    startTile,
    endTile,
    row,
    col,
    height: heightAboveWall,
    width,
    setIsDisabled,
    speed,
  });

  await recursiveDivision({
    grid,
    startTile,
    endTile,
    row: wallRow + 1,
    col,
    height: heightBelowWall,
    width,
    setIsDisabled,
    speed,
  });
}
