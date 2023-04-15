import { MatronProcess } from "./MatronProcess";
import {
  ANIMATE_TYPE,
  ENC_TYPE,
  ERR_TYPE,
  EXECUTE_TYPE,
  INIT_TYPE,
  KEY_TYPE,
  LOADING_TYPE,
  MatronMainMessage,
  MatronWorkerMessage,
  OFFSCREEN_TYPE,
  RESET_TYPE,
  RESTART_TYPE,
} from "./Message";

export class OffscreenMatron implements MatronProcess {
  static start(): Promise<OffscreenMatron> {
    return new Promise((resolve, reject) => {
      const onMessage = (event: MessageEvent<MatronMainMessage>) => {
        if (event.data.type === ERR_TYPE) {
          reject(event.data.error);
          return;
        }

        if (event.data.originalType !== LOADING_TYPE) {
          return;
        }

        worker.removeEventListener("message", onMessage);
        const matronWorker = new OffscreenMatron(worker);
        resolve(matronWorker);
      };

      const worker = new Worker(new URL("./matron.worker", import.meta.url), {
        name: "matron.worker",
        type: "module",
      });
      worker.addEventListener("message", onMessage);
    });
  }

  private _nextId = 0;

  private constructor(
    private _worker: Worker,
    private _messageTimeout = 2000
  ) {}

  setCanvas(canvas: HTMLCanvasElement): Promise<void> {
    const offscreen = canvas.transferControlToOffscreen();
    // There appears to be a type-mismatch between @types/offscreencanvas and
    // Typescript's dom typings. Typescript thinks OffscreenCanvas does not
    // implement Transferrable. However, this is the expected usage according to
    // the OffscreenCanvas docs.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this._send({ type: OFFSCREEN_TYPE, canvas: offscreen }, [
      offscreen as any,
    ]);
  }

  execute(code: string, shouldInit?: boolean): Promise<void> {
    return this._send({ type: EXECUTE_TYPE, code, shouldInit });
  }

  init(): Promise<void> {
    return this._send({ type: INIT_TYPE });
  }

  key(n: number, isDown: boolean): Promise<void> {
    return this._send({ type: KEY_TYPE, n, isDown });
  }

  enc(n: number, d: number): Promise<void> {
    return this._send({ type: ENC_TYPE, n, d });
  }

  restart(): Promise<void> {
    return this._send({ type: RESTART_TYPE });
  }

  reset(): Promise<void> {
    return this._send({ type: RESET_TYPE });
  }

  animate(enabled: boolean): Promise<void> {
    return this._send({ type: ANIMATE_TYPE, enabled });
  }

  shutdown(): void {
    this._worker.terminate();
  }

  private _send<T extends MatronWorkerMessage>(
    message: T,
    transfers: Transferable[] = []
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = this._nextId++;

      const onMessage = (event: MessageEvent<MatronMainMessage>) => {
        if (event.data.id !== id) {
          return;
        }

        this._worker.removeEventListener("message", onMessage);
        clearTimeout(timeoutId);
        resolve();
      };

      const timeoutId = setTimeout(() => {
        this._worker.removeEventListener("message", onMessage);
        reject("Message timeout exceeded");
      }, this._messageTimeout);

      this._worker.addEventListener("message", onMessage);
      this._worker.postMessage({ ...message, id }, transfers);
    });
  }
}
