import { createWebSocket } from "./create-websocket";
import { DatapointRepository } from "./datapoint.repository";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { translateHex } from "./translate-hex";
import { WebSocket } from "ws";
import { plainToClass } from "class-transformer";
import { UplinkData } from "./dto/uplink-data";
import { validateSync } from "class-validator";

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

      // Only handle the data packet of the uplink.
      if (data?.cmd === "rx" && data?.port == 1) {
        // Validate incoming data.
        const uplinkData = plainToClass(UplinkData, data);
        const validationErrors = validateSync(uplinkData);
        if (validationErrors.length > 0) {
          console.error("Validation of uplink data failed: ", validationErrors);
          return;
        }

        this.onUplinkData(uplinkData);
        return;
      }

      console.info("Messsage wasn't handled: ", data);
    });
  }

  async onUplinkData(uplinkData: UplinkData) {
    if (!uplinkData.data) {
      console.error("No data in uplink data");
      return;
    }

    console.info("Uplink data: ", uplinkData.data);

    const [temperature, co2, humidity] = translateHex(uplinkData.data);
    const timestamp = new Date(uplinkData.ts);

    return this.dpRep.createDatapoint({
      timestamp,
      temperature,
      co2,
      humidity,
    });
  }
}
