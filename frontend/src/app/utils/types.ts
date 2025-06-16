export type AlgorithmType =
  | "DFS"
  | "BFS"
  | "A_STAR"
  | "GREEDY_BEST_FIRST_SEARCH"
  | "BIDIRECTIONAL"
  | "FRINGE_SEARCH";

export interface AlgorithmSelectType {
  name: string;
  value: AlgorithmType;
}

export type MazeType = "NONE" | "BINARY_TREE" | "RECURSIVE_DIVISION";
export interface MazeSelectType {
  name: string;
  value: MazeType;
}

export type TileType = {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isTraversed: boolean;
  isPath: boolean;
  distance: number;
  parent: TileType | null;
  isJump?: boolean;
};

export type GridType = TileType[][];
export type SpeedType = 3 | 2 | 1;
export interface SpeedSelectType {
  name: string;
  value: SpeedType;
}

export interface SolveResponse {
  visited: [TileType[]];
  path: [TileType[]];
  nodes_created: number;
  n: number;
  m: number;
  start: [number, number];
  goals: [number, number][];
  walls: [number, number, number, number][];
  jumps: [Array<[number, number]>];
}

export type ToolType =
  | "SET_START"
  | "ADD_GOAL"
  | "ADD_WALL"
  | "REMOVE_WALL"
  | "CLEAR_GRID";

export interface NavProps {
  tool: ToolType;
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
  isVisualizationRunningRef: React.MutableRefObject<boolean>;
  setAllPaths: React.Dispatch<
    React.SetStateAction<Array<Array<[number, number]>>>
  >;
  setAllVisited: React.Dispatch<
    React.SetStateAction<Array<Array<[number, number]>>>
  >;
  setCurrentPathIndex: React.Dispatch<React.SetStateAction<number>>;
  currentPathIndex: number;
  setRanking: React.Dispatch<React.SetStateAction<RankingEntry[]>>;
}
export interface GridProps {
  tool: ToolType;
  isVisualizationRunningRef: React.MutableRefObject<boolean>;
  currentPath: Array<[number, number]>;
  currentVisited: Array<[number, number]>;
  allPaths: [number, number][][];
}

export type MouseFunction = (row: number, col: number) => void;

export interface SingleSolveResult {
  visited: TileType[];
  path: TileType[];
}

export interface RankingEntry {
  algorithm: string;
  cellsExplored: number;
  pathLength: number;
  runTime: number; // ms
}
