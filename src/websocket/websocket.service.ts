import { createWebSocket } from "./create-websocket";
import { DatapointRepository } from "./datapoint.repository";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { translateHex } from "./translate-hex";
import { WebSocket } from "ws";

@Injectable()
export class WebSocketService implements OnModuleInit, OnModuleDestroy {
  #socket: WebSocket;

  constructor(private dpRep: DatapointRepository) {}

  async onModuleDestroy() {
    await this.#socket.close();
  }

  async onModuleInit() {
    this.#socket = await createWebSocket(
      "wss://iotnet.teracom.dk/app?token=vnoVQAAAABFpb3RuZXQudGVyYWNvbS5ka0AHfDGv873AtxYtbA-B0Sw=",
    );
    await this.initSocket();
  }

  async initSocket(): Promise<void> {
    this.#socket.on("message", (buffer: Buffer) => {
      const data = JSON.parse(buffer.toString());

      data.port == 1
        ? this.onMessage(data)
        : console.log("port is 2 - its the overhead");
    });
  }

  async onMessage(data: any) {
    const hexTranslatedData = translateHex(data.data);

    return this.dpRep.createDatapoint({
      // Check if data already contains a timestamp
      timestamp: new Date(),
      temperature: hexTranslatedData[0],
      co2: hexTranslatedData[1],
      humidity: hexTranslatedData[2],
    });
  }
}
