import { createWebSocket } from "./create-websocket";
import { DatapointRepository } from "./datapoint.repository";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
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
      "wss://iotnet.teracom.dk/app?token=vnoVQAAAABFpb3RuZXQudGVyYWNvbS5ka0AHfDGv873AtxYtbA-B0Sw",
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
    const hexTranslatedData = this.translateHex(data.data);

    return this.dpRep.createDatapoint({
      // Check if data already contains a timestamp
      timestamp: new Date(),
      temperature: hexTranslatedData[0],
      co2: hexTranslatedData[1],
      humidity: hexTranslatedData[2],
    });
  }

  translateHex(transformedData: string): number[] {
    // Get the first 6 hex digits (3 bytes) from the input string
    const hexSubstring = transformedData.substring(0, 6);

    // Convert the hex substring to a number
    const hexValue = parseInt(hexSubstring, 16);

    // Create an array to store the result values
    const result = new Array<number>(3);

    // Extract the bytes from the value
    for (let i = 0; i < 3; i++) {
      const byte = (hexValue >> (8 * (2 - i))) & 0xff;
      result[i] = byte;
    }

    // Return the result array
    return result;
  }
}
