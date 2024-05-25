import { Fragment } from "react";
import { cn } from "../lib/utils";
import { STAGES } from "../lib/consts";

export const StagesProgress = ({ stage }: { stage: number; }) => (
  <div className="flex flex-row items-center justify-center my-5">
    {[...new Array(STAGES)].map((_, i) => (
      <Fragment key={i}>
        <div
          className={cn(
            "rounded-full size-6 bg-gray-200 text-gray-700 relative text-center transition-colors",
            {
              "bg-yellow-300 font-bold": i <= stage,
            }
          )}
        >
          {i + 1}
        </div>
        {i < 6 && (
          <div
            className={cn("h-2 w-6 -mx-1 bg-gray-200 transition-colors", {
              "bg-yellow-300": i < stage,
            })} />
        )}
      </Fragment>
    ))}
  </div>
);
