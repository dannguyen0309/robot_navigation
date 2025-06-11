"use client";

import { useState, useEffect } from "react";
import { usePathfinding } from "../hooks/usePathfinding";
import { useTile } from "../hooks/useTile";
import {
  START_TILE_CONFIGURATION,
  END_TILE_CONFIGURATION,
  MAZES,
  PATHFINDING_ALGORITHMS,
  SPEEDS,
  SPEED_TO_DELAY,
} from "../utils/constants";
import { createGrid } from "../utils/helpers";
import { runMazeAlgorithm } from "../utils/runMazeAlgorithm";
import { Select } from "./Select";
import { PlayButton } from "./PlayButton";
import { useSpeed } from "../hooks/useSpeed";
import {
  NavProps,
  SolveResponse,
  TileType,
  MazeType,
  AlgorithmType,
  SpeedType,
} from "../utils/types";
import { resetSearchData } from "../utils/resetGrid";
import { ToolSelector } from "./ToolSelector";
import { RandomizeButton } from "./RandomizeButton";

export function Nav({
  tool,
  setTool,
  isVisualizationRunningRef,
  setAllPaths,
  setAllVisited,
  setCurrentPathIndex,
  currentPathIndex,
  setRanking,
}: NavProps & { currentPathIndex: number }) {
  //  INITALIZE
  const { startTile, endTile, setStartTile, setEndTile } = useTile();
  const {
    maze,
    setMaze,
    grid,
    setGrid,
    isGraphVisualized,
    setIsGraphVisualized,
    algorithm,
    setAlgorithm,
  } = usePathfinding();
  const { speed, setSpeed } = useSpeed();

  const [uploadedText, setUploadedText] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [nodesCreated, setNodesCreated] = useState(0);
  const [pathLength, setPathLength] = useState<number | string>(0);

  // Add state for per-segment stats

  const [segmentNodesCreated, setSegmentNodesCreated] = useState<number[]>([]);
  const [segmentPathLength, setSegmentPathLength] = useState<number[]>([]);
  const [allVisited, setAllVisitedLocal] = useState<[number, number][][]>([]);
  const [allPaths, setAllPathsLocal] = useState<[number, number][][]>([]);

  // --------------- HANDLE BUTTON ----------------------------------
  // 1) Clear
  const handleClearGrid = () => {
    const fresh = createGrid(START_TILE_CONFIGURATION, END_TILE_CONFIGURATION);
    setGrid(fresh);
    setStartTile(
      fresh[START_TILE_CONFIGURATION.row][START_TILE_CONFIGURATION.col]
    );
    setEndTile(fresh[END_TILE_CONFIGURATION.row][END_TILE_CONFIGURATION.col]);
    setMaze("NONE");
    setUploadedText(null);
    setIsGraphVisualized(false);
    setNodesCreated(0);
    setPathLength(0);
    setTool("ADD_WALL");
  };

  // 2) Maze carving
  const handGenerateMaze = async (m: MazeType) => {
    setMaze(m);
    setUploadedText(null);
    setIsGraphVisualized(false);
    setNodesCreated(0);
    setPathLength(0);

    const base = createGrid(START_TILE_CONFIGURATION, END_TILE_CONFIGURATION);
    setGrid(base);
    setStartTile(
      base[START_TILE_CONFIGURATION.row][START_TILE_CONFIGURATION.col]
    );
    setEndTile(base[END_TILE_CONFIGURATION.row][END_TILE_CONFIGURATION.col]);

    if (m !== "NONE") {
      setIsDisabled(true);
      await runMazeAlgorithm({
        maze: m,
        grid: base,
        startTile,
        endTile,
        setIsDisabled,
        speed,
      });
      setGrid(base.slice());
      setIsDisabled(false);
    }
  };

  // 3) Solve / visualize
  const handlerRunVisualizer = async () => {
    if (isGraphVisualized) {
      setGrid((g) => resetSearchData(g));
      setIsGraphVisualized(false);
      return;
    }
    setIsDisabled(true);
    isVisualizationRunningRef.current = true;
    // pick text
    const n = grid.length;
    const m = grid[0].length;
    const header = `[${n},${m}]`;
    const startLine = `(${startTile.col},${startTile.row})`;

    // 2) Collect **all** goals from the grid state
    const goalTiles = grid
      .flat()
      .filter((t) => t.isEnd)
      .map((t) => `(${t.col},${t.row})`);
    // Join them with '|' just like your parser expects
    const goalsLine = goalTiles.join("|");

    // 3) Walls
    const wallLines: string[] = [];
    grid.forEach((row, r) =>
      row.forEach((t, c) => {
        if (t.isWall) wallLines.push(`(${c},${r},1,1)`);
      })
    );

    // 4) Final text payload
    const grid_text = [header, startLine, goalsLine, ...wallLines].join("\n");

    const algoMap: Record<AlgorithmType, string> = {
      DFS: "dfs",
      BFS: "bfs",
      A_STAR: "as",
      GREEDY_BEST_FIRST_SEARCH: "gbfs",
      BIDIRECTIONAL: "bd",
      FRINGE_SEARCH: "fs",
    };

    const res = await fetch("http://localhost:8000/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grid_text, algorithm: algoMap[algorithm] }),
    });
    if (!res.ok) {
      setIsDisabled(false);
      return;
    }

    const data = (await res.json()) as SolveResponse;
    const {
      visited,
      path,
      nodes_created,
      n: respN,
      m: respM,
      start: respStart,
      goals: respGoals,
      walls: respWalls,
    } = data;

    // rebuild fresh
    const newGrid: TileType[][] = Array.from({ length: respN }, (_, r) =>
      Array.from({ length: respM }, (_, c) => ({
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
    newGrid[respStart[1]][respStart[0]].isStart = true;
    respGoals.forEach(([gx, gy]) => (newGrid[gy][gx].isEnd = true));
    respWalls.forEach(([wx, wy, w, h]) => {
      for (let dy = 0; dy < h; dy++)
        for (let dx = 0; dx < w; dx++) newGrid[wy + dy][wx + dx].isWall = true;
    });
    setGrid(newGrid);

    // animate
    const sanitizedVisited = sanitizeSegments(data.visited);
    const sanitizedPath = sanitizeSegments(data.path);
    setAllVisitedLocal(sanitizedVisited);
    setAllPathsLocal(sanitizedPath);
    setAllVisited(sanitizedVisited);
    setAllPaths(sanitizedPath);
    setCurrentPathIndex(0);

    // Compute per-segment stats
    // If backend returns arrays,
    const perSegmentNodes = Array.isArray(nodes_created)
      ? nodes_created
      : sanitizedVisited.map((seg) => seg.length);
    const perSegmentPath = sanitizedPath.map((seg) => seg.length);
    setSegmentNodesCreated(perSegmentNodes);
    setSegmentPathLength(perSegmentPath);
    setNodesCreated(perSegmentNodes[0] || 0);
    setPathLength(perSegmentPath[0] || 0);

    const totalCellsExplored = perSegmentNodes.reduce((a, b) => a + b, 0);
    const totalPathLength = perSegmentPath.reduce((a, b) => a + b, 0);

    const startTime = performance.now();
    await animateAllSegments(
      sanitizedVisited,
      sanitizedPath,
      setGrid,
      setCurrentPathIndex,
      SPEEDS[speed].value * SPEED_TO_DELAY[speed]
    );
    const endTime = performance.now();
    const runTime = Math.round(endTime - startTime);

    setRanking((prev) => {
      // Remove old entry for this algorithm if exists
      const filtered = prev.filter((entry) => entry.algorithm !== algorithm);
      // Add new entry
      return [
        ...filtered,
        {
          algorithm,
          cellsExplored: totalCellsExplored,
          pathLength: totalPathLength,
          runTime,
        },
      ].sort((a, b) => a.runTime - b.runTime); // Sort by runTime
    });
    setIsGraphVisualized(true);
    isVisualizationRunningRef.current = false;
    setIsDisabled(false);
  };

  // 4) File upload → /parse
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const txt = await file.text();
    setUploadedText(txt);
    setMaze("NONE");

    const res = await fetch("http://localhost:8000/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grid_text: txt }),
    });
    if (!res.ok) {
      console.error("Parse error:", await res.text());
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

  const speedOptions = SPEEDS.map((s) => ({
    name: s.name,
    value: s.value.toString(),
  }));

  const handleRandomize = async () => {
    setIsDisabled(true);
    setMaze("NONE");
    setUploadedText(null);

    // FETCH RANDOM GRID TEXT FROM BACKEND
    const res = await fetch("http://localhost:8000/randomize", {
      method: "POST",
    });
    if (!res.ok) {
      console.error("Randomize error:", await res.text());
      setIsDisabled(false);
      return;
    }
    const { grid_text } = await res.json();

    // PARSE GRID
    const parseRes = await fetch("http://localhost:8000/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grid_text }),
    });

    if (!parseRes.ok) {
      console.error("Parse error (randomize):", await parseRes.text());
      setIsDisabled(false);
      return;
    }

    const { n, m, start, goals, walls } = await parseRes.json();

    //  DRAW NEW GRID
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
    setIsDisabled(false);
  };

  async function animateSegment(
    visited: [number, number][],
    path: [number, number][],
    setGrid: (fn: any) => void,
    speed: number
  ) {
    for (const [col, row] of visited) {
      setGrid((g: any) =>
        g.map((r: any, ri: number) =>
          r.map((tile: any, ci: number) =>
            ri === row && ci === col ? { ...tile, isTraversed: true } : tile
          )
        )
      );
      await new Promise((res) => setTimeout(res, speed));
    }
    for (const [col, row] of path) {
      setGrid((g: any) =>
        g.map((r: any, ri: number) =>
          r.map((tile: any, ci: number) =>
            ri === row && ci === col ? { ...tile, isPath: true } : tile
          )
        )
      );
      await new Promise((res) => setTimeout(res, speed));
    }
  }

  async function animateAllSegments(
    allVisited: [number, number][][],
    allPaths: [number, number][][],
    setGrid: (fn: any) => void,
    setCurrentPathIndex: (idx: number) => void,
    speed: number
  ) {
    for (let i = 0; i < allPaths.length; i++) {
      setCurrentPathIndex(i);
      // Only reset path/traversed, keep isStart/isEnd
      setGrid((g: any) =>
        g.map((row: any) =>
          row.map((tile: any) => ({
            ...tile,
            isPath: false,
            isTraversed: false,
          }))
        )
      );
      // Animate as before
      await animateSegment(allVisited[i], allPaths[i], setGrid, speed);
      // Remove or reduce this delay!
      if (speed > 10) await new Promise((res) => setTimeout(res, 100));
    }
  }

  // Helper to ensure array of array of [number, number]
  function sanitizeSegments(input: any): [number, number][][] {
    if (!Array.isArray(input)) return [[]];
    // If input is [ [number, number], ... ] (single segment), wrap it
    if (
      input.length > 0 &&
      Array.isArray(input[0]) &&
      typeof input[0][0] === "number"
    ) {
      return [input as [number, number][]];
    }
    // If input is [ [ [number, number], ... ], ... ]
    if (
      input.length > 0 &&
      Array.isArray(input[0]) &&
      Array.isArray(input[0][0])
    ) {
      return input as [number, number][][];
    }
    return [[]];
  }

  // Get currentPathIndex from props (parent manages it)
  // Add effect to update stats on page change
  useEffect(() => {
    // Only update if graph is visualized and we have data
    if (!isGraphVisualized) return;
    // allVisited and allPaths should be available from props or context
    // If not, you may need to pass them as props from the parent
    if (!allVisited || !allPaths) return;
    if (!allVisited[currentPathIndex] || !allPaths[currentPathIndex]) return;

    setGrid((g) =>
      g.map((row) =>
        row.map((tile) => ({
          ...tile,
          isTraversed: false,
          isPath: false,
        }))
      )
    );

    // Mark visited cells for this segment
    setGrid((g) =>
      g.map((row, rIdx) =>
        row.map((tile, cIdx) => {
          const isVisited = allVisited[currentPathIndex].some(
            ([col, row]) => row === rIdx && col === cIdx
          );
          return isVisited ? { ...tile, isTraversed: true } : tile;
        })
      )
    );

    // Mark path cells for this segment
    setGrid((g) =>
      g.map((row, rIdx) =>
        row.map((tile, cIdx) => {
          const isPath = allPaths[currentPathIndex].some(
            ([col, row]) => row === rIdx && col === cIdx
          );
          return isPath ? { ...tile, isPath: true } : tile;
        })
      )
    );
  }, [currentPathIndex, isGraphVisualized, allVisited, allPaths, setGrid]);

  // Add effect to update nodesCreated and pathLength when currentPathIndex changes, using the per-segment stats arrays. This ensures the correct stats are shown for each page.
  useEffect(() => {
    // Only update if graph is visualized and we have data
    if (!isGraphVisualized) return;
    if (!segmentNodesCreated.length || !segmentPathLength.length) return;
    setNodesCreated(segmentNodesCreated[currentPathIndex] || 0);
    setPathLength(segmentPathLength[currentPathIndex] || 0);
  }, [
    currentPathIndex,
    isGraphVisualized,
    segmentNodesCreated,
    segmentPathLength,
  ]);

  return (
    <nav className="flex flex-col space-y-4 p-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Toolbar */}
      <ToolSelector
        current={tool}
        onChange={(t) => setTool(t)}
        onClear={handleClearGrid}
        isDisabled={isDisabled}
      />

      {/* File Upload */}
      <label
        htmlFor="grid-file"
        className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
      >
        {" "}
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
      {/* Random Grid Button */}
      <RandomizeButton onClick={handleRandomize} isDisabled={isDisabled} />

      {/* Maze / Algorithm / Speed */}
      <div>
        <label className="block text-sm mb-1">Maze</label>
        <Select
          value={maze}
          options={MAZES}
          onChange={(e) => handGenerateMaze(e.target.value as MazeType)}
          isDisabled={isDisabled}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Algorithm</label>
        <Select
          value={algorithm}
          options={PATHFINDING_ALGORITHMS}
          onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
          isDisabled={isDisabled}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Speed</label>
        <Select
          value={speed.toString()}
          options={speedOptions}
          onChange={(e) => setSpeed(Number(e.target.value) as SpeedType)}
          isDisabled={isDisabled}
        />
      </div>

      {/* Play / Reset */}
      <PlayButton
        isDisabled={isDisabled}
        isGraphVisualized={isGraphVisualized}
        handlerRunVisualizer={handlerRunVisualizer}
      />

      {/* Stats */}
      {isGraphVisualized && (
        <div className="mt-4 text-sm space-y-1">
          <div>Cells explored: {nodesCreated}</div>
          <div>Path length: {pathLength}</div>
        </div>
      )}
    </nav>
  );
}
