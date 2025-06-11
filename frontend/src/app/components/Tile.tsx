"use client";

import { twMerge } from "tailwind-merge";
import {
  TILE_BASE,
  START_TILE_STYLE,
  END_TILE_STYLE,
  WALL_TILE_STYLE,
  TRAVERSED_TILE_STYLE,
  PATH_TILE_STYLE,
  MAX_ROWS,
} from "../utils/constants";
import { MouseFunction } from "../utils/types";
import { MapPinIcon, FlagIcon } from "@heroicons/react/24/solid";

interface TileProps {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isTraversed: boolean;
  isPath: boolean;
  onMouseDown: MouseFunction;
  onMouseUp: MouseFunction;
  onMouseEnter: MouseFunction;
}

export function Tile({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  isTraversed,
  isPath,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
}: TileProps) {
  let style = TILE_BASE;
  if (isStart) style = START_TILE_STYLE;
  else if (isEnd) style = END_TILE_STYLE;
  else if (isWall) style = WALL_TILE_STYLE;
  else if (isPath) style = PATH_TILE_STYLE;
  else if (isTraversed) style = TRAVERSED_TILE_STYLE;

  return (
    <div
      id={`${row}-${col}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseUp={() => onMouseUp(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      className={twMerge(
        style,
        "relative flex items-center justify-center w-7 h-7 transition-colors min-w-0 min-h-0",
        row === MAX_ROWS - 1 && "border-b",
        col === 0 && "border-l"
      )}
    >
      {isStart && <MapPinIcon className="w-6 h-6 text-white" />}
      {isEnd && <FlagIcon className="w-6 h-6 text-white" />}
    </div>
  );
}
