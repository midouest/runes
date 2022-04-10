import { appendInit, appendRedraw } from "./code";
import { connectWebSocket } from "./connectWebSocket";
import { DEFAULT_MATRON_PORT, DEFAULT_NORNS_HOST } from "./constants";

export class RemoteMatron {
  static async connect(): Promise<RemoteMatron> {
    const ws = await connectWebSocket(DEFAULT_NORNS_HOST, DEFAULT_MATRON_PORT);
    return new RemoteMatron(ws);
  }

  private constructor(private _ws: WebSocket) {}

  execute(code: string, shouldInit?: boolean): void {
    const init = shouldInit ? appendInit(code) : code;
    const redraw = appendRedraw(init);
    this._send(redraw);
  }

  init(): void {
    const redraw = appendRedraw(appendInit());
    this._send(redraw);
  }

  disconnect(): void {
    this._ws.close();
  }

  private _send(message: string): void {
    this._ws.send(`${message}\n`);
  }
}
