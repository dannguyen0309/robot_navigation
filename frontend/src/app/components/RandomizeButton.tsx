import { MouseEventHandler } from "react";
import { FaRandom } from "react-icons/fa";

export function RandomizeButton({
  onClick,
  isDisabled,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isDisabled: boolean;
}) {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className="transition ease-in rounded-full p-2.5 shadow-md bg-indigo-500 hover:bg-indigo-600 border-none active:ring-indigo-300 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-30"
    >
      <FaRandom className="w-5 h-5" />
    </button>
  );
}
