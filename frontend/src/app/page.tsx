"use client";

import { useEffect, useRef, useState } from "react";
import { PathfindingProvider } from "./context/PathfindingContext";
import { TileProvider } from "./context/TileContext";
import { SpeedProvider } from "./context/SpeedContext";
import { Nav } from "./components/Nav";
import { Grid } from "./components/Grid";
import { RankingEntry, ToolType } from "./utils/types";
import { Pagination } from "./components/Pagination";
import { RankingBoard } from "./components/RankingBoard";

export default function Page() {
  const isVisualizationRunningRef = useRef(false);
  const [tool, setTool] = useState<ToolType>("ADD_WALL");
  const [allPaths, setAllPaths] = useState<Array<Array<[number, number]>>>([]);
  const [allVisited, setAllVisited] = useState<Array<Array<[number, number]>>>(
    []
  );
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!gridContainerRef.current) return;
    const handleResize = () => {
      const rect = gridContainerRef.current?.getBoundingClientRect();
      if (rect) setGridSize({ width: rect.width, height: rect.height });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <PathfindingProvider>
      <TileProvider>
        <SpeedProvider>
          <div className="h-screen w-full flex flex-col bg-gradient-to-br from-slate-950 to-slate-800">
            <div className="flex-1 flex flex-col lg:flex-row relative">
              {/* Menu button for small/medium devices */}
              <button
                className="md:hidden fixed top-4 left-4 z-30 bg-slate-800 text-white rounded-full p-2 shadow-lg focus:outline-none"
                onClick={() => setShowSettings(true)}
                aria-label="Open settings menu"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {/* Settings pane */}
              <aside
                className={`w-full md:w-64 lg:w-80 flex flex-col gap-2 sm:gap-4 border-r border-slate-800 bg-slate-900/80 p-2 sm:p-4 overflow-auto rounded-b-xl lg:rounded-b-none lg:rounded-r-xl shadow-md lg:shadow-none mt-0 lg:mt-0 mb-2 lg:mb-0 z-20 transition-transform duration-300 md:static fixed top-0 left-0 h-full ${
                  showSettings ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
                style={{ maxWidth: 320 }}
              >
                {/* Close button for mobile */}
                <div className="flex justify-end md:hidden mb-2">
                  <button
                    className="text-white bg-slate-700 rounded-full p-1"
                    onClick={() => setShowSettings(false)}
                    aria-label="Close settings menu"
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col gap-2 sm:gap-4 w-full">
                  <Nav
                    tool={tool}
                    setTool={setTool}
                    isVisualizationRunningRef={isVisualizationRunningRef}
                    setCurrentPathIndex={setCurrentPathIndex}
                    currentPathIndex={currentPathIndex}
                    setAllPaths={setAllPaths}
                    setAllVisited={setAllVisited}
                    setRanking={setRanking}
                  />
                </div>
              </aside>
              {/* Main content: Grid and Ranking Board */}
              <main className="flex-1 flex flex-col items-center justify-center overflow-auto p-2 sm:p-6">
                <div className="w-full max-w-5xl flex flex-row items-start gap-4">
                  {/* Grid section */}
                  <div className="flex-1 flex flex-col items-center min-w-0 order-1">
                    <div
                      ref={gridContainerRef}
                      className="w-full h-full max-h-[80vh] aspect-square flex items-center justify-center bg-transparent"
                      style={{
                        maxWidth: "calc(100vw - 400px)",
                        maxHeight: "80vh",
                      }}
                    >
                      <Grid
                        tool={tool}
                        isVisualizationRunningRef={isVisualizationRunningRef}
                        currentPath={allPaths[currentPathIndex] || []}
                        currentVisited={allVisited[currentPathIndex] || []}
                        allPaths={allPaths}
                      />
                    </div>
                    {allPaths.length > 1 && (
                      <div className="w-full flex justify-center mt-2">
                        <Pagination
                          current={currentPathIndex}
                          total={allPaths.length}
                          onPrev={() =>
                            setCurrentPathIndex((i) => Math.max(i - 1, 0))
                          }
                          onNext={() =>
                            setCurrentPathIndex((i) =>
                              Math.min(i + 1, allPaths.length - 1)
                            )
                          }
                          onPageChange={setCurrentPathIndex}
                        />
                      </div>
                    )}
                  </div>
                  {/* Ranking Board always on the right */}
                  <div className="max-w-xs w-full md:w-64 md:pb-15 sm:p-15 lg:w-80 order-2 lg:pl-18">
                    <RankingBoard ranking={ranking} />
                  </div>
                </div>
              </main>
            </div>
          </div>
        </SpeedProvider>
      </TileProvider>
    </PathfindingProvider>
  );
}
