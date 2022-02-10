import {
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
} from "./MatronWorkerMessage";

export class MatronWorker {
  static start(): Promise<MatronWorker> {
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
        const matronWorker = new MatronWorker(worker);
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

  transferCanvas(canvas: OffscreenCanvas): Promise<void> {
    // There appears to be a type-mismatch between @types/offscreencanvas and
    // Typescript's dom typings. Typescript thinks OffscreenCanvas does not
    // implement Transferrable. However, this is the expected usage according to
    // the OffscreenCanvas docs.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this._send({ type: OFFSCREEN_TYPE, canvas }, [canvas as any]);
  }

  execute(code: string): Promise<void> {
    return this._send({ type: EXECUTE_TYPE, code });
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
