// src/app/components/Select.tsx
import { ChangeEvent } from "react";

export function Select({
  value,
  onChange,
  options,
  isDisabled,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; name: string }[];
  isDisabled?: boolean;
}) {
  return (
    <select
      disabled={isDisabled}
      className="w-full sm:auto bg-gray-700 rounded-md cursor-pointer hover:bg-gray-800 transition p-2"
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value.toString()}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
