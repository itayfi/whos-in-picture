import clsx, { ClassValue } from "clsx";
import { twMerge } from "tw-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}
