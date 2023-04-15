import { enc } from "./enc";
import { execute } from "./execute";
import { init } from "./init";
import { key } from "./key";
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
} from "./Message";

let matron: Matron | null = null;
let canvas: OffscreenCanvas | null = null;

const fps = 15;
const oneSec = 1000;
let prevTimestamp = 0;

function render(timestamp: number): void {
  if (matron && canvas) {
    execute(matron, canvas, "");
  }
  const dt = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  const remainingDt = oneSec / fps - dt;
  const timeout = Math.max(remainingDt, 0);
  setTimeout(() => requestAnimationFrame(render), timeout);
}

function handleTransferCanvas(message: Offscreen): void {
  if (canvas !== null) {
    postMessage(result(message, "Canvas has already been transferred"));
    return;
  }

  canvas = message.canvas;
  postMessage(result(message));

  requestAnimationFrame(render);
}

function handleInit(message: Init): void {
  if (matron === null) {
    postMessage(result(message, "Matron is not loaded"));
    return;
  }

  if (canvas === null) {
    postMessage(result(message, "Canvas was not transferred"));
    return;
  }

  init(matron, canvas);
  postMessage(result(message));
}

function handleKey(message: Key): void {
  if (matron === null) {
    postMessage(result(message, "Matron is not loaded"));
    return;
  }

  if (canvas === null) {
    postMessage(result(message, "Canvas was not transferred"));
    return;
  }

  const { n, isDown } = message;
  key(matron, canvas, n, isDown);
  postMessage(result(message));
}

function handleEnc(message: Enc): void {
  if (matron === null) {
    postMessage(result(message, "Matron is not loaded"));
    return;
  }

  if (canvas === null) {
    postMessage(result(message, "Canvas was not transferred"));
    return;
  }

  const { n, d } = message;
  enc(matron, canvas, n, d);
  postMessage(result(message));
}

function handleExecute(message: Execute): void {
  if (matron === null) {
    postMessage(result(message, "Matron is not loaded"));
    return;
  }

  if (canvas === null) {
    postMessage(result(message, "Canvas was not transferred"));
    return;
  }

  const { code, shouldInit } = message;
  execute(matron, canvas, code, shouldInit);
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
