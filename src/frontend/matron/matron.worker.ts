import { Matron } from "./Matron";
import {
  Enc,
  ENC_TYPE,
  Execute,
  EXECUTE_TYPE,
  Init,
  INIT_TYPE,
  Key,
  KEY_TYPE,
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
  if (context === null || !matron.isDirty()) {
    return;
  }

  const screen = matron.getScreen();
  const data = new ImageData(screen, 128, 64);
  context.putImageData(data, 0, 0);
}

function handleTransferCanvas(message: Offscreen): void {
  if (canvas !== null) {
    postMessage(result(message, "Canvas has already been transferred"));
    return;
  }

  canvas = message.canvas;
  postMessage(result(message));
}

function appendRedraw(code: string): string {
  return `${code}
screen.save()
pcall(redraw)
screen.restore()`;
}

function handleInit(message: Init): void {
  if (matron === null) {
    postMessage(result(message, "Matron is not loaded"));
    return;
  }

  const redraw = appendRedraw("init()");
  matron.exec(redraw);
  postMessage(result(message));
}

function handleKey(message: Key): void {
  if (matron === null) {
    postMessage(result(message, "Matron is not loaded"));
    return;
  }

  const { n, isDown } = message;
  const z = Number(isDown);
  const redraw = appendRedraw(`key(${n},${z})`);
  matron.exec(redraw);
  postMessage(result(message));
}

function handleEnc(message: Enc): void {
  if (matron === null) {
    postMessage(result(message, "Matron is not loaded"));
    return;
  }

  const { n, d } = message;
  const redraw = appendRedraw(`enc(${n},${d})`);
  matron.exec(redraw);
  postMessage(result(message));
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

    case INIT_TYPE:
      return handleInit(event.data);

    case KEY_TYPE:
      return handleKey(event.data);

    case ENC_TYPE:
      return handleEnc(event.data);

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
