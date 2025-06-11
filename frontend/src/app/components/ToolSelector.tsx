// src/app/components/ToolSelector.tsx
"use client";

import { twMerge } from "tailwind-merge";
import { ToolType } from "../utils/types";
import { BUTTON, toolDefs } from "../utils/constants";

interface ToolSelectorProps {
  current: ToolType;
  onChange: (t: ToolType) => void;
  onClear: () => void;
  isDisabled?: boolean;
}

export function ToolSelector({
  current,
  onChange,
  onClear,
  isDisabled = false,
}: ToolSelectorProps) {
  return (
    <div className="flex space-x-4">
      {(
        Object.entries(toolDefs) as [
          ToolType,
          {
            icon: React.FC<React.SVGProps<SVGSVGElement>>;
            activeBg: string;
            inactiveBg: string;
          }
        ][]
      ).map(([tool, { icon: Icon, activeBg, inactiveBg }]) => {
        // For CLEAR_GRID we call onClear; otherwise onChange(tool)
        const handleClick =
          tool === "CLEAR_GRID" ? onClear : () => onChange(tool);

        // Decide which background class to use
        const bgClass =
          tool === "CLEAR_GRID"
            ? activeBg // CLEAR is always red
            : current === tool
            ? activeBg // selected tool
            : inactiveBg; // unselected

        return (
          <button
            key={tool}
            onClick={handleClick}
            className={twMerge(
              BUTTON,
              bgClass,
              isDisabled && "opacity-50 pointer-events-none"
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </button>
        );
      })}
    </div>
  );
}
