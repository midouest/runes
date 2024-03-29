import { Animator } from "./Animator";
import { enc } from "./enc";
import { execute } from "./execute";
import { init } from "./init";
import { key } from "./key";
import { loadMatronModule } from "./loadMatronModule";
import { Matron } from "./Matron";
import {
  Animate,
  ANIMATE_TYPE,
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
let animator: Animator<OffscreenCanvas> | null = null;

function handleTransferCanvas(message: Offscreen): void {
  if (canvas !== null) {
    postMessage(result(message, "Canvas has already been transferred"));
    return;
  }

  canvas = message.canvas;
  postMessage(result(message));
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

function handleAnimate(message: Animate): void {
  if (!(matron && canvas)) {
    postMessage(result(message, "Matron is not loaded"));
    return;
  }

  const { enabled } = message;
  if (!enabled) {
    animator?.stop();
  } else {
    animator = animator ?? new Animator(matron, canvas);
    animator.start();
  }

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

    case ANIMATE_TYPE:
      return handleAnimate(event.data);
  }
};

async function load(): Promise<void> {
  const wasm = await loadMatronModule();
  matron = new Matron(wasm);
  postMessage(result({ type: LOADING_TYPE }));
}

load();
