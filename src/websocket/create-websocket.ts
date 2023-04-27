import { WebSocket } from "ws";

export function createWebSocket(url: string): Promise<WebSocket> {
  return new Promise<WebSocket>((resolve, reject) => {
    const socket = new WebSocket(url);

    socket.on("open", () => {
      console.log("Connected to WebSocket");
      resolve(socket);
    });

    socket.on("error", () => {
      console.log("Connection error to WebSocket");
      reject();
    });

    socket.on("close", () => {
      console.log("Connection to WebSocket closed");
      reject();
    });
  });
}
