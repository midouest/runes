import { enc } from "./enc";
import { execute } from "./execute";
import { init } from "./init";
import { key } from "./key";
import { Matron } from "./Matron";
import { MatronProcess } from "./MatronProcess";

export class FallbackMatron implements MatronProcess {
  static async start(): Promise<FallbackMatron> {
    const matron = await Matron.load();
    return new FallbackMatron(matron);
  }

  private _canvas: HTMLCanvasElement | null = null;

  private constructor(private _matron: Matron) {}

  setCanvas(canvas: HTMLCanvasElement): Promise<void> {
    this._canvas = canvas;
    return Promise.resolve();
  }

  execute(code: string, shouldInit?: boolean): Promise<void> {
    if (this._canvas === null) {
      return Promise.reject("Canvas is not set");
    }

    execute(this._matron, this._canvas, code, shouldInit);
    return Promise.resolve();
  }

  init(): Promise<void> {
    if (this._canvas === null) {
      return Promise.reject("Canvas is not set");
    }

    init(this._matron, this._canvas);
    return Promise.resolve();
  }

  key(n: number, isDown: boolean): Promise<void> {
    if (this._canvas === null) {
      return Promise.reject("Canvas is not set");
    }

    key(this._matron, this._canvas, n, isDown);
    return Promise.resolve();
  }

  enc(n: number, d: number): Promise<void> {
    if (this._canvas === null) {
      return Promise.reject("Canvas is not set");
    }

    enc(this._matron, this._canvas, n, d);
    return Promise.resolve();
  }

  shutdown(): void {
    this._matron.deinit();
  }
}
