import { WebSocket } from "ws";

export function createWebSocket(url: string): Promise<WebSocket> {
  return new Promise<WebSocket>((resolve, reject) => {
    const socket = new WebSocket(url);

    socket.on("open", () => {
      resolve(socket);
    });

    socket.on("error", () => {
      reject();
    });

    socket.on("close", () => {
      reject();
    });
  });
}
