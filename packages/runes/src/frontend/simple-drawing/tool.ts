export type Tool =
  | "pixel"
  | "line"
  | "rectangle"
  | "arc"
  | "circle"
  | "curve"
  | "text";

export const TOOLS = [
  "pixel",
  "line",
  "rectangle",
  "arc",
  "circle",
  "curve",
  "text",
] as const;
