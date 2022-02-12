import { Matron } from "./Matron";
import { appendRedraw, callKey } from "./code";
import { Canvas2dContext, render2dContext } from "./render2dContext";

export function key<T extends Canvas2dContext>(
  matron: Matron,
  canvas: T,
  n: number,
  isDown: boolean
): void {
  const redraw = appendRedraw(callKey(n, isDown));
  matron.exec(redraw);
  render2dContext(matron, canvas);
}
