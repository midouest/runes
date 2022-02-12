import { Matron } from "./Matron";
import { appendRedraw, callEnc } from "./code";
import { Canvas2dContext, render2dContext } from "./render2dContext";

export function enc<T extends Canvas2dContext>(
  matron: Matron,
  canvas: T,
  n: number,
  d: number
): void {
  const redraw = appendRedraw(callEnc(n, d));
  matron.exec(redraw);
  render2dContext(matron, canvas);
}
