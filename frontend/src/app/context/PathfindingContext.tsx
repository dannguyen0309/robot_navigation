"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { AlgorithmType, GridType, MazeType } from "../utils/types";
import {
  START_TILE_CONFIGURATION,
  END_TILE_CONFIGURATION,
} from "../utils/constants";
import { createGrid } from "../utils/helpers";

interface PathfindingContextInterface {
  algorithm: AlgorithmType;
  setAlgorithm: Dispatch<SetStateAction<AlgorithmType>>;
  maze: MazeType;
  setMaze: Dispatch<SetStateAction<MazeType>>;
  grid: GridType;
  setGrid: Dispatch<SetStateAction<GridType>>;
  isGraphVisualized: boolean;
  setIsGraphVisualized: Dispatch<SetStateAction<boolean>>;
}

export const PathfindingContext = createContext<
  PathfindingContextInterface | undefined
>(undefined);

export const PathfindingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("BFS");
  const [maze, setMaze] = useState<MazeType>("NONE");
  const [grid, setGrid] = useState<GridType>(
    createGrid(START_TILE_CONFIGURATION, END_TILE_CONFIGURATION)
  );
  const [isGraphVisualized, setIsGraphVisualized] = useState<boolean>(false);

  return (
    <PathfindingContext.Provider
      value={{
        algorithm,
        setAlgorithm,
        maze,
        setMaze,
        grid,
        setGrid,
        isGraphVisualized,
        setIsGraphVisualized,
      }}
    >
      {children}
    </PathfindingContext.Provider>
  );
};
