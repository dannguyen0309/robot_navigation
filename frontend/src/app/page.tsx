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
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const checkWidth = () => {
      setIsWide(window.innerWidth >= 1500);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

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
              {/* Menu button for <1500px devices */}
              {!isWide && (
                <button
                  className="fixed top-4 left-4 z-30 bg-slate-800 text-white rounded-full p-2 shadow-lg focus:outline-none"
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
              )}
              {/* Settings pane */}
              <aside
                className={`
                  w-full md:w-64 lg:w-80 flex flex-col gap-2 sm:gap-4 border-r border-slate-800 bg-slate-900/80 p-2 sm:p-4 overflow-auto rounded-b-xl lg:rounded-b-none lg:rounded-r-xl shadow-md lg:shadow-none mt-0 lg:mt-0 mb-2 lg:mb-0 z-20 transition-transform duration-300
                  ${isWide ? "static" : "fixed top-0 left-0 h-full"}
                  ${
                    isWide || showSettings
                      ? "translate-x-0 pointer-events-auto"
                      : "-translate-x-full w-0 pointer-events-none"
                  }
                `}
                style={{ maxWidth: 320 }}
              >
                {/* Close button for mobile */}
                {!isWide && (
                  <div className="flex justify-end mb-2">
                    <button
                      className="text-white bg-slate-700 rounded-full p-1"
                      onClick={() => setShowSettings(false)}
                      aria-label="Close settings menu"
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
                )}
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
                <div className="w-full max-w-5xl flex flex-col xl:flex-row items-center xl:items-start gap-4">
                  {/* Ranking Board above grid on small devices, right on >=1250px */}
                  <div className="w-full max-w-xs xl:max-w-xs xl:w-64 xl:pb-15 sm:p-15 order-1 xl:order-2 flex-shrink-0">
                    <RankingBoard ranking={ranking} />
                  </div>
                  {/* Grid section */}
                  <div className="w-full flex flex-col items-center min-w-0 order-2 xl:order-1">
                    <div
                      ref={gridContainerRef}
                      className="w-full h-full max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] lg:max-h-[80vh] aspect-square flex items-center justify-center bg-transparent"
                      style={{
                        maxWidth: isWide ? "calc(100vw - 400px)" : "100vw",
                        maxHeight: isWide
                          ? "80vh"
                          : window.innerWidth < 640
                          ? "60vh"
                          : window.innerWidth < 768
                          ? "70vh"
                          : "75vh",
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
                </div>
              </main>
            </div>
          </div>
        </SpeedProvider>
      </TileProvider>
    </PathfindingProvider>
  );
}
