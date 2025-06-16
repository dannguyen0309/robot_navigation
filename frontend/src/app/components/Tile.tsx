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
  isJump?: boolean;
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
        // Extra small for iPhone/mobile, scale up for larger screens
        "relative flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-8 lg:h-8 transition-colors min-w-0 min-h-0",
        row === MAX_ROWS - 1 && "border-b",
        col === 0 && "border-l"
      )}
    >
      {isStart && (
        <MapPinIcon className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 text-white" />
      )}
      {isEnd && (
        <FlagIcon className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 text-white" />
      )}
    </div>
  );
}
