import React, { useState } from "react";
import { MazeType, TileType } from "../utils/types";

interface UploadFileBoxProps {
  isDisabled: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadFileBox: React.FC<UploadFileBoxProps> = ({
  isDisabled,
  onFileChange,
}) => {
  const [error, setError] = useState<string | null>(null);

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
          onChange={onFileChange}
          disabled={isDisabled}
        />
      </label>
    </div>
  );
};
