export function connectWebSocket(
  host: string,
  port: number
): Promise<WebSocket> {
  const ws = new WebSocket(`ws://${host}:${port}`, ["bus.sp.nanomsg.org"]);

  return new Promise((resolve, reject) => {
    ws.addEventListener("open", () => resolve(ws), { once: true });
    ws.addEventListener("error", (event) => reject(event), { once: true });
  });
}
