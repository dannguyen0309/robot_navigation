import React, { useState } from "react";
import { MazeType, TileType } from "../utils/types";

interface UploadFileBoxProps {
  isDisabled: boolean;
  setMaze: (maze: MazeType) => void;
  setUploadedText: (txt: string | null) => void;
  setGrid: (grid: TileType[][]) => void;
  setStartTile: (tile: TileType) => void;
  setEndTile: (tile: TileType) => void;
  setIsGraphVisualized: (v: boolean) => void;
  setNodesCreated: (n: number) => void;
  setPathLength: (n: number | string) => void;
}

export const UploadFileBox: React.FC<UploadFileBoxProps> = ({
  isDisabled,
  setMaze,
  setUploadedText,
  setGrid,
  setStartTile,
  setEndTile,
  setIsGraphVisualized,
  setNodesCreated,
  setPathLength,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Check file type (should be text/plain)
    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      setError("Please upload a valid .txt file.");
      e.target.value = "";
      return;
    }
    const txt = await file.text();
    setUploadedText(txt);
    setMaze("NONE");
    setError(null);

    const res = await fetch("http://localhost:8000/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grid_text: txt }),
    });
    if (!res.ok) {
      setError("Error! Task failed successfully.");
      e.target.value = "";
      return;
    }
    const { n, m, start, goals, walls } = (await res.json()) as {
      n: number;
      m: number;
      start: [number, number];
      goals: [number, number][];
      walls: [number, number, number, number][];
    };

    // rebuild
    const newGrid: TileType[][] = Array.from({ length: n }, (_, r) =>
      Array.from({ length: m }, (_, c) => ({
        row: r,
        col: c,
        isStart: false,
        isEnd: false,
        isWall: false,
        isTraversed: false,
        isPath: false,
        distance: Infinity,
        parent: null,
      }))
    );
    newGrid[start[1]][start[0]].isStart = true;
    setStartTile(newGrid[start[1]][start[0]]);
    goals.forEach(([gx, gy]: [number, number]) => {
      newGrid[gy][gx].isEnd = true;
      setEndTile(newGrid[gy][gx]);
    });
    walls.forEach(([wx, wy, w, h]: [number, number, number, number]) => {
      for (let dy = 0; dy < h; dy++)
        for (let dx = 0; dx < w; dx++) newGrid[wy + dy][wx + dx].isWall = true;
    });
    setGrid(newGrid);
    setIsGraphVisualized(false);
    setNodesCreated(0);
    setPathLength(0);
    e.target.value = "";
  };

  return (
    <div className="w-full">
      {error && (
        <div className="w-70 fixed bottom-4 right-4 z-50 bg-red-400 border border-red-600 rounded-lg p-4 shadow-lg">
          <div role="alert" className="alert alert-error mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      <label
        htmlFor="grid-file"
        className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
      >
        <svg
          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <span className="text-gray-500">Upload .txt grid</span>
        <input
          id="grid-file"
          type="file"
          accept=".txt"
          className="hidden"
          onChange={handleFileChange}
          disabled={isDisabled}
        />
      </label>
    </div>
  );
};
