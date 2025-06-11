import {
  MapPinIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import {
  AlgorithmSelectType,
  MazeSelectType,
  SpeedSelectType,
  ToolType,
  SpeedType,
} from "./types";

export const MAX_ROWS = 19;
export const MAX_COLS = 29;

export const START_TILE_CONFIGURATION = {
  row: 1,
  col: 1,
  isEnd: false,
  isWall: false,
  isPath: false,
  distance: 0,
  isStart: false,
  isTraversed: false,
  parent: null,
};

export const END_TILE_CONFIGURATION = {
  row: MAX_ROWS - 2,
  col: MAX_COLS - 2,
  isEnd: false,
  isWall: false,
  isPath: false,
  distance: 0,
  isStart: false,
  isTraversed: false,
  parent: null,
};

export const TILE_BASE = "border-t border-r border-sky-200 bg-transparent";
export const START_TILE_STYLE = TILE_BASE + " bg-red-600";
export const END_TILE_STYLE = TILE_BASE + " bg-green-600";
export const WALL_TILE_STYLE = TILE_BASE + " bg-gray-400";
export const PATH_TILE_STYLE = TILE_BASE + " bg-yellow-500";
export const TRAVERSED_TILE_STYLE = TILE_BASE + " bg-cyan-500";

export const MAZES: MazeSelectType[] = [
  { name: "No Maze", value: "NONE" },
  { name: "Binary Tree", value: "BINARY_TREE" },
  { name: "Recursive Division", value: "RECURSIVE_DIVISION" },
];

export const PATHFINDING_ALGORITHMS: AlgorithmSelectType[] = [
  { name: "Breadth First Search", value: "BFS" },
  { name: "Depth First Search", value: "DFS" },
  { name: "A* ", value: "A_STAR" },
  { name: "Greedy Best First Search", value: "GREEDY_BEST_FIRST_SEARCH" },
  { name: "Bi-Directional", value: "BIDIRECTIONAL" },
  { name: "Fringe Search", value: "FRINGE_SEARCH" },
];

export const SPEEDS: SpeedSelectType[] = [
  { name: "Slow", value: 3 },
  { name: "Medium", value: 2 },
  { name: "Fast", value: 1 },
];

export const SPEED_TO_DELAY: Record<SpeedType, number> = {
  3: 100, // Slow: 100ms per step
  2: 30, // Medium: 40ms per step
  1: 5, // Fast: 5ms per step
};

export const SLEEP_TIME = 8;

export const BUTTON =
  "w-10 h-10 ml-2 flex items-center justify-center rounded transition";

export const toolDefs: Record<
  ToolType,
  {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    activeBg: string;
    inactiveBg: string;
  }
> = {
  SET_START: {
    icon: MapPinIcon,
    activeBg: "bg-red-600 hover:bg-red-500",
    inactiveBg: "bg-gray-800 hover:bg-gray-700",
  },
  ADD_GOAL: {
    icon: FlagIcon,
    activeBg: "bg-green-700 hover:bg-green-600",
    inactiveBg: "bg-gray-800 hover:bg-gray-700",
  },
  ADD_WALL: {
    icon: PencilIcon,
    activeBg: "bg-yellow-600 hover:bg-yellow-500",
    inactiveBg: "bg-gray-800 hover:bg-gray-700",
  },
  REMOVE_WALL: {
    icon: TrashIcon,
    activeBg: "bg-indigo-600 hover:bg-indigo-500",
    inactiveBg: "bg-gray-800 hover:bg-gray-700",
  },
  CLEAR_GRID: {
    icon: XCircleIcon,
    activeBg: "bg-red-600 hover:bg-red-500",
    inactiveBg: "bg-gray-800 hover:bg-gray-700",
  },
};
