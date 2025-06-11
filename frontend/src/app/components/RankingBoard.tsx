import { RankingEntry } from "../utils/types";

export function RankingBoard({ ranking }: { ranking: RankingEntry[] }) {
  return (
    <div className="p-4 border border-slate-700 rounded-xl shadow-lg w-80 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      <h2 className="text-xl font-bold mb-4 text-center tracking-wide">
        🏆 Ranking Board
      </h2>
      <table className="w-full text-sm border-separate border-spacing-y-1">
        <thead>
          <tr className="bg-slate-800">
            <th className="rounded-tl-lg px-2 py-1">#</th>
            <th className="px-2 py-1">Algorithm</th>
            <th className="px-2 py-1">Cells</th>
            <th className="px-2 py-1">Path</th>
            <th className="rounded-tr-lg px-2 py-1">Time (ms)</th>
          </tr>
        </thead>
        <tbody>
          {ranking.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-slate-300">
                No results yet
              </td>
            </tr>
          ) : (
            ranking.map((entry, idx) => (
              <tr
                key={entry.algorithm}
                className={
                  idx === 0
                    ? "bg-gradient-to-r from-yellow-400/30 to-green-400/20 font-bold text-yellow-200 shadow"
                    : idx === 1
                    ? "bg-gradient-to-r from-slate-700 to-slate-800 font-semibold text-slate-200"
                    : "bg-slate-800 text-slate-300"
                }
              >
                <td className="text-center px-2 py-1">{idx + 1}</td>
                <td className="px-2 py-1">
                  {entry.algorithm.replace(/_/g, " ")}
                </td>
                <td className="text-center px-2 py-1">{entry.cellsExplored}</td>
                <td className="text-center px-2 py-1">{entry.pathLength}</td>
                <td className="text-center px-2 py-1">{entry.runTime}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
