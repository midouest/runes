import { appendInit, appendRedraw } from "./code";
import { Matron } from "./Matron";
import { Canvas2dContext, render2dContext } from "./render2dContext";

export function execute<T extends Canvas2dContext>(
  matron: Matron,
  canvas: T,
  code: string = "",
  shouldInit?: boolean
): void {
  const init = shouldInit ? appendInit(code) : code;
  const redraw = appendRedraw(init);
  matron.exec(redraw);
  render2dContext(matron, canvas);
}
