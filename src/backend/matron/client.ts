import WebSocket from "ws";
import { connectWebSocket } from "./websocket";

export class MatronClient {
  static async connect(host: string, port: number): Promise<MatronClient> {
    const ws = await connectWebSocket(host, port);
    return new MatronClient(ws);
  }

  constructor(private _ws: WebSocket) {}

  send(data: string): void {
    this._ws.send(data);
  }
}
