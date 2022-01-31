import WebSocket from "ws";

export function connectWebSocket(
  host: string,
  port: number
): Promise<WebSocket> {
  const ws = new WebSocket(`ws://${host}:${port}`, ["bus.sp.nanomsg.org"]);
  return new Promise((resolve, reject) => {
    ws.once("open", () => resolve(ws));
    ws.once("error", (err: Error) => reject(err));
  });
}
