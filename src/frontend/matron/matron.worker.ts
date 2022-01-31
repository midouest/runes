import { Matron } from "./Matron";
import {
  Execute,
  EXECUTE_TYPE,
  LOADING_TYPE,
  MatronWorkerMessage,
  Offscreen,
  OFFSCREEN_TYPE,
  Reset,
  RESET_TYPE,
  Restart,
  RESTART_TYPE,
  result,
} from "./MatronWorkerMessage";

let matron: Matron | null = null;
let canvas: OffscreenCanvas | null = null;

function render(): void {
  if (matron === null || canvas === null) {
    return;
  }

  const context = canvas.getContext("2d");
  if (context === null) {
    return;
  }

  const screen = matron.getScreen();
  const data = new ImageData(screen, 128, 64);
  context.putImageData(data, 0, 0);

  // requestAnimationFrame(render);
}

function handleTransferCanvas(message: Offscreen): void {
  if (canvas !== null) {
    postMessage(result(message, "Canvas has already been transferred"));
    return;
  }

  canvas = message.canvas;
  // requestAnimationFrame(render);
  postMessage(result(message));
}

function appendRedraw(code: string): string {
  return `${code}
screen.save()
redraw()
screen.restore()`;
}

function handleExecute(message: Execute): void {
  if (matron === null) {
    postMessage(result(message, "Matron is not loaded"));
    return;
  }

  const redraw = appendRedraw(message.code);
  matron.exec(redraw);
  render();
  postMessage(result(message));
}

function handleRestart(message: Restart): void {
  if (matron === null) {
    postMessage(result(message, "Matron is not loaded"));
    return;
  }

  matron.restart();
  postMessage(result(message));
}

function handleReset(message: Reset): void {
  if (matron === null) {
    postMessage(result(message, "Matron is not loaded"));
    return;
  }

  matron.reset();
  postMessage(result(message));
}

onmessage = (event: MessageEvent<MatronWorkerMessage>) => {
  switch (event.data.type) {
    case OFFSCREEN_TYPE:
      return handleTransferCanvas(event.data);

    case EXECUTE_TYPE:
      return handleExecute(event.data);

    case RESTART_TYPE:
      return handleRestart(event.data);

    case RESET_TYPE:
      return handleReset(event.data);
  }
};

async function load(): Promise<void> {
  matron = await Matron.load();
  postMessage(result({ type: LOADING_TYPE }));
}

load();
