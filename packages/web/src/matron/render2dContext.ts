import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants";
import { Matron } from "./Matron";

export interface Canvas2dContext {
  getContext(
    contextId: "2d",
    contextAttributes?: CanvasRenderingContext2DSettings
  ): CanvasImageData | null;
}

export function render2dContext<T extends Canvas2dContext>(
  matron: Matron,
  canvas: T
): void {
  const context = canvas.getContext("2d");
  if (context === null || !matron.isDirty()) {
    return;
  }

  const screen = matron.getScreen();
  const data = new ImageData(screen, SCREEN_WIDTH, SCREEN_HEIGHT);
  context.putImageData(data, 0, 0);
}
