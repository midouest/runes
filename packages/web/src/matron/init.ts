import { Matron } from "./Matron";
import { appendInit, appendRedraw } from "./code";
import { Canvas2dContext, render2dContext } from "./render2dContext";

export function init<T extends Canvas2dContext>(
  matron: Matron,
  canvas: T
): void {
  const redraw = appendRedraw(appendInit());
  matron.exec(redraw);
  render2dContext(matron, canvas);
}
