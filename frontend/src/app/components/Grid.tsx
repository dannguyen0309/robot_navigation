// components/Grid.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathfinding } from "../hooks/usePathfinding";
import { useTile } from "../hooks/useTile";
import { Tile } from "./Tile";
import { GridProps } from "../utils/types";

export function Grid({
  tool,
  isVisualizationRunningRef,
  currentPath,
  currentVisited,
  allPaths,
}: GridProps & { currentVisited: [number, number][] }) {
  const { grid, setGrid } = usePathfinding();
  const { setStartTile, setEndTile } = useTile();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);

  useEffect(() => {
    if (!currentPath || currentPath.length === 0) return;
    setGrid((g) =>
      g.map((row, r) =>
        row.map((tile, c) => ({
          ...tile,
          isStart: r === currentPath[0][1] && c === currentPath[0][0],
          isEnd:
            r === currentPath[currentPath.length - 1][1] &&
            c === currentPath[currentPath.length - 1][0],
        }))
      )
    );
  }, [currentPath, allPaths, setGrid]);
  // When mouse goes down on a tile
  const handleDown = (r: number, c: number) => {
    if (isVisualizationRunningRef.current) return;
    setIsMouseDown(true);

    switch (tool) {
      case "SET_START":
        // clear any existing start...
        // Build the new grid first
        const cleared = grid.map((row) =>
          row.map((t) => ({ ...t, isStart: false }))
        );
        const newGrid = cleared.map((row) => [...row]);
        newGrid[r][c].isStart = true;

        // Update both contexts *separately*
        setGrid(newGrid);
        setStartTile(newGrid[r][c]);
        break;

      case "ADD_GOAL":
        setGrid((g) =>
          g.map((row) =>
            row.map((t) =>
              t.row === r && t.col === c ? { ...t, isEnd: !t.isEnd } : t
            )
          )
        );
        break;

      case "ADD_WALL":
        setGrid((g) =>
          g.map((row) =>
            row.map((t) =>
              t.row === r && t.col === c ? { ...t, isWall: true } : t
            )
          )
        );
        break;

      case "REMOVE_WALL":
        setGrid((g) =>
          g.map((row) =>
            row.map((t) =>
              t.row === r && t.col === c ? { ...t, isWall: false } : t
            )
          )
        );
        break;
    }
  };

  const handleEnter = (r: number, c: number) => {
    if (
      isMouseDown &&
      (tool === "ADD_WALL" || tool === "REMOVE_WALL") &&
      !isVisualizationRunningRef.current
    ) {
      handleDown(r, c);
    }
  };

  const handleUp = () => setIsMouseDown(false);

  // dynamically pick up your grid dimensions
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  return (
    <div className="flex-1 p-10">
      <div
        className="inline-grid border-b-white border border-slate-700 shadow-inner"
        style={{
          // create `cols` equal-width columns,
          // and force each row to keep square tiles
          gridTemplateColumns: `repeat(${cols}, auto)`,
          gridAutoRows: `auto`,
        }}
      >
        {grid.flat().map((tile) => (
          <Tile
            key={`${tile.row}-${tile.col}`}
            row={tile.row}
            col={tile.col}
            isStart={tile.isStart}
            isEnd={tile.isEnd}
            isWall={tile.isWall}
            isTraversed={tile.isTraversed}
            isPath={tile.isPath}
            onMouseDown={() => handleDown(tile.row, tile.col)}
            onMouseUp={handleUp}
            onMouseEnter={() => handleEnter(tile.row, tile.col)}
          />
        ))}
      </div>
    </div>
  );
}
