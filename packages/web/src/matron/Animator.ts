import { Matron } from "./Matron";
import { execute } from "./execute";
import { Canvas2dContext } from "./render2dContext";

type TimeoutId = ReturnType<typeof setTimeout>;

const desiredFps = 15;
const msPerSec = 1000;
const baseTimeout = msPerSec / desiredFps;

export class Animator<T extends Canvas2dContext> {
  private _animationFrameId: number | null = null;
  private _timeoutId: TimeoutId | null = null;
  private _prevTimestamp = 0;

  constructor(private _matron: Matron, private _canvas: T) {}

  start(): void {
    if (this._animationFrameId != null) {
      return;
    }
    this._requestRender();
  }

  stop(): void {
    if (this._animationFrameId != null) {
      cancelAnimationFrame(this._animationFrameId);
    }
    this._animationFrameId = null;

    if (this._timeoutId != null) {
      clearTimeout(this._timeoutId);
    }
    this._timeoutId = null;
  }

  private _requestRender(): void {
    this._animationFrameId = requestAnimationFrame((time) =>
      this._render(time)
    );
  }

  private _render(timestamp: number): void {
    execute(this._matron, this._canvas);

    const dt = timestamp - this._prevTimestamp;
    this._prevTimestamp = timestamp;

    const remainingDt = baseTimeout - dt;
    const timeout = Math.max(remainingDt, 0);
    this._timeoutId = setTimeout(() => {
      this._requestRender();
    }, timeout);
  }
}
