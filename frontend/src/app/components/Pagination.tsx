import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {} from "react-icons/fa";

export function Pagination({
  current,
  total,
  onPrev,
  onNext,
  onPageChange,
  className = "",
}: {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onPageChange: (idx: number) => void;
  className?: string;
}) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className={`w-full flex justify-center  ${className}`}>
      <nav
        aria-label="Pagination"
        className="isolate inline-flex -space-x-px rounded-md shadow-xs"
      >
        <button
          onClick={onPrev}
          disabled={current <= 0}
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon aria-hidden="true" className="size-5" />
        </button>
        {pages.map((page, idx) => (
          <button
            key={page}
            onClick={() => {
              if (idx !== current) {
                onPageChange(idx);
              }
            }}
            aria-current={idx === current ? "page" : undefined}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0
              ${
                idx === current
                  ? "z-10 bg-indigo-600 text-white"
                  : "text-white hover:bg-indigo-600"
              }
            `}
            disabled={idx === current}
          >
            {page}
          </button>
        ))}
        <button
          onClick={onNext}
          disabled={current >= total - 1}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon aria-hidden="true" className="size-5" />
        </button>
      </nav>
    </div>
  );
}
